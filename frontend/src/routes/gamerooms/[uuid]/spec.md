```mermaid
block-beta
    columns 1
    block: FRONTEND
        columns 5
        svelte("Svelte Pages")
        space
        interface("Interface")
        svelte --> interface
        interface -- "readable<>" --> svelte
        space
        block: FRONTEND_LOGIC
            columns 1
            gameRoom("Game Room")
            gameManager("Game Manager")
        end
        socket("Socket")
        interface --> socket
        socket -->  interface
        interface --> gameRoom
        interface --> gameManager
    end
```