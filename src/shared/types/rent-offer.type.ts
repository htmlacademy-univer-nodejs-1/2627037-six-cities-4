import { Amenity } from './amenity.enum.js';
import { CityCoordinates } from './city-coordinates.type.js';
import { CityName } from './city-name.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type RentOffer = {
  title: string;
  description: string;
  postDate: Date;
  cityName: CityName;
  preview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  visitorsCount: number;
  rentCost: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  cityCoordinates: CityCoordinates;
}
