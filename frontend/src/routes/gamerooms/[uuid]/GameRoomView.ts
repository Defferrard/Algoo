import { UIGameManager } from '$lib/game';
import { EventLifecycle, socket } from '$lib/stores/socket';
import type { Board } from '@defferrard/algoo-core/src/board';
import type { ChatMessageDTO, GameManagerDTO, IsReadyMessageDTO } from '@defferrard/algoo-core/src/dto';
import { GameRoom, type Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import type { Invalidator, Readable, Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type Message = string | ChatMessageDTO;

type event = { message: MessageType; handler: Function };

function On(eventName: MessageType) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const event: event = {
      message: eventName,
      handler: descriptor.value,
    };
    if (!target.events) target.events = [];
    target.events.push(event);
    return descriptor;
  };
}

function SocketController() {
  return function <T extends { new (...args: any[]): {} }>(clazz: T) {
    return class extends clazz {
      constructor(...args: any[]) {
        super(...args);
        const events: event[] = (this as any).events || [];
        for (const event of events) {
          socket.on(event.message, event.handler.bind(this));
        }
      }
    };
  };
}
@SocketController()
export class GameRoomView implements Readable<GameRoomView> {
  private readonly _timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
  messages: Message[] = [];
  readonly gameRoom: GameRoom = new GameRoom();
  board?: Board;
  private _store: Writable<GameRoomView>;
  constructor() {
    this._store = writable(this);
  }
  subscribe(run: Subscriber<GameRoomView>, invalidate?: Invalidator<GameRoomView> | undefined): Unsubscriber {
    return this._store.subscribe(run, invalidate);
  }

  private _notify() {
    this._store.set(this);
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
    let gameManager = new UIGameManager(dto);
    this.gameRoom.startGame(gameManager);
  }

  connect(room: string, jwt: string) {
    socket.onLifeCycle(EventLifecycle.POST_HANDLER, this._notify.bind(this));
    socket.connect(room, jwt);
  }

  disconnect() {
    socket.disconnect();
  }
}

const gameRoomView = new GameRoomView() as unknown as Readable<GameRoomView>;
gameRoomView.subscribe(() => {});
