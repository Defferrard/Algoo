import { GameRoomModel } from './GameRoomModel';
import { GameRoomSocketController } from './GameRoomSocketController';
import { GameRoomViewController } from './GameRoomViewController';

export function create() {
  const gameRoomModel = new GameRoomModel();
  const gameRoomSocketController = new GameRoomSocketController(gameRoomModel);
  const gameRoomViewController = new GameRoomViewController(gameRoomModel);
  return { gameRoomModel, gameRoomSocketController, gameRoomViewController };
}
