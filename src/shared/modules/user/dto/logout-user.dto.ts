import { IsEmail } from 'class-validator';
import { UserValidationMessages } from './user.messages.js';

export class LogoutUserDto {
  @IsEmail({}, { message: UserValidationMessages.email.invalidFormat })
  public email!: string;
}
