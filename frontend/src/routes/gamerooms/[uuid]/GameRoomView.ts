import { UIGameManager } from '$lib/game';
import { EventLifecycle, socket } from '$lib/stores/socket';
import { ObservableSocketController } from '$lib/utils/socket/ObservableSocketController';
import { On } from '$lib/utils/socket/decorators';
import type { ChatMessageDTO, GameManagerDTO, IsReadyMessageDTO } from '@defferrard/algoo-core/src/dto';
import { GameRoom, type Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';

export type Message = string | ChatMessageDTO;

export class GameRoomView extends ObservableSocketController<GameRoomView> {
  private readonly _timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
  public messages: Message[] = [];
  readonly gameRoom: GameRoom;
  public gameManager?: UIGameManager;

  constructor() {
    super();
    this.gameRoom = new GameRoom();
  }

  @On(MessageType.GAME_ROOM_MESSAGE)
  pushMessage(message: Message): void {
    console.log(message);
    this.messages = [...this.messages, message];
  }

  @On(MessageType.GAME_ROOM_JOIN)
  join(player: Player): void {
    this.gameRoom.addPlayer(player);
    this.pushMessage(player.user.name + ' joined the room');
  }

  @On(MessageType.GAME_ROOM_LEAVE)
  leave(player: Player): void {
    console.log(player);
    this.gameRoom.removePlayer(player.user.uuid);
    this.pushMessage(player.user.name + ' left the room');
  }

  @On(MessageType.GAME_ROOM_READY)
  setPlayerReady({ from, isReady }: IsReadyMessageDTO): void {
    const uuid: string = from.user.uuid;
    const player: Player = this.gameRoom.getPlayer(uuid)!;
    this.gameRoom.setPlayerReady(uuid, isReady);
    this.pushMessage(player.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
  }

  @On(MessageType.CANCEL_GAME_ROOM_STARTING)
  cancelGameRoomStarting(): void {
    clearInterval(this._timeouts[MessageType.GAME_ROOM_STARTING]);
  }

  @On(MessageType.GAME_ROOM_STARTING)
  gameRoomStarting(timer: number): void {
    this._timeouts[MessageType.GAME_ROOM_STARTING] = setInterval(() => {
      if (timer > 0) {
        this.pushMessage('Game starting in ' + timer / 1000 + ' seconds');
        timer -= 1000;
      } else {
        clearInterval(this._timeouts[MessageType.GAME_ROOM_STARTING]);
      }
      super.notify();
    }, 1000);
  }

  @On(MessageType.PUT_GAME_ROOM)
  setGameRoomState(state: Player[]) {
    for (let player of Object.values(state)) {
      this.gameRoom.addPlayer(player);
    }
  }

  @On(MessageType.GAME_ROOM_START)
  startGame(dto: GameManagerDTO): void {
    this.gameManager = new UIGameManager(dto);
    this.gameRoom.startGame();
  }

  protected getObservable(): GameRoomView {
    return this;
  }

  connect(room: string, jwt: string) {
    super.register();
    socket.connect(room, jwt);
  }

  disconnect() {
    socket.disconnect();
  }
}

const gameRoomView = new GameRoomView();
gameRoomView.subscribe(() => {});
