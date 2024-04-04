import {Color, Team} from "./index";
import {User} from "../socket";

export default class Player{
    readonly team: Team;
    readonly user: User;

    isReady: boolean = false;

    constructor(user: User, team: Team = new Team(Color.GREEN, user.uuid)) {
        this.user = user;
        this.team = team;
    }
}