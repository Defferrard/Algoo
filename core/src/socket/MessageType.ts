export enum MessageType {
  ////////////////
  // CONNECTION //
  ////////////////

  CONNECT = 'connect', // When client has been connected
  CONNECT_ERROR = 'connect_error',
  CONNECTION = 'connection', // When server get a client connection
  DISCONNECT = 'disconnect', // When server get a client disconnect
  WHO_AM_I = 'who_am_i', // When client wants to know who he is
  PUT_GAME_ROOM = 'put_game_room', // To set the game room state
  GAME_ROOM_JOIN = 'game_room_join', // Joining a room
  GAME_ROOM_LEAVE = 'game_room_leave', // Leaving a room
  GAME_ROOM_MESSAGE = 'game_room_message', // Sending a message to a room

  GAME_ROOM_READY = 'game_room_ready', // Ready to start the game
  GAME_ROOM_STARTING = 'game_room_starting', // Timer before starting the game
  CANCEL_GAME_ROOM_STARTING = 'cancel_game_room_starting', // Cancel timer before starting the game
  GAME_ROOM_START = 'game_room_start', // Start the game
}
