import {readable} from 'svelte/store';
import {Coordinate} from "@defferrard/algoo-core/src/board/";
import {browser} from '$app/environment';

export default readable<Coordinate>(new Coordinate({x:0, y:0}), (set) => {
    if (browser)
        document.body.addEventListener("mousemove", move);

    function move(event: MouseEvent) {
        set(new Coordinate({x: event.clientX, y: event.clientY}));
    }

    return () => {
        if (browser)
            document.body.removeEventListener("mousemove", move);
    }
})