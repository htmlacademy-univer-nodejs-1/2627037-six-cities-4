import { Expose } from 'class-transformer';

export class UserAvatarRdo {
  @Expose()
  public path!: string;
}
