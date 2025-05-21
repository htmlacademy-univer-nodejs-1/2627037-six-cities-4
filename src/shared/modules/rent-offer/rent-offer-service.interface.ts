import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { DocumentExists, CityName } from '../../types/index.js';

export interface RentOfferService extends DocumentExists {
  create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  update(dto: CreateRentOfferDto, rentOfferId: string): Promise<DocumentType<RentOfferEntity>>;
  delete(rentOfferId: string): Promise<void>;
  getList(maxEntryCount: number | null): Promise<RentOfferEntity[]>;
  getPremiumRentOffers(cityName: CityName, maxEntryCount: number | null): Promise<RentOfferEntity[]>;
  findById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  findByIds(offerIds: string[]): Promise<DocumentType<RentOfferEntity>[] | null>;
}
