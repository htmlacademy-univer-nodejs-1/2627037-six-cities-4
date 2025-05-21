import { ParamsDictionary } from 'express-serve-static-core';

export type ParamCheckAuthorization = {
  token: string;
  userId: string;
} | ParamsDictionary;
