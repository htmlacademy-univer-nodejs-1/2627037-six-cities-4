import { Expose } from 'class-transformer';
import { Amenity, CityCoordinates, CityName, HousingType } from '../../../types/index.js';

export class RentOfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

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
  public housingType: HousingType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public visitorsCount: number;

  @Expose()
  public rentCost: number;

  @Expose()
  public amenities: Amenity[];

  @Expose()
  public authorId: string;

  @Expose()
  public commentsCount: number;

  @Expose()
  public cityCoordinates: CityCoordinates;
}
