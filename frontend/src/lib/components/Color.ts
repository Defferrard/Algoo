import type {Color as GameColor} from "@defferrard/algoo-core/src/game";

export enum SystemColor {
    MAIN = 'main',
    BODY = 'body',
    BODY_LIGHT = 'body-light',
    BODY_LIGHTER = 'body-lighter',
    LIGHTEST = 'lightest',
    LIGHT = 'light',
    LIGHTER = 'lighter',

    SUCCESS = 'success',
    DANGER = 'danger',
}

export type GlobalColor = SystemColor | GameColor;

export function getCSS(color: SystemColor | GameColor): string {
    return `var(--color-${color})`
}
export function getCSSRGB(color: SystemColor | GameColor): string {
    return `var(--color-${color}-rgb)`
}
