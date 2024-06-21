import { Observable } from '$lib/utils/socket/ObservableSocketController';
import type { ChatMessageDTO } from '@defferrard/algoo-core/src/dto';
import { GameRoom, Player } from '@defferrard/algoo-core/src/game';

export type Message = string | ChatMessageDTO;

enum TimeoutType {
  GAME_ROOM_STARTING,
}

export class GameRoomModel extends Observable<GameRoomModel> {
  private readonly _gameRoom: GameRoom;
  private readonly _timeouts: { [key in TimeoutType]?: NodeJS.Timeout } = {};
  private _isReady: boolean = false;
  private _messages: Message[] = [];
  constructor() {
    super();
    this._gameRoom = new GameRoom();
  }

  pushMessage(message: Message): void {
    this._messages = [...this._messages, message];
    this.notify();
  }

  join(player: Player): void {
    this._gameRoom.addPlayer(player);
    this.pushMessage(player.user.name + ' joined the room');
    this.notify();
  }

  leave(player: Player): void {
    this._gameRoom.removePlayer(player.user.uuid);
    this.pushMessage(player.user.name + ' left the room');
    this.notify();
  }

  setPlayerReady(from: Player, isReady: boolean): void {
    const uuid: string = from.user.uuid;
    const player: Player = this._gameRoom.getPlayer(uuid)!;
    this._gameRoom.setPlayerReady(uuid, isReady);
    this.pushMessage(player.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
    this.notify();
  }

  cancelGameRoomStarting(): void {
    clearInterval(this._timeouts[TimeoutType.GAME_ROOM_STARTING]);
    this.notify();
  }

  gameRoomStarting(timer: number): void {
    this._timeouts[TimeoutType.GAME_ROOM_STARTING] = setInterval(() => {
      if (timer > 0) {
        this.pushMessage('Game starting in ' + timer / 1000 + ' seconds');
        timer -= 1000;
      } else {
        clearInterval(this._timeouts[TimeoutType.GAME_ROOM_STARTING]);
        this.notify();
      }
    }, 1000);
  }

  setGameRoomState(state: Player[]) {
    for (let player of Object.values(state)) {
      this._gameRoom.addPlayer(player);
    }
    this.notify();
  }

  startGame(): void {
    this._gameRoom.startGame();
    this.notify();
  }

  flipReady(): boolean {
    this._isReady = !this._isReady;
    this.notify();
    return this._isReady;
  }

  protected getObservable(): GameRoomModel {
    return this;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get gameRoom(): GameRoom {
    return this._gameRoom;
  }

  get messages(): Message[] {
    return this._messages;
  }
}
