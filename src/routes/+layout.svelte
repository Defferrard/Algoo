<script>
    import {LoadingPage} from "$lib/components/";
    import {shakeable} from "$lib/animations/shake";
</script>

<LoadingPage/>
<body use:shakeable>
<slot/>
</body>

<style>
    body{
        margin: 0;
        padding: 0;
        --gradient: color-mix(in srgb, var(--color-body), black var(--color-gaper));
        background: linear-gradient(0deg, var(--gradient) 0%, var(--color-body) 100%);
    }
</style>