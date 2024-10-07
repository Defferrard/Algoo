<script lang="ts">
  import { Window } from '$lib/components/layout';
  import { delay } from '$lib/utils/Functions';
  import { onMount } from 'svelte';

  let display = false;
  let title = 'Error';
  let text = 'An error has occurred.';
  let points: string[] = [];
  let _e;

  onMount(() => {
    window.onunhandledrejection = async (e: unknown) => {
      _e = e;
      points = [];
      title = 'Error';
      text = 'An error has occurred.';
      display = true;
      if (e instanceof PromiseRejectionEvent && Array.isArray(e.reason)) {
        console.log(e);

        for (const reason of e.reason) {
          console.log(reason);
          for (const constraint of Object.values(reason.constraints)) {
            points.push(`${constraint}`);
          }
        }
      } else if (typeof e === 'object') {
        // TODO : Refactor this
        text = (e as any).reason?.message || (e as any).message;
      } else {
        title = 'Unhandled Rejection';
      }
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
      <h1 slot="header">{title}</h1>
      <div>
        {text}
      </div>
      <ul>
        {#each points as point}
          <li>{point}</li>
        {/each}
      </ul>
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
    width: 50vw;
  }
</style>
