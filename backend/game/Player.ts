import {Color, Team} from "@defferrard/algoo-core/src/game";
import {User} from "@defferrard/algoo-core/src/socket";

export default class Player {
    private readonly _team: Team;
    private readonly _user: User;

    constructor(user: User) {
        this._user = user;
        this._team = new Team(Color.GREEN, user.uuid);
    }

    get team(): Team {
        return this._team
    }
}