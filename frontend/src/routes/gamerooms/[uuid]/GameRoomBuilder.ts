import { GameRoomModel } from './GameRoomModel';
import { GameRoomSocketController } from './GameRoomSocketController';
import { GameRoomViewController } from './GameRoomViewController';

export function create() {
  const model = new GameRoomModel();
  const socketController = new GameRoomSocketController(model);
  const viewController = new GameRoomViewController(model);
  return { model, socketController, viewController };
}
