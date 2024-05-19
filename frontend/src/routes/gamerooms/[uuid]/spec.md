```mermaid
block-beta
    columns 1
    block: FRONTEND
        svelte("Svelte Pages")
        space
        interface("Interface")
        svelte --> interface
        interface -- "readable<>" --> svelte
        space
        block: FRONTEND_LOGIC
            columns 1
            socket("Socket")
            gameRoom("Game Room")
            gameManager("Game Manager")
        end
        interface --> socket
        socket -->  interface
        interface --> gameRoom
        interface --> gameManager
    end
```