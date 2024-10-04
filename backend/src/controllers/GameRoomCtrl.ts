import { SimpleGameRoomDTO } from '@defferrard/algoo-core/src/dto/SimpleGameRoomDTO';
import { GameRoom } from '@defferrard/algoo-core/src/game';
import { Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { GameRoomRepository } from '~/repositories';
import { SerializeResponse } from '~/utils/SerializeResponse';

@Service()
@JsonController('/rooms')
export class GameRoomCtrl {
  constructor(public gameRoomRepository: GameRoomRepository) {}

  @Get()
  @SerializeResponse(SimpleGameRoomDTO)
  async getRooms() {
    return this.gameRoomRepository.rooms.map((room: GameRoom) => room.toDTO());
  }

  @Post()
  @SerializeResponse(SimpleGameRoomDTO)
  async createRoom() {
    const room: GameRoom = new GameRoom();
    this.gameRoomRepository.push(room);
    return room.toDTO();
  }
}
