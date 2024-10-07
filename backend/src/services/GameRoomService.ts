import {
  ChatMessageDTO,
  MessageDTO,
  ServerIsReadyMessageDTO,
  ServerNotReadyMessageDTO,
  ServerReadyMessageDTO,
} from '@defferrard/algoo-core/src/dto';
import { GameRoomNotFoundException } from '@defferrard/algoo-core/src/exceptions/gameRoom';
import { Color, Player } from '@defferrard/algoo-core/src/game';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { assertNonNull } from '@defferrard/algoo-core/src/utils/assertions';
import { plainToInstance } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import { GameRoomRepository, SocketRepository } from '~/repositories';
import PlayerSocket from '~/socket/sockets/PlayerSocket';
import { LOGGER } from '~/utils/logger';

@Service()
export default class GameRoomService {
  constructor(
    public gameRoomRepository: GameRoomRepository,
    public socketRepository: SocketRepository,
  ) {}

  joinRoom(socket: Socket, user: User, room: string) {
    try {
      // Fetch the game room. If it doesn't exist, an error will be thrown
      const gameRoom = this.gameRoomRepository.get(room);
      assertNonNull(gameRoom, GameRoomNotFoundException, room);
      this.socketRepository.save(socket, user);
      // Create a player and add it to the game room
      const player: Player = new Player({
        user,
        team: { color: Color.BLUE, uuid: uuid(), heroes: [] },
        isReady: false,
      });
      socket.data.player = player;
      socket.data.room = room;
      this.gameRoomRepository.addPlayer(room, player);
      // Broadcast the join event to all other players in the room
      socket.broadcast.emit(MessageType.GAME_ROOM_JOIN, player);
      return gameRoom.players;
    } catch (e) {
      LOGGER.error(e);
      // This async function is needed to avoid an exception due to disconnect a socket during it connection thread on a namespace.
      const callLater = async () => {
        socket.disconnect();
      };
      callLater();
    }
  }

  leaveRoom(socket: PlayerSocket) {
    const {
      data: {
        room,
        player: {
          user: { uuid: playerId },
        },
      },
    } = socket;
    // Remove the player from the game room
    this.gameRoomRepository.removePlayer(room, playerId);
    // Broadcast the leave event to all players in the room
    const dto = plainToInstance(MessageDTO, { playerId, datetime: new Date().toISOString() });
    socket.broadcast.emit(MessageType.GAME_ROOM_LEAVE, dto);
  }

  async sendMessage({ data: { room } }: PlayerSocket, message: ChatMessageDTO) {
    await this.socketRepository.broadcast(room, MessageType.GAME_ROOM_MESSAGE, message);
  }

  async isReady(socket: PlayerSocket, isReady: boolean) {
    const { room, player } = socket.data;
    // Set the player's ready status
    const gameRoomReady: boolean = this.gameRoomRepository.setPlayerReady(room, player.user.uuid, isReady);

    const baseDTO = {
      datetime: new Date().toISOString(),
      playerId: player.user.uuid,
      isReady: isReady,
    };

    // Broadcast that the player is ready to all players in the room
    let isReadyMessageDTO: ServerIsReadyMessageDTO;
    if (isReady) {
      isReadyMessageDTO = await transformAndValidate(ServerReadyMessageDTO, {
        ...baseDTO,
        ownTeam: {},
      });
      isReadyMessageDTO.ownTeam = {} as any;
    } else {
      isReadyMessageDTO = await transformAndValidate(ServerNotReadyMessageDTO, baseDTO);
    }
    this.socketRepository.broadcast(room, MessageType.GAME_ROOM_READY, isReadyMessageDTO);

    // If all players are ready
    if (gameRoomReady) {
      const delay = this.gameRoomRepository.startGame(
        // Will return the timer before starting the game to players
        room,
        (data) => {
          // Callback function, called when the game starts
          this.socketRepository.broadcast(room, MessageType.GAME_ROOM_START, data);
        },
      );

      const timerDTO = plainToInstance(MessageDTO, {
        datetime: new Date().toISOString(),
        endtime: new Date(Date.now() + delay).toISOString(),
      });

      // Tell all players in the room that the game is starting soon
      this.socketRepository.broadcast(room, MessageType.GAME_ROOM_STARTING, timerDTO);
    } else {
      this.gameRoomRepository.cancelStartGame(
        room,
        // Callback function, called when the game is cancelled
        () => this.socketRepository.broadcast(room, MessageType.CANCEL_GAME_ROOM_STARTING),
      );
    }
  }
}
