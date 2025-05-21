import { ParamsDictionary } from 'express-serve-static-core';

export type ParamPremiumRentOffers = {
  cityName: string;
  count?: string;
} | ParamsDictionary;
