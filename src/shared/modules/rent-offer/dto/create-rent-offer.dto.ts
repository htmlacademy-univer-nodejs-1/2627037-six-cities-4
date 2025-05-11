import {Amenity, CityCoordinates, CityName, HousingType} from '../../../types/index.js';

export class CreateRentOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public cityName: CityName;
  public preview: string;
  public photos: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public housingType: HousingType;
  public roomsCount: number;
  public visitorsCount: number;
  public rentCost: number;
  public amenities: Amenity[];
  public authorId: string;
  public commentsCount: number;
  public cityCoordinates: CityCoordinates;
}
