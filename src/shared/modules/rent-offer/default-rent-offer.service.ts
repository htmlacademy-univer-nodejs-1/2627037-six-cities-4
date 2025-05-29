import { inject, injectable } from 'inversify';
import { RentOfferService } from './rent-offer-service.interface.js';
import { CityName, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { MAX_ENTRY_COUNT, MAX_PREMIUM_ENTRY_COUNT } from './rent-offer-service.constant.js';

@injectable()
export class DefaultRentOfferService implements RentOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentOfferModel) private readonly offerModel: types.ModelType<RentOfferEntity>
  ) {}

  public async create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async update(dto: CreateRentOfferDto, rentOfferId: string): Promise<DocumentType<RentOfferEntity>> {
    const result = { _id: rentOfferId, ... dto };
    await this.offerModel.replaceOne({ _id: rentOfferId }, result).exec();

    return (await this.findById(rentOfferId))!;
  }

  public async delete(rentOfferId: string): Promise<void> {
    await this.offerModel.deleteOne({ _id: rentOfferId });
  }

  public async getList(maxEntryCount: number = MAX_ENTRY_COUNT): Promise<DocumentType<RentOfferEntity>[]> {
    const result = await this.offerModel.find().limit(maxEntryCount).exec();
    return result.sort((a: RentOfferEntity, b: RentOfferEntity) =>
      b.postDate.getMilliseconds() - a.postDate.getMilliseconds()
    );
  }

  public async getListWithDefaultPagination(): Promise<DocumentType<RentOfferEntity>[]> {
    return this.getList();
  }

  public async getPremiumRentOffers(cityName: CityName, maxEntryCount: number = MAX_PREMIUM_ENTRY_COUNT): Promise<RentOfferEntity[]> {
    const result = await this.offerModel.find({ cityName: cityName }).limit(maxEntryCount);
    return result.sort((a: RentOfferEntity, b: RentOfferEntity) =>
      b.postDate.getMilliseconds() - a.postDate.getMilliseconds()
    );
  }

  public async getPremiumRentOffersWithDefaultPagination(cityName: CityName): Promise<RentOfferEntity[]> {
    return this.getPremiumRentOffers(cityName);
  }

  public async findById(rentOfferId: string): Promise<DocumentType<RentOfferEntity> | null> {
    return this.offerModel.findById(rentOfferId).exec();
  }

  public async findByIds(rentOfferIds: string[]): Promise<DocumentType<RentOfferEntity>[] | null> {
    const result = await this.offerModel.find({ id: { $in: rentOfferIds } }).exec();
    return result.sort((a: RentOfferEntity, b: RentOfferEntity) =>
      b.postDate.getMilliseconds() - a.postDate.getMilliseconds()
    );
  }
}
