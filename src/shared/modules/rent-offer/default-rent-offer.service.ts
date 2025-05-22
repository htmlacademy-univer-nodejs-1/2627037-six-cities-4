import { inject, injectable } from 'inversify';
import { RentOfferService } from './rent-offer-service.interface.js';
import { CityName, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { RentOfferDto } from './dto/rent-offer.dto.js';
import { MAX_ENTRY_COUNT, MAX_PREMIUM_ENTRY_COUNT } from './rent-offer-service.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import { getCityCoordinates } from '../../helpers/domain.js';

@injectable()
export class DefaultRentOfferService implements RentOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentOfferModel) private readonly offerModel: types.ModelType<RentOfferEntity>
  ) {}

  public async create(dto: RentOfferDto): Promise<DocumentType<RentOfferEntity>> {
    const cityCoordinates = getCityCoordinates(dto.cityName);
    const result = await this.offerModel.create({
      ...dto,
      cityCoordinates,
      rating: 1,
      commentsCount: 0,
      favoriteUserIds: []
    });
    this.logger.info(`New offer created: ${dto.title}`);
    await result.populate('userId');

    return result;
  }

  public async updateById(dto: RentOfferDto, rentOfferId: string): Promise<DocumentType<RentOfferEntity>> {
    const replaceWith = { _id: rentOfferId, ...dto };
    await this.offerModel.replaceOne({ _id: rentOfferId }, replaceWith).exec();

    const result = await this.findById(rentOfferId);
    return result!;
  }

  public async deleteById(rentOfferId: string): Promise<DocumentType<RentOfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(rentOfferId)
      .exec();
  }

  public async getList(maxEntryCount: number | null): Promise<DocumentType<RentOfferEntity>[]> {
    const entryCount = maxEntryCount ?? MAX_ENTRY_COUNT;
    return await this.offerModel
      .find()
      .limit(entryCount)
      .sort({ createdAt: SortType.Down })
      .populate('userId')
      .exec();
  }

  public async getPremiumRentOffers(cityName: CityName, maxEntryCount: number | null): Promise<DocumentType<RentOfferEntity>[]> {
    const entryCount = maxEntryCount ?? MAX_PREMIUM_ENTRY_COUNT;
    return await this.offerModel
      .find({ isPremium: true, cityName: cityName })
      .limit(entryCount)
      .sort({ createdAt: SortType.Down })
      .populate('userId')
      .exec();
  }

  public async findById(rentOfferId: string): Promise<DocumentType<RentOfferEntity> | null> {
    return this.offerModel.findById(rentOfferId).populate('userId').exec();
  }

  public async findByIds(rentOfferIds: string[]): Promise<DocumentType<RentOfferEntity>[] | null> {
    return await this.offerModel
      .find({ id: { $in: rentOfferIds } })
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async addFavoriteRentOffer(userId: string, offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(
      offerId,
      { $addToSet: { favoriteUserIds: userId } }
    ).exec();
  }

  public async removeFavoriteRentOffer(userId: string, offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(
      offerId,
      { $pull: { favoriteUserIds: userId } }
    ).exec();
  }

  public async getFavoriteRentOffers(userId: string): Promise<DocumentType<RentOfferEntity>[]> {
    return await this.offerModel
      .find({ favoriteUserIds: userId })
      .populate('userId')
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }
}
