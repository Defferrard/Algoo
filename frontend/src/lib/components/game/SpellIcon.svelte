<script lang="ts">
    import {Spell} from "@defferrard/algoo-core/src/game";

    import {getCSS} from "$lib/components/Color";

    export let spell: Spell;
    export let size: number = 5;
</script>

<container style:--color={getCSS(spell.color)} style:--size="{size}em">
    <img src={spell.iconPath} alt={spell.name}/>
</container>

<style>

    container {
        --size: 5em;
        display: block;
        padding: 0;
        overflow: hidden;

        width: var(--size);
        height: var(--size);
        --gradient: color-mix(in srgb, var(--color), var(--color-body-5) var(--color-gap));
        background: linear-gradient(135deg, var(--gradient) 0%, var(--color) 100%);
        box-shadow: inset 0 0 2em black;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>