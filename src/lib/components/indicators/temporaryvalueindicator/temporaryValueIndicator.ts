import TemporaryValueIndicator from "./TemporaryValueIndicator.svelte";
import type {Tile} from "../../../board";
import {Color} from "../../../components/Color";


export function show(tile: Tile, value: number, color:Color = Color.MAIN, duration: number = 2000) {
    const tileElementRect: DOMRect = document.getElementById(tile.stringId)!.getBoundingClientRect();
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