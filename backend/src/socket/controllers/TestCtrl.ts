import { MessageType } from '@defferrard/algoo-core/src/socket';
import {
  EmitOnSuccess,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers';
import { Server } from 'socket.io';
import { Service } from 'typedi';

const GAME_ROOM_UUID = 'gameRoomUUID';

@Service()
@SocketController()
export class GameRoomCtrl {

  constructor(public io: Server) {

  }

  @OnMessage(MessageType.GAME_ROOM_MESSAGE)
  @EmitOnSuccess(MessageType.GAME_ROOM_MESSAGE)
  save(@SocketIO() socket: any, @MessageBody() message: any) {
    console.log('Received message: ', message);
    console.log('Setting id to the message and sending it back to the client.');
    return {
      message,
      date: new Date().toISOString(),
    };
  }
}