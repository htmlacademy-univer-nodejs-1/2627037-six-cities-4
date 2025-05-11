import { Container } from 'inversify';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultRentOfferService } from './default-rent-offer.service.js';
import { RentOfferEntity, RentOfferModel } from './rent-offer.entity.js';
import { types } from '@typegoose/typegoose';

export function createRentOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<RentOfferService>(Component.RentOfferService).to(DefaultRentOfferService);
  offerContainer.bind<types.ModelType<RentOfferEntity>>(Component.RentOfferModel).toConstantValue(RentOfferModel);

  return offerContainer;
}
