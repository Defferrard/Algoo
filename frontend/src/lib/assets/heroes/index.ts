export default async function (name: string) {
    return {
        base: (await import(`./${name.toLowerCase()}/base.svg`)).default,
        front: (await import(`./${name.toLowerCase()}/front.svg`)).default,
    }
}