

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