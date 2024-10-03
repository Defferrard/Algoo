<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleKeyDown(event: KeyboardEvent) {
        if(event.repeat) return;
        const code: string = event.code.toLowerCase();
        dispatch(code, {event})
        if (code.startsWith("digit")) {
            dispatch("digit", {digit: parseInt(code.replace("digit", "")), event});
        }else if (code.startsWith("numpad")) {
            dispatch("digit", {digit: parseInt(code.replace("numpad", "")), event});
        }else if (code.startsWith("key")) {
            dispatch("letter", {letter: code.replace("key", ""), event});
        }else if (code.startsWith("arrow")) {
            dispatch("arrow", {arrow: code.replace("arrow", ""), event});
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}/>