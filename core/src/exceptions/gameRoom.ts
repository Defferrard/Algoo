

export abstract class GameRoomException extends Error {

    readonly uuid: string;
    protected constructor(uuid: string, message: string) {
        super(message);
        this.uuid = uuid;
    }

}

export class FullGameRoomException extends GameRoomException {
  constructor(uuid: string) {
    super(uuid, `Game room ${uuid} is full`);
  }
}

export class PlayerAlreadyInGameRoomException extends GameRoomException {
  constructor(player: string, room: string) {
    super(room, `Player ${player} is already in room ${room}`);
  }
}
export class GameRoomNotFoundException extends GameRoomException {
  constructor(room: string) {
    super(room, `Game room ${room} not found`);
  }
}