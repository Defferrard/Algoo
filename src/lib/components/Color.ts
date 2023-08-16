export enum Color {
    MAIN = 'main',
    BODY = 'body',
    BODY_LIGHT = 'body-light',
    BODY_LIGHTER = 'body-lighter',
    LIGHTEST = 'lightest',
    LIGHT = 'light',
    LIGHTER = 'lighter',

    SUCCESS = 'success',
    DANGER = 'danger',

    GREEN = 'green',

    RED = 'red',

    BLUE = 'blue'
}

export function getCSS(color: Color): string {
    return `var(--color-${color})`
}