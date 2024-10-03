import {Coordinate} from "@defferrard/algoo-core/src/board/";

const elements: HTMLElement[] = [];
let shaking = false;

export function shake(duration: number = 500,
                      force: { x: number, y: number } = {x: 100, y: 0},
                      timeout: number = 10) {
    if (shaking) return;
    shaking = true;

    const start = Date.now();
    const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        if (elapsed > duration) {
            shaking = false;
            clearInterval(interval);
            for (const element of elements) {
                element.style.transform = '';
            }
            return;
        }
        for (const element of elements) {
            const offset: Coordinate = new Coordinate({
                x:force.x * (Math.random() - 0.5),
                y:force.y * (Math.random() - 0.5)
            });
            element.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
        }
    }, timeout);
}

export function shakeable(element: HTMLElement) {
    elements.push(element);
    return {
        destroy() {
            elements.splice(elements.indexOf(element), 1);
        }
    }
}