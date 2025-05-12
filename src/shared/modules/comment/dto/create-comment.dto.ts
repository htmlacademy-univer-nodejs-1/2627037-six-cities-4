export class CreateCommentDto {
  public rentOfferId: string;
  public commentAuthorId: string;
  public text: string;
  public publicationDate: Date;
  public rating: number;
}
