import {RentOffer, HousingType, CityName, Amenity, UserType} from '../types/index.js';

export function createOffer(offerData: string): RentOffer {
  const [
    title,
    description,
    createdDate,
    cityName,
    preview,
    photos,
    isPremium,
    isFavorite,
    rating,
    housingType,
    roomsCount,
    visitorsCount,
    rentCost,
    amenities,
    commentsCount,

    latitude,
    longitude,

    name,
    email,
    avatar,
    password,
    userType
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
    password,
    userType: userType as UserType
  };

  const cityCoordinates = {
    latitude: Number.parseInt(latitude, 10),
    longitude: Number.parseInt(longitude, 10),
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    cityName: CityName[cityName as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
    preview,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number.parseInt(rating, 10),
    housingType: housingType as HousingType,
    roomsCount: Number.parseInt(roomsCount, 10),
    visitorsCount: Number.parseInt(visitorsCount, 10),
    rentCost: Number.parseInt(rentCost, 10),
    amenities: amenities.split(';')
      .map((amenity) => amenity as Amenity),
    author: user,
    commentsCount: Number.parseInt(commentsCount, 10),
    cityCoordinates: cityCoordinates,
  };
}
