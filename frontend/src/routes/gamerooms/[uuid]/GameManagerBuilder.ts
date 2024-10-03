import { GameManagerModel } from './GameManagerModel';
import GameManagerSocketController from './GameManagerSocketController';
import { GameManagerViewModel } from './GameManagerViewModel';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';

export function create(dto: GameManagerDTO) {
  const model = new GameManagerModel(dto);
  const socketController = new GameManagerSocketController(model);
  const viewModel = new GameManagerViewModel(model);
  return { model, socketController, viewModel };
}
