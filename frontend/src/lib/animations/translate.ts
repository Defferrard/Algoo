import {crossfade} from 'svelte/transition';

export const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 500),

    fallback(node, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: 150,
            css: (t) => `
					transform: ${transform} scale(${0.5 / t});
					opacity: ${t - 0.2}
				`
        };
    }
});