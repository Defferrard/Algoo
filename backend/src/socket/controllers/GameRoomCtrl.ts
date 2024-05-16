import { GameRoomRepository, SocketRepository } from '$/repositories';
import { BasicCtrl } from '$/socket/controllers/BasicCtrl';
import { LOGGER } from '$/utils/logger';
import { GameRoom, Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import {
  ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  NspParam,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
  SocketRequest,
} from 'socket-controllers';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';

const GAME_ROOM_UUID = 'gameRoomUUID';

@Service()
@SocketController(`/rooms/:${GAME_ROOM_UUID}`)
export class GameRoomCtrl extends BasicCtrl {

  constructor(
    public gameRoomRepository: GameRoomRepository,
    socketRepository: SocketRepository,
  ) {
    super(socketRepository);
  }

  @OnConnect()
  @EmitOnSuccess(MessageType.PUT_GAME_ROOM)
  onJoinRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @SocketRequest() req: Request,
    @NspParam(GAME_ROOM_UUID) room: string,
  ) {
    if (!isUUID(room)) {
      return socket.disconnect();
    }
    try {
      // Fetch the game room. If it doesn't exist, an error will be thrown
      const gameRoom: GameRoom = this.gameRoomRepository.get(room);
      // Call the parent onConnect method. Will save the user in the socket
      super.onConnect(socket, req);
      // Create a player and add it to the game room
      const player: Player = new Player(socket.data.user);
      socket.data.player = player;
      gameRoom.addPlayer(player);

      // Broadcast the join event to all other players in the room
      socket.broadcast.emit(MessageType.GAME_ROOM_JOIN, player);
      LOGGER.info(`Socket ${socket.id} joined room ${room}`);
      return gameRoom.players;
    } catch (e) {
      return socket.disconnect();
    }

  }

  @OnDisconnect()
  onLeaveRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @NspParam(GAME_ROOM_UUID) room: string,
  ) {
    // Call the parent onDisconnect method
    super.onDisconnect(socket);
    // Get the game room
    const gameRoom: GameRoom = this.gameRoomRepository.get(room);
    // Remove the player from the game room
    gameRoom.removePlayer(socket.data.user.uuid);
    // Broadcast the leave event to all players in the room
    this.broadcast(io, MessageType.GAME_ROOM_LEAVE, {
      room,
      ...socket.data.player,
    });
    LOGGER.info(`Socket ${socket.id} left room ${room}`);
  }

  @OnMessage(MessageType.GAME_ROOM_MESSAGE)
  onMessage(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    LOGGER.info(`Socket ${socket.data.user.uuid} sent message ${message}`);
    this.broadcast(io, MessageType.GAME_ROOM_MESSAGE, {
      room: socket.data.gameRoomUUID,
      datetime: new Date(),
      from: socket.data.player,
      message,
    });
  }

  override broadcast(
    io: Server,
    event: MessageType,
    message: any & { room: string },
  ) {
    const { room, ...restMessage } = message;
    super.broadcast(io.of(`/rooms/${message.room}`), event, restMessage);
  }
}