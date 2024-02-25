export enum MessageType {

    ////////////////
    // CONNECTION //
    ////////////////

    CONNECT = 'connect', // When client has been connected
    CONNECTION = 'connection', // When server get a client connection
    DISCONNECT = 'disconnect', // When server get a client disconnect
    LOGIN = 'login', // Logging in with uuid
}