import { Expose } from 'class-transformer';

export class ViewUserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatarPath: string;

  @Expose()
  public userType: string;
}
