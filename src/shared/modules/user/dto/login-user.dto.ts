import { IsEmail, IsString, Length } from 'class-validator';
import { CreateUserValidationMessages } from './create-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CreateUserValidationMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserValidationMessages.password.lengthField })
  public password: string;
}
