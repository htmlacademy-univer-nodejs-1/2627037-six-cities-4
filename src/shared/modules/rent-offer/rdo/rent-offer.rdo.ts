import { Expose, Type } from 'class-transformer';
import { ViewUserRdo } from '../../user/index.js';
import { CityCoordinates, CityName } from '../../../types/index.js';

export class RentOfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose({ name: 'createdAt' })
  public postDate: string;

  @Expose()
  public cityName: CityName;

  @Expose()
  public preview: string;

  @Expose()
  public photos: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public housingType: string;

  @Expose()
  public roomsCount: number;

  @Expose()
  public visitorsCount: number;

  @Expose()
  public rentCost: number;

  @Expose()
  public amenities: string[];

  @Expose()
  @Type(() => ViewUserRdo)
  public user: ViewUserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public cityCoordinates: CityCoordinates;
}
