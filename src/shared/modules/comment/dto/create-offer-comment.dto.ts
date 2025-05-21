import { IsMongoId, IsString, Length } from 'class-validator';
import { CreateOfferCommentValidationMessage } from './create-offer-comment.messages.js';

export class CreateOfferCommentDto {
  @IsString({ message: CreateOfferCommentValidationMessage.offerId.invalidFormat })
  @IsMongoId({ message: CreateOfferCommentValidationMessage.offerId.invalidId })
  public offerId: string;

  @IsString({ message: CreateOfferCommentValidationMessage.userId.invalidFormat })
  @IsMongoId({ message: CreateOfferCommentValidationMessage.userId.invalidId })
  public userId: string;

  @IsString({ message: CreateOfferCommentValidationMessage.text.invalidFormat })
  @Length(5, 1024, { message: CreateOfferCommentValidationMessage.text.lengthField })
  public text: string;
}
