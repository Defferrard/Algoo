import { GameManagerModel } from './GameManagerModel';
import GameManagerSocketController from './GameManagerSocketController';
import { GameManagerViewController } from './GameManagerViewController';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';

export function create(dto: GameManagerDTO) {
  const model = new GameManagerModel(dto);
  const socketController = new GameManagerSocketController(model);
  const viewController = new GameManagerViewController(model);
  return { model, socketController, viewController };
}
