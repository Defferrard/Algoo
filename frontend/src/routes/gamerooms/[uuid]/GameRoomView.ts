import { UIGameManager } from '$lib/game';
import { socket } from '$lib/stores/socket';
import type { Board } from '@defferrard/algoo-core/src/board';
import type GameManagerDTO from '@defferrard/algoo-core/src/dto/GameManagerDTO';
import { GameRoom, type Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import 'reflect-metadata';
import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type Message = string | { from: Player; message: string };

type event = { message: MessageType; handler: Function };

function On(eventName: MessageType) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
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
export class GameRoomView {
  private readonly _timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
  private readonly _messages: Writable<Message[]> = writable([]);
  private readonly _gameRoom: GameRoom = new GameRoom();
  private readonly _board: Writable<Board | undefined> = writable(undefined);

  @On(MessageType.GAME_ROOM_MESSAGE)
  pushMessage(message: Message): void {
    console.log(message);
    this._messages.update((messages: Message[]) => [...messages, message]);
  }

  @On(MessageType.GAME_ROOM_JOIN)
  join(player: Player): void {
    this._gameRoom.addPlayer(player);
    this.pushMessage(player.user.name + ' joined the room');
  }

  @On(MessageType.GAME_ROOM_LEAVE)
  leave(player: Player): void {
    console.log(player);
    this._gameRoom.removePlayer(player.user.uuid);
    this.pushMessage(player.user.name + ' left the room');
  }

  @On(MessageType.GAME_ROOM_READY)
  setPlayerReady({ from, isReady }: { from: Player; isReady: boolean }): void {
    const uuid: string = from.user.uuid;
    const player: Player = this._gameRoom.getPlayer(uuid)!;
    this._gameRoom.setPlayerReady(uuid, isReady);
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
      this._gameRoom.addPlayer(player);
    }
  }

  @On(MessageType.GAME_ROOM_START)
  startGame(dto: GameManagerDTO): void {
    let gameManager = new UIGameManager(dto);
    this._gameRoom.startGame(gameManager);
  }

  connect(room: string, jwt: string) {
    socket.connect(room, jwt);
  }

  disconnect() {
    socket.disconnect();
  }

  get messages(): Readable<Message[]> {
    return this._messages;
  }

  get board(): Readable<Board | undefined> {
    return this._board;
  }

  get gameRoom(): GameRoom {
    return this._gameRoom;
  }
}

export default new GameRoomView();
