import type { GameRoomView, Message } from './GameRoomView';
import type { Player } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';

export const routes: (
  gameRoomView: GameRoomView,
) => { messageType: MessageType; handler: (...params: any) => void }[] = (gameRoomView) => [
  {
    messageType: MessageType.PUT_GAME_ROOM,
    handler: (state: Player[]) => gameRoomView.setGameRoomState(state),
  },
  {
    messageType: MessageType.GAME_ROOM_MESSAGE,
    handler: (message: Message) => gameRoomView.pushMessage(message),
  },
  {
    messageType: MessageType.GAME_ROOM_JOIN,
    handler: (player: Player) => gameRoomView.join(player),
  },
  {
    messageType: MessageType.GAME_ROOM_LEAVE,
    handler: (player: Player) => gameRoomView.leave(player),
  },
  {
    messageType: MessageType.GAME_ROOM_READY,
    handler: ({ from, isReady }: { from: Player; isReady: boolean }) => {
      gameRoomView.setPlayerReady(from.user.uuid, isReady);
    },
  },
  {
    messageType: MessageType.GAME_ROOM_STARTING,
    handler: (timer: number) => gameRoomView.gameRoomStarting(timer),
  },
  {
    messageType: MessageType.CANCEL_GAME_ROOM_STARTING,
    handler: () => gameRoomView.cancelGameRoomStarting(),
  },
  {
    messageType: MessageType.GAME_ROOM_START,
    handler: (dto) => gameRoomView.startGame(dto),
  },
];
