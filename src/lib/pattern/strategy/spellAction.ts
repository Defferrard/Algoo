import type {Spell, HeroEntity, ResourceType} from "../../game";
import type {Coordinate} from "../../board";

type spellActionArgs = { [key in string]: any };
export type SpellActionStrategy = (spell: Spell, by: HeroEntity, to: Coordinate[], args: spellActionArgs) => void;


export enum SpellActionType {
    UPDATE_RESSOURCE = "updateRessource",

}

export function getSpellAction(type: SpellActionType): SpellActionStrategy {
    return spellActionsStrategies[type];
}

export const spellActionsStrategies: Record<SpellActionType, SpellActionStrategy> = {
    [SpellActionType.UPDATE_RESSOURCE]: (spell: Spell, by: HeroEntity, targets: Coordinate[], args: spellActionArgs) => {
        for (let target of targets) {
            by.gameManager.board.getTileByCoordinate(target).entity?.update((entity: HeroEntity) => {
                entity.updateResource(args.type! as ResourceType, (value: number) => value + args.value!);
                return entity;
            });
        }
    }
}