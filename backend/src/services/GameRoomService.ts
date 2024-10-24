import {
  ChatMessageDTO,
  ClientIsReadyMessageDTO,
  MessageDTO,
  ServerIsReadyMessageDTO,
  ServerNotReadyMessageDTO,
  ServerReadyMessageDTO,
  TimerDTO,
  buildDTO,
} from '@defferrard/algoo-core/src/dto';
import { GameRoomNotFoundException } from '@defferrard/algoo-core/src/exceptions/gameRoom';
import { Color, Player } from '@defferrard/algoo-core/src/game';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { assertNonNull } from '@defferrard/algoo-core/src/utils/assertions';
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

  async joinRoom(socket: Socket, user: User, room: string) {
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
      socket.broadcast.emit(MessageType.GAME_ROOM_JOIN, await player.toDTO());
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

  async leaveRoom(socket: PlayerSocket) {
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
    const dto = await buildDTO(MessageDTO, { playerId, datetime: new Date().toISOString() });
    socket.broadcast.emit(MessageType.GAME_ROOM_LEAVE, dto);
  }

  async sendMessage({ data: { room } }: PlayerSocket, message: ChatMessageDTO) {
    await this.socketRepository.broadcast(room, MessageType.GAME_ROOM_MESSAGE, message);
  }

  async isReady(socket: PlayerSocket, dto: ClientIsReadyMessageDTO) {
    const { room, player } = socket.data;
    if (dto.isReady === this.gameRoomRepository.isPlayerReady(room, player.user.uuid)) {
      return;
    }
    // Set the player's ready status
    const gameRoomReady: boolean = this.gameRoomRepository.setPlayerReady(room, player.user.uuid, dto.isReady);

    // Broadcast that the player is ready to all players in the room
    let isReadyMessageDTO: ServerIsReadyMessageDTO;
    if (dto.isReady) {
      this.gameRoomRepository.setPlayerTeam(room, player.user.uuid, dto.ownTeam);
      isReadyMessageDTO = await buildDTO(ServerReadyMessageDTO, { playerId: player.user.uuid });
    } else {
      isReadyMessageDTO = await buildDTO(ServerNotReadyMessageDTO, { playerId: player.user.uuid });
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

      const timerDTO = await buildDTO(TimerDTO, {
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
