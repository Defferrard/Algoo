import TemporaryValueIndicator from "./TemporaryValueIndicator.svelte";


export function show(x: number, y: number, value:number, duration: number = 2000) {
    let component = new TemporaryValueIndicator({
        props: {
            x,
            y,
            value,
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
        }, duration/2)
    }, duration/2)
}