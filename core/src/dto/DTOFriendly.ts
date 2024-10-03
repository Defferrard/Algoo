import { DTO } from './DTO';

export interface DTOFriendly<D extends DTO = DTO> {
  toDTO(): D;
}
