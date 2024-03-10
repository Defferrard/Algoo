export enum MessageType {

    ////////////////
    // CONNECTION //
    ////////////////

    CONNECT = 'connect', // When client has been connected
    CONNECTION = 'connection', // When server get a client connection
    DISCONNECT = 'disconnect', // When server get a client disconnect
    LOGIN = 'login', // Logging in with uuid

    GAME_ROOM_JOIN = 'game_room_join', // Joining a room
    GAME_ROOM_MESSAGE = 'game_room_message', // Sending a message to a room
}