import { Expose } from 'class-transformer';

export class CreatedUserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  public userType: string;
}
