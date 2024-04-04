<script lang="ts">
    import {LoadingPage} from "$lib/components/";
    import {Header, ExceptionHandler} from "$lib/components/layout/index";
    import {Color} from "@defferrard/algoo-core/src/game/";
    import {getCSS, getCSSRGB} from "$lib/components/Color";

    const colors: Color[] = Object.values(Color) as any as Color[];
    let colorIndex: number = Math.floor(Math.random() * colors.length);

    // Funny code to change the color of the board every 100ms
    //  setInterval(() => {
    //      colorIndex = (colorIndex + 1) % colors.length;
    //  }, 100);

</script>


<section style:--color={getCSS(colors[colorIndex])} style:--color-rgb={getCSSRGB(colors[colorIndex])}>
<content>
    <ExceptionHandler />
    <Header/>
    <LoadingPage/>
    <slot/>
</content>
</section>

<style>
    :root {
        --gradient: color-mix(in srgb, var(--color-body), black var(--color-gaper));
        background: linear-gradient(0deg, var(--gradient) 0%, var(--color-body) 100%);
        color: var(--color-light);
    }

    section {
        transition: 0s;
        margin: 0;
        padding: 0;

        height: 100%;
        width: 100%;

    }
    content {
        transition: 0.2s;
    }
</style>