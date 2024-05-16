import { Player } from '@defferrard/algoo-core/src/game';
import {
    MessageType,
    SocketStatus,
    User,
} from '@defferrard/algoo-core/src/socket';
import { Server, Socket } from 'socket.io';
import { LOGGER } from '../utils/logger';

export default class SocketUser extends User {

  readonly #server: Server;
  #socket: Socket;
  #rooms: { [key: string]: string } = {}; // Key = Room UUID, Value = Player UUID

  constructor(user: User, socket: Socket, server: Server) {
    super(user.uuid, user.name);
    this.#socket = socket;
    this.#server = server;

    this.#socket
      .on(MessageType.GAME_ROOM_JOIN, ({ roomUuid, player }: {
        roomUuid: string,
        player: Player
      }, callback) => this.onJoinRoom(roomUuid, player, callback))
      .on(MessageType.GAME_ROOM_LEAVE, (room: string) => this.onLeaveRoom(room))
      .on(MessageType.GAME_ROOM_MESSAGE, ({ roomUuid, message }: {
        roomUuid: string,
        message: string
      }) => this.onMessage(roomUuid, message))
      .on(MessageType.GAME_ROOM_READY, ({ roomUuid, isReady }: {
        roomUuid: string,
        isReady: boolean
      }) => this.onReady(roomUuid, isReady))
      .onAny((event, ...args: any[]) => LOGGER.info(`Socket ${this.uuid} sent event ${event}`));
  }


  leaveAllRooms() {
    for (const room in this.#rooms) {
      this.onLeaveRoom(room);
    }
  }

  disconnect() {
    this.leaveAllRooms();
    this.#socket.disconnect(true);
  }

  getPlayer(roomUuid: string): Player | undefined {
    return gameRoomRepository.get(roomUuid)?.getPlayer(this.uuid);
  }

  emit(event: string, roomUuid: string, data: any = {}): boolean {
    return this.#socket.to(roomUuid).emit(event, data);
  }

  serverEmit(event: string, roomUuid: string, data: any = {}): boolean {
    return this.#server.to(roomUuid).emit(event, data);
  }

  get socket(): Socket {
    return this.#socket;
  }

  set socket(socket: Socket) {
    this.#socket = socket;
  }

  onJoinRoom(roomUuid: string, player: Player, callback: (data: any) => void): any {
    LOGGER.info(`Socket ${this.uuid} joined room ${roomUuid}`);
    this.#socket.join(roomUuid);
    try {
      gameRoomRepository.addPlayer(roomUuid, player);
      this.emit(MessageType.GAME_ROOM_JOIN, roomUuid, player);
      this.#rooms[roomUuid] = player.user.uuid;
      callback({
        status: SocketStatus.OK,
        data: gameRoomRepository.get(roomUuid).players,
      });
    } catch (e: any) {
      callback({ status: SocketStatus.FAILED, data: { message: e.message } });
    }
  }

  onLeaveRoom(roomUuid: string) {
    LOGGER.info(`Socket ${this.uuid} left room ${roomUuid}`);
    try {
      let player = this.getPlayer(roomUuid);
      this.#socket.leave(roomUuid);
      if (!this.#rooms[roomUuid]) return;
      gameRoomRepository.removePlayer(roomUuid, this.uuid);
      delete this.#rooms[roomUuid];
      this.emit(MessageType.GAME_ROOM_LEAVE, roomUuid, player);
    } catch (e: any) {
      LOGGER.error(e.message);
    }
  }

  onMessage(roomUuid: string, message: string) {
    LOGGER.info(`Socket ${this.uuid} sent message ${message}`);
    this.serverEmit(MessageType.GAME_ROOM_MESSAGE, roomUuid, {
      datetime: new Date(),
      from: this.getPlayer(roomUuid),
      message,
    });
  }

  onReady(roomUuid: string, isReady: boolean) {
    LOGGER.info(`Socket ${this.uuid} is${isReady ? ' ' : ' not '}ready `);
    let gameRoomReady: boolean = gameRoomRepository.setPlayerReady(roomUuid, this.uuid, isReady);
    this.serverEmit(MessageType.GAME_ROOM_READY, roomUuid, {
      from: this.getPlayer(roomUuid),
      isReady,
    });
    if (gameRoomReady) {
      this.serverEmit(MessageType.GAME_ROOM_STARTING, roomUuid, gameRoomRepository.startGame(roomUuid,
        (data) => {
          this.serverEmit(MessageType.GAME_ROOM_START, roomUuid, data);
        }));
    } else {
      gameRoomRepository.cancelStartGame(roomUuid,
        () => this.serverEmit(MessageType.CANCEL_GAME_ROOM_STARTING, roomUuid,
        ));
    }
  }
}