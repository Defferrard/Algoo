import { UIGameManager } from '$lib/game';
import { socket } from '$lib/stores/socket';
import { routes } from './routes';
import type { Board } from '@defferrard/algoo-core/src/board';
import type GameManagerDTO from '@defferrard/algoo-core/src/dto/GameManagerDTO';
import { GameRoom, type Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type Message = string | { from: Player; message: string };

function hello(a: any, b: any) {
  console.log(a, b);
}

export class GameRoomView {
  private readonly _timeouts: { [key: string]: NodeJS.Timeout } = {}; // Key = Timeout Type
  private readonly _messages: Writable<Message[]> = writable([]);
  private readonly _gameRoom: GameRoom = new GameRoom();
  private readonly _board: Writable<Board | undefined> = writable(undefined);

  pushMessage(message: Message): void {
    this._messages.update((messages: Message[]) => [...messages, message]);
  }

  join(player: Player): void {
    this._gameRoom.addPlayer(player);
    this.pushMessage(player.user.name + ' joined the room');
  }

  leave(player: Player): void {
    console.log(player);
    this._gameRoom.removePlayer(player.user.uuid);
    this.pushMessage(player.user.name + ' left the room');
  }

  setPlayerReady(uuid: string, isReady: boolean): void {
    const player: Player = this._gameRoom.getPlayer(uuid)!;
    this._gameRoom.setPlayerReady(uuid, isReady);
    this.pushMessage(player.user.name + ' is ' + (isReady ? 'ready' : 'not ready'));
  }

  cancelGameRoomStarting(): void {
    clearInterval(this._timeouts[MessageType.GAME_ROOM_STARTING]);
  }

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

  setGameRoomState(state: Player[]) {
    for (let player of Object.values(state)) {
      this._gameRoom.addPlayer(player);
    }
  }

  startGame(dto: GameManagerDTO): void {
    let gameManager = new UIGameManager(dto);
    this._gameRoom.startGame(gameManager);
  }

  connect(room: string, jwt: string) {
    socket.connect(room, jwt);
    for (const route of routes(this)) {
      socket.on(route.messageType, route.handler);
    }
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
