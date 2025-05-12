import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { CityName } from '../../types/index.js';

export interface RentOfferService {
  create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  update(dto: CreateRentOfferDto, rentOfferId: string): Promise<DocumentType<RentOfferEntity>>;
  delete(rentOfferId: string): Promise<void>;
  getList(maxEntryCount: number): Promise<RentOfferEntity[]>;
  getPremiumRentOffers(cityName: CityName, maxEntryCount: number): Promise<RentOfferEntity[]>;
  findById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  findByIds(offerIds: string[]): Promise<DocumentType<RentOfferEntity>[] | null>;
}
