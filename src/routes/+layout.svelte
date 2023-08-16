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
        background-color: var(--color-body);
    }
</style>