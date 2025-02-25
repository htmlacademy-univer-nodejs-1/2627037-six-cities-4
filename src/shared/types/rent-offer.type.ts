import { Amenity } from './amenity.enum.js';
import { CityCoordinates } from './city-coordinates.type.js';
import { CityName } from './city-name.enum.js';
import { HousingType } from './housing-type.enum.js';

export type RentOffer = {
  title: string; // length 10..100
  description: string; // length 20..1024
  publicationDate: Date;
  cityName: CityName;
  preview: string; // link or GUID
  photos: string[]; // length 6..6
  isPremium: boolean;
  isFavorite: boolean;
  rating: number; // values 1,0..5,0
  housingType: HousingType;
  roomsCount: number; // values 1..8
  visitorsCount: number; // values 1..10
  rentCost: number; // values 100..100'000
  amenities: Amenity[]; // length 1+
  authorLink: string; // link or GUID
  commentsCount: number;
  cityCoordinates: CityCoordinates;
}
