import { IsEmail, IsString } from 'class-validator';
import { UserValidationMessages } from './user.messages.js';

export class LogoutUserDto {
  @IsString({ message: UserValidationMessages.token.invalidFormat })
  public token!: string;

  @IsEmail({}, { message: UserValidationMessages.email.invalidFormat })
  public email!: string;
}
