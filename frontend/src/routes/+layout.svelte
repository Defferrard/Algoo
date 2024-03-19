<script>
    import {LoadingPage} from "$lib/components/";
    import ProfileTab from "$lib/components/profile/ProfileTab.svelte";
    import Header from "$lib/components/layout/Header.svelte";
</script>


<body>
<content>
    <LoadingPage/>
    <Header/>
    <slot/>
</content>
</body>

<style>
    :root {
        --gradient: color-mix(in srgb, var(--color-body), black var(--color-gaper));
        background: linear-gradient(0deg, var(--gradient) 0%, var(--color-body) 100%);
        color: var(--color-light);
    }

    body {
        transition: 0s;
        margin: 0;
        padding: 0;

        height: 100vh;
        width: 100vw;

    }
    content {
        transition: 0.2s    ;
    }
</style>