import { RentOfferDto } from './dto/rent-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { DocumentExists, CityName } from '../../types/index.js';

export interface RentOfferService extends DocumentExists {
  create(dto: RentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  updateById(dto: RentOfferDto, rentOfferId: string): Promise<DocumentType<RentOfferEntity>>;
  deleteById(rentOfferId: string): Promise<DocumentType<RentOfferEntity> | null>;
  getList(maxEntryCount: number | null): Promise<DocumentType<RentOfferEntity>[]>;
  getPremiumRentOffers(cityName: CityName, maxEntryCount: number | null): Promise<DocumentType<RentOfferEntity>[]>;
  findById(rentOfferId: string): Promise<DocumentType<RentOfferEntity> | null>;
  findByIds(rentOfferIds: string[]): Promise<DocumentType<RentOfferEntity>[] | null>;
  addFavoriteRentOffer(userId: string, offerId: string): Promise<void>;
  removeFavoriteRentOffer(userId: string, offerId: string): Promise<void>;
  getFavoriteRentOffers(userId: string): Promise<DocumentType<RentOfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
