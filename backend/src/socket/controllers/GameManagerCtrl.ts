import { SocketController } from 'socket-controllers';
import { Service } from 'typedi';
import GameRoomService from '~/services/GameRoomService';

const GAME_ROOM_UUID = 'gameRoomUUID';

@Service()
@SocketController(`/rooms/:${GAME_ROOM_UUID}`)
export class GameRoomCtrl {

  constructor(
    public service: GameRoomService,
  ) {
  }
}