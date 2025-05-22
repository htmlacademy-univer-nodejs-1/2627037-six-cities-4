import { IsEmail, IsString, Length } from 'class-validator';
import { UserValidationMessages } from './user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessages.email.invalidFormat })
  public email!: string;

  @IsString({ message: UserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: UserValidationMessages.password.lengthField })
  public password!: string;
}
