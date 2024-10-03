import { GameRoomModel } from './GameRoomModel';
import { GameRoomSocketController } from './GameRoomSocketController';
import { GameRoomViewModel } from './GameRoomViewModel';

export function create() {
  const model = new GameRoomModel();
  const socketController = new GameRoomSocketController(model);
  const viewModel = new GameRoomViewModel(model);
  return { model, socketController, viewModel };
}
