import type {Writable, Readable} from 'svelte/store';
import {writable} from 'svelte/store';

import {GameManager, Team, Spell, HeroEntity, RESSOURCES_COLOR} from "@defferrard/algoo-core/src/game";
import type {Resources} from "@defferrard/algoo-core/src/game";
import type {TileType} from "@defferrard/algoo-core/src/board";
import type {Coordinate, Entity} from "@defferrard/algoo-core/src/board";

import {delay} from "$lib/utils/Functions";
import {ActionBuffer} from "$lib/game/index";
import {showSpell} from "$lib/components/indicators/temporary_spell_indicator";
import {showValue} from "$lib/components/indicators/temporary_value_indicator";
import type {ActionResume} from "@defferrard/algoo-core/src/strategy";
import type {Tile} from "@defferrard/algoo-core/src/board/";
import {shake} from "$lib/animations/shake";

export default class UIGameManager extends GameManager {
    private readonly _store : Writable<UIGameManager>;
    private readonly _buffer: ActionBuffer;

    constructor(tiles: TileType[][]) {
        super(tiles);
        this._store = writable(this);
        this._buffer = new ActionBuffer();
        this._buffer.onFinished = () => this.refresh();
    }


    pushTeam(team: Team) {
        super.pushTeam(team);
        this.refresh();
    }

    pushEntity(entity: Entity<Resources>, coordinate: Coordinate) {
        super.pushEntity(entity, coordinate);
        this.refresh();
    }

    moveEntity(entity: Entity<Resources>, path: Coordinate[]) {
        if(this.busy) return;
        super.moveEntity(entity, path);
        this.refresh();
    }

    deleteEntity(entity: Entity<Resources>) {
        super.deleteEntity(entity);
        this.refresh();
    }


    castSpell(spell: Spell, coordinate: Coordinate): ActionResume[] {
        const RESUME:  ActionResume[] = super.castSpell(spell, coordinate);
        const CASTER_COORDINATE: Coordinate = super.board.getEntityCoordinate(super.currentHero!);
        showSpell(CASTER_COORDINATE, spell);
        for(let resume of RESUME) {
            for(let update of resume.update!){
                showValue(update.coordinate as Tile, update.value, RESSOURCES_COLOR[update.type]!);
                if (update.value < 0) shake(500,{x:update.value*10,y:0});

            }
        }
        this.refresh();

        return RESUME;
    }

    nextTurn() {
        super.nextTurn();
        this.refresh();
    }

    protected moveEntityTo(entity: Entity<Resources>, coordinate: Coordinate) {
        this._buffer.add(async () => {
            super.moveEntityTo(entity, coordinate);
            this.refresh();
            await delay(100);
        })
    }

    refresh() {
        this._store.set(this);
    }

    get store() : Readable<UIGameManager> {
        return {subscribe: this._store.subscribe};
    }

    get busy() {
        return this._buffer.running;
    }
}