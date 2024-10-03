<script lang='ts'>
  import { elasticOut } from 'svelte/easing';

  export let animated: boolean = true;
  export let draggable: boolean = true;
  export let onclose: (() => void) | undefined = undefined;

  function dragMe(node: HTMLElement) {
    if (!draggable) return;
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
      if (moving) {
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

  function appear() {
    if (!animated) return;
    return {
      duration: 1000,
      css: (t) => {
        const eased = elasticOut(t);
        return `
                    transform: scale(${eased});
                `;
      },
    };
  }

  function disappear() {
    if (!animated) return;
    return {
      duration: 100,
      css: (t) => `transform: scale(${t});`,
    };
  }
</script>

<section in:appear out:disappear>
  {#if $$slots.header}
    <header use:dragMe>
      <actions>
        {#if onclose}
          <button class='material-symbols-rounded close'
                  on:click|stopPropagation={onclose}
                  on:mousedown|stopPropagation>
            close
          </button>
        {/if}
      </actions>
      <slot name='header' />
    </header>
  {/if}
  <content>
    <slot />
  </content>
  {#if $$slots.footer}
    <footer>
      <slot name='footer' />
    </footer>
  {/if}
</section>

<style>

    section {
        height: 100%;
        transition: 0s;
        display: flex;
        flex-direction: column;
        filter: drop-shadow(-1em 1em 0 color-mix(in srgb, black 20%, transparent));
    }

    section > * {
        transition: .2s;
    }

    header, content {
        padding: 0.5em 1em;
    }

    header {
        border-radius: 1em 1em 0 0;
        color: white;

        background-color: var(--color);
        display: flex;
        justify-content: space-between;
        font-weight: bolder;
        user-select: none;
        overflow: hidden;
    }

    actions {
        display: flex;
        gap: .5em;
        align-items: center;
        margin: -0.5em -1em;
    }

    actions > button {
        font-size: 1em;
        height: 100%;
        border-radius: 0;
    }

    actions > button.close:hover {
        background-color: var(--color-red);
        transform: inherit;
        filter: brightness(1.2);
    }

    actions > button.close:active {
        background-color: var(--color-red);
        transform: inherit;
        filter: brightness(.8);
    }


    content {
        background-color: var(--color-bg);
        color: var(--color-body);
        overflow: hidden;
        height: 100%;
    }

    content::-webkit-scrollbar-thumb {
        border-radius: 1em;
        right: -1em;
    }

    content::-webkit-scrollbar-track {
        border-radius: 0;
        margin: 1em;
    }
</style>