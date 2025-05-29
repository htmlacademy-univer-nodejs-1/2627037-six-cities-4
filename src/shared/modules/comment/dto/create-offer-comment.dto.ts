import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateOfferCommentValidationMessage } from './create-offer-comment.messages.js';

export class CreateOfferCommentDto {
  @IsMongoId({ message: CreateOfferCommentValidationMessage.offerId.invalidId })
  public offerId: string;

  @IsString({ message: CreateOfferCommentValidationMessage.text.invalidFormat })
  @Length(5, 1024, { message: CreateOfferCommentValidationMessage.text.lengthField })
  public text: string;

  @IsInt({ message: CreateOfferCommentValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferCommentValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferCommentValidationMessage.rating.maxValue })
  public rating: number;

  public userId: string;
}
