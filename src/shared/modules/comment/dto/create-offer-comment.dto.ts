import { IsString, Length } from 'class-validator';
import { CreateOfferCommentValidationMessage } from './create-offer-comment.messages.js';

export class CreateOfferCommentDto {
  @IsString({ message: CreateOfferCommentValidationMessage.offerId.invalidFormat })
  public offerId: string;

  @IsString({ message: CreateOfferCommentValidationMessage.userId.invalidFormat })
  public userId: string;

  @IsString({ message: CreateOfferCommentValidationMessage.text.invalidFormat })
  @Length(5, 1024, { message: CreateOfferCommentValidationMessage.text.lengthField })
  public text: string;
}
