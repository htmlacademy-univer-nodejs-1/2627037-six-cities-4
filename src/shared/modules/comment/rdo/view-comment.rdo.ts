import { Expose, Type } from 'class-transformer';
import { ViewUserRdo } from '../../user/index.js';

export class ViewCommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId'})
  @Type(() => ViewUserRdo)
  public user: ViewUserRdo;

  @Expose({ name: 'createdAt'})
  public postDate: string;
}
