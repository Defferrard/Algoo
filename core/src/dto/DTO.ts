import { validateOrReject } from 'class-validator';

export abstract class DTO {
  async validateOrReject(): Promise<void> {
    return await validateOrReject(this);
  }
}
