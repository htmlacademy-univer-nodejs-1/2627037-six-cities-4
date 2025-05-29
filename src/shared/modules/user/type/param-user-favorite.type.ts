import { ParamsDictionary } from 'express-serve-static-core';

export type ParamUserFavorite = {
  token: string;
  userId: string;
  offerId: string;
} | ParamsDictionary;
