<script lang='ts'>
    import {LoadingPage} from '$lib/components/';
    import {getCSS, getCSSRGB} from '$lib/components/Color';
    import {ExceptionHandler, Header} from '$lib/components/layout/index';
    import {Color} from '@defferrard/algoo-core/src/game';
    import {theme} from "$lib/stores/theme";
    import {onMount} from "svelte";


    const colors: Color[] = Object.values(Color) as any as Color[];
    let colorIndex: number = Math.floor(Math.random() * colors.length);

    // Funny code to change the color of the board every 100ms
    //  setInterval(() => {
    //      colorIndex = (colorIndex + 1) % colors.length;
    //  }, 100);

    onMount(() => {
        theme.apply();
    });

</script>

<svelte:element this='html'
                lang='en'
                class={$theme}
                style:--color={getCSS(colors[colorIndex])}
                style:--color-rgb={getCSSRGB(colors[colorIndex])}
/>

<section>
    <content>
        <ExceptionHandler/>
        <Header/>
        <LoadingPage/>
        <slot/>
    </content>
</section>

<style>
    section {
        transition: 0s;
        margin: 0;
        padding: 0;

        height: 100%;
        width: 100%;


        background-color: color-mix(in srgb, var(--color) 25%, transparent);
        --light-line-color: color-mix(in srgb, var(--color-bg) 30%, transparent);

        --line-weight: 0.15em;
        --light-line-weight: calc(var(--line-weight) / 2);
        --line: var(--color-bg) var(--line-weight), transparent var(--line-weight);
        --light-line: var(--light-line-color) var(--light-line-weight), transparent var(--light-line-weight);

        background-image: linear-gradient(var(--line)),
        linear-gradient(90deg, var(--line)),
        linear-gradient(var(--light-line)),
        linear-gradient(90deg, var(--light-line));

        background-size: calc(50 * var(--line-weight)) calc(50 * var(--line-weight)),
        calc(50 * var(--line-weight)) calc(50 * var(--line-weight)),
        calc(20 * var(--light-line-weight)) calc(20 * var(--light-line-weight)),
        calc(20 * var(--light-line-weight)) calc(20 * var(--light-line-weight));

        background-position: calc(-1 * var(--line-weight)) calc(-1 * var(--line-weight)),
        calc(-1 * var(--line-weight)) calc(-1 * var(--line-weight)),
        calc(-1 * var(--light-line-weight)) calc(-1 * var(--light-line-weight)),
        calc(-1 * var(--light-line-weight)) calc(-1 * var(--light-line-weight));
    }

    content {
        transition: 0.2s;
    }
</style>