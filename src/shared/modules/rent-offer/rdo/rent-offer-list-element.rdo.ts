import { Expose } from 'class-transformer';
import { CityName, HousingType } from '../../../types/index.js';

export class RentOfferListElementRdo {
  @Expose()
  public rentCost: number;

  @Expose()
  public title: string;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public publicationDate: Date;

  @Expose()
  public cityName: CityName;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
