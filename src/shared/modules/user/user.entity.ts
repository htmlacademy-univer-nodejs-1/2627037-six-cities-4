import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import {User, UserType} from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: false, default: '' })
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: false, default: '' })
  public avatarPath?: string;

  @prop({ required: true, default: '' })
  public password!: string;

  @prop({ required: true, default: '' })
  public userType!: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
