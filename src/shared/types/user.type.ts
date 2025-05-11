import {UserType} from './user-type.enum.js';

export type User = {
  name: string; // length 1..15
  email: string; // must be valid and unique
  avatar?: string; // link, GUID or base64 string; with default value
  // password?: string; // length 6..12
  userType: UserType;
}
