export enum MessageType {

    ////////////////
    // CONNECTION //
    ////////////////

    CONNECT = 'connect', // When client has been connected
    CONNECTION = 'connection', // When server get a client connection
    DISCONNECT = 'disconnect', // When server get a client disconnect
    LOGIN = 'login', // Logging in with uuid

    GAME_ROOM_JOIN = 'game_room_join', // Joining a room
    GAME_ROOM_LEAVE = 'game_room_leave', // Leaving a room
    GAME_ROOM_MESSAGE = 'game_room_message', // Sending a message to a room

    GAME_ROOM_READY = 'game_room_ready', // Ready to start the game
    GAME_ROOM_STARTING = 'game_room_starting', // Timer before starting the game
    GAME_ROOM_START = 'game_room_start', // Start the game
}