import { Expose } from 'class-transformer';

export class ViewCommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  public authorLink: string;

  @Expose()
  public publicationDate: string;
}
