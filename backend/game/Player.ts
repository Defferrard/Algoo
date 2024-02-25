import {Color, Team} from "@defferrard/algoo-core/src/game";

export default class Player {
    private readonly _uuid: string;
    private readonly _team: Team;

    constructor(uuid: string) {
        this._uuid = uuid;
        this._team = new Team(Color.GREEN, uuid);
    }

    get uuid(): string {
        return this._uuid;
    }

    get team(): Team {
        return this._team
    }
}