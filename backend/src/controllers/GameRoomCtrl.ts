import { SimpleGameRoomDTO } from '@defferrard/algoo-core/src/dto/SimpleGameRoomDTO';
import { GameRoom } from '@defferrard/algoo-core/src/game';
import { Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { GameRoomRepository } from '~/repositories';

@Service()
@JsonController('/rooms')
export class GameRoomCtrl {
  constructor(public gameRoomRepository: GameRoomRepository) {}

  @Get()
  getRooms(): SimpleGameRoomDTO[] {
    return this.gameRoomRepository.rooms.map((room: GameRoom) => room.toDTO());
  }

  @Post()
  createRoom(): GameRoom {
    const ROOM: GameRoom = new GameRoom();
    this.gameRoomRepository.push(ROOM);
    return ROOM;
  }
}
