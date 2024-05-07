<script lang="ts">
    import {throttle} from "lodash";
    function dragMe(node:HTMLElement) {
        let moving = false;
        let left = 0;
        let top = 0;

        node.parentElement.style.position = 'relative';
        node.parentElement.style.top = `${top}px`;
        node.parentElement.style.left = `${left}px`;
        node.style.userSelect = 'none';

        node.addEventListener('mousedown', () => {
            moving = true;
        });

        window.addEventListener('mousemove', (e) => {
            if(moving){
                left += e.movementX;
                top += e.movementY;
                node.parentElement.style.top = `${top}px`;
                node.parentElement.style.left = `${left}px`;
            }
        });

        window.addEventListener('mouseup', () => {
            moving = false;
        });
    }
</script>

<section >
    {#if $$slots.header}
    <header use:dragMe>
        <slot name="header"/>
    </header>
    {/if}
    <content>
        <slot/>
    </content>
    {#if $$slots.footer}
        <footer>
            <slot name="footer"/>
        </footer>
    {/if}
</section>

<style>
    section {
        transition: 0s;
        overflow-x: hidden;
        overflow-y: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        filter: drop-shadow(-1em 1em 0 color-mix(in srgb, black 20%, transparent));

    }
    header, content {
        padding: 0.5em 1em;
    }
    header {
        border-radius: 1em 1em 0 0;
        color: white;

        background-color: var(--color);
        text-align: right;
        font-weight: bolder;
        user-select: none;
    }
    content {
        background-color: var(--color-bg);
        color: var(--color-body);
    }

    content::-webkit-scrollbar-thumb {
        border-radius: 1em;
        right:-1em;
    }

    content::-webkit-scrollbar-track {
        border-radius: 0;
        margin:1em;
    }
</style>