import {Color, Team} from "@defferrard/algoo-core/src/game";
import {User} from "@defferrard/algoo-core/src/socket";

export default class Player extends User {
    private readonly _team: Team;

    constructor(uuid: string) {
        super(uuid, "Kharamel");
        this._team = new Team(Color.GREEN, uuid);
    }

    get team(): Team {
        return this._team
    }
}