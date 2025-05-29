import { IsString } from 'class-validator';
import { CreateUserValidationMessages } from './create-user.messages.js';

export class LogoutUserDto {
  @IsString({ message: CreateUserValidationMessages.token.invalidFormat })
  public token: string;
}
