import type {Tile} from "@defferrard/algoo-core/src/board/";

import TemporaryValueIndicator from "./TemporaryValueIndicator.svelte";

import type {GlobalColor} from "$lib/components/Color";
import {SystemColor} from "$lib/components/Color";


export function showValue(tile: Tile, value: number, color:GlobalColor = SystemColor.MAIN, duration: number = 2000) {
    const tileElementRect: DOMRect = document.getElementById(tile.toString())!.getBoundingClientRect();
    let component = new TemporaryValueIndicator({
        props: {
            x: tileElementRect.left,
            y: tileElementRect.top,
            value,
            color,
            duration,
        },
        target: document.body,
    });
    setTimeout(() => {
        component.$set({
            visible: false
        } as any)
        setTimeout(() => {
            component.$destroy();
        }, duration / 2)
    }, duration / 2)
}