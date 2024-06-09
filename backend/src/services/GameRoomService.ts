import { IsReadyMessageDTO, MessageDTO } from '@defferrard/algoo-core/src/dto';
import { GameRoom, Player } from '@defferrard/algoo-core/src/game';
import { MessageType, User } from '@defferrard/algoo-core/src/socket';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { GameRoomRepository, SocketRepository } from '~/repositories';
import PlayerSocket from '~/socket/sockets/PlayerSocket';

@Service()
export default class GameRoomService {
  constructor(
    public gameRoomRepository: GameRoomRepository,
    public socketRepository: SocketRepository,
  ) {}

  joinRoom(socket: Socket, user: User, room: string) {
    try {
      // Fetch the game room. If it doesn't exist, an error will be thrown
      const gameRoom: GameRoom = this.gameRoomRepository.get(room);
      this.socketRepository.save(socket, user);
      // Create a player and add it to the game room
      const player: Player = new Player(socket.data.user);
      socket.data.player = player;
      socket.data.room = room;
      this.gameRoomRepository.addPlayer(room, player);
      // Broadcast the join event to all other players in the room
      socket.broadcast.emit(MessageType.GAME_ROOM_JOIN, player);
      return gameRoom.players;
    } catch (e) {
      // This async function is needed to avoid an exception due to disconnect a socket during it connection thread on a namespace.
      const callLater = async () => {
        socket.disconnect();
      };
      callLater();
    }
  }

  leaveRoom(socket: PlayerSocket) {
    const { room, player } = socket.data;
    // Remove the player from the game room
    this.gameRoomRepository.removePlayer(room, player.user.uuid);
    // Broadcast the leave event to all players in the room
    socket.broadcast.emit(MessageType.GAME_ROOM_LEAVE, player);
  }

  sendMessage({ data: { room, player } }: PlayerSocket, message: string) {
    this.socketRepository.broadcast(room, MessageType.GAME_ROOM_MESSAGE, {
      datetime: new Date(),
      from: player,
      message,
    });
  }

  isReady(socket: PlayerSocket, isReady: boolean) {
    const { room, player } = socket.data;
    // Set the player's ready status
    let gameRoomReady: boolean = this.gameRoomRepository.setPlayerReady(room, player.user.uuid, isReady);
    // Broadcast that the player is ready to all players in the room
    const message: IsReadyMessageDTO = {
      datetime: new Date(),
      from: socket.data.player,
      isReady,
    };

    this.socketRepository.broadcast(room, MessageType.GAME_ROOM_READY, {
      datetime: new Date(),
      from: socket.data.player,
      isReady,
    });

    // If all players are ready
    if (gameRoomReady) {
      // Tell all players in the room that the game is starting soon
      this.socketRepository.broadcast(
        room,
        MessageType.GAME_ROOM_STARTING,
        this.gameRoomRepository.startGame(
          // Will return the timer before starting the game to players
          room,
          (data) => {
            // Callback function, called when the game starts
            this.socketRepository.broadcast(room, MessageType.GAME_ROOM_START, data);
          },
        ),
      );
    } else {
      this.gameRoomRepository.cancelStartGame(
        room,
        // Callback function, called when the game is cancelled
        () => this.socketRepository.broadcast(room, MessageType.CANCEL_GAME_ROOM_STARTING),
      );
    }
  }
}
