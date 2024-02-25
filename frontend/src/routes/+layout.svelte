<script>
    import {LoadingPage} from "$lib/components/";
</script>

<LoadingPage/>
<body>
<slot/>
</body>

<style>
    body{
        margin: 0;
        padding: 0;
        --gradient: color-mix(in srgb, var(--color-body), black var(--color-gaper));
        background: linear-gradient(0deg, var(--gradient) 0%, var(--color-body) 100%);
        color: var(--color-light);

        height: 100vh;
        width: 100vw;
    }
</style>