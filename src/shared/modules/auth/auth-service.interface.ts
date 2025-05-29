import { LoginUserDto, UserEntity } from '../user/index.js';
import { LogoutUserDto } from '../user/dto/logout-user.dto.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
  logout(dto: LogoutUserDto): Promise<string>;
}
