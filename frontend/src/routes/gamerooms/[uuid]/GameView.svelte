<script lang="ts">

import KeyBoardListener from "$lib/components/KeyBoardListener.svelte";
</script>

<KeyBoardListener on:space={nextTurn}
                  on:digit={(event)=>previewSpell(GAME_MANAGER.currentHero.spells[event.detail.digit-1])}
/>

<svelte:window on:click={()=>currentSpell = undefined}/>


<section transition:fly={{duration:200}}>
    <board>
        <BoardComponent
                {...{
                    board: $GAME_MANAGER_STORE.board,
                    path,
                    active,
                    accessible,
                    visibles,
                    markers,
                    targetable,
                    attacked
                }}
                on:click={(event)=>onAction(event.detail.x,event.detail.y)}
                on:rightclick={(event)=>{mark(event.detail.x,event.detail.y)}}
                on:hovertile={(event)=>hover(event.detail.x,event.detail.y)}
                on:exit={()=>{clearHover();lastHover = undefined;}}
                on:mouseenterentity={(event)=>{targetEntity = event.detail;}}
                on:mouseleaveentity={()=>{targetEntity = undefined;}}
        />
    </board>


    <heroResume>
        <HeroResume hero={targetEntity} stickRight/>
    </heroResume>
    <spellResume>
        <SpellResume spell={currentSpell}/>
    </spellResume>

    <bottom>
        {#if $GAME_MANAGER_STORE.currentHero}
            <ActionBar
                    hero={$GAME_MANAGER_STORE.currentHero}
                    spellPreview={currentSpell}
                    on:spellaction={(event)=>{
                    previewSpell(event.detail.spell)
                }}
                    on:endturn={()=>nextTurn()}/>
            <!--            <TimerProgressBar percentage={gameManager.gameTimer.percentage}/>-->
            <TimerProgressBar percentage={50}/>
        {/if}
    </bottom>
</section>

<style>
    section {
        height: 100vh;
        display: block;
    }

    board {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        width: 100vw;
    }

    heroResume, spellResume {
        position: absolute;
        right: 2vw;
    }

    heroResume {
        top: 10vh;
    }

    spellResume {
        top: 30vh;
    }

    bottom {
        position: absolute;
        bottom: 3vh;
        width: 100vw;
    }
</style>