import { Expose } from 'class-transformer';

export class AuthorizedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
}
