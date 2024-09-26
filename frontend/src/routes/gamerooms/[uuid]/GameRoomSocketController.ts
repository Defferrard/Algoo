import { On, SocketController } from '$lib/utils/socket/decorators';
import type { GameRoomModel, Message } from './GameRoomModel';
import type {
  ChatMessageDTO,
  GameManagerDTO,
  IsReadyMessageDTO,
  MessageDTO,
  PlayerDTO,
} from '@defferrard/algoo-core/src/dto';
import { Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';

@SocketController()
export class GameRoomSocketController {
  private _model: GameRoomModel;

  constructor(model: GameRoomModel) {
    this._model = model;
  }

  @On(MessageType.GAME_ROOM_MESSAGE)
  pushMessage(message: ChatMessageDTO): void {
    this._model.pushMessage(message);
  }

  @On(MessageType.GAME_ROOM_JOIN)
  join(player: PlayerDTO): void {
    this._model.join(new Player(player));
  }

  @On(MessageType.GAME_ROOM_LEAVE)
  leave({ playerId }: MessageDTO): void {
    this._model.leave(playerId);
  }

  @On(MessageType.GAME_ROOM_READY)
  setPlayerReady({ playerId, isReady }: IsReadyMessageDTO): void {
    this._model.setPlayerReady(playerId, isReady);
  }

  @On(MessageType.CANCEL_GAME_ROOM_STARTING)
  cancelGameRoomStarting(): void {
    this._model.cancelGameRoomStarting();
  }

  @On(MessageType.GAME_ROOM_STARTING)
  gameRoomStarting(timer: number): void {
    this._model.gameRoomStarting(timer);
  }

  @On(MessageType.PUT_GAME_ROOM)
  setGameRoomState(state: Player[]) {
    this._model.setGameRoomState(state);
  }

  @On(MessageType.GAME_ROOM_START)
  startGame(dto: GameManagerDTO): void {
    console.log('GameRoomSocketController.startGame', dto);
    this._model.startGame(dto);
  }
}
