import { Container } from 'inversify';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultRentOfferService } from './default-rent-offer.service.js';
import { RentOfferEntity, RentOfferModel } from './rent-offer.entity.js';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/index.js';
import { RentOfferController } from './rent-offer.controller.js';

export function createRentOfferContainer() {
  const rentOfferContainer = new Container();

  rentOfferContainer.bind<RentOfferService>(Component.RentOfferService).to(DefaultRentOfferService);
  rentOfferContainer.bind<types.ModelType<RentOfferEntity>>(Component.RentOfferModel).toConstantValue(RentOfferModel);
  rentOfferContainer.bind<Controller>(Component.RentOfferController).to(RentOfferController).inSingletonScope();

  return rentOfferContainer;
}
