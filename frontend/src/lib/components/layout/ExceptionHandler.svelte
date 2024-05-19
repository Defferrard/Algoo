<script lang='ts'>
    import { Window } from '$lib/components/layout';
    import { delay } from '$lib/utils/Functions';
    import { onMount } from 'svelte';

    let display = false;
  let title = 'Error';
  let text = 'An error has occurred.';
  let _e;

  onMount(() => {
    window.onunhandledrejection = (e: any) => {
      _e = e;
      display = true;
      console.log(e);
      text = e.reason?.message || e.message;
      // Focus on the alert
      delay(5000).then(() => {
        close();
      });
    };
  });

  function close() {
    display = false;
  }
</script>
{#if display}
  <section>
    <Window onclose={close}>
      <h1 slot='header'>{title}</h1>
      <div>
        {text}
      </div>
    </Window>
  </section>
{/if}

<style>
    section {
        --color: var(--color-danger);
        position: fixed;
        top: 1em;
        z-index: 1000;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    h1 {
        margin: 0;
        line-height: 2em;
    }

    div {
        padding: 0.5em 1em;

    }
</style>