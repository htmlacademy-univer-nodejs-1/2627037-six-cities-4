import dayjs from 'dayjs';
import { OfferGenerator } from './rent-offer-generator.interface.js';
import {Amenity, CityName, HousingType, MockServerData, UserType} from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const cityName = getRandomItem([CityName.Amsterdam, CityName.Brussels, CityName.Cologne, CityName.Dusseldorf, CityName.Hamburg, CityName.Paris]);
    const preview = getRandomItem<string>(this.mockData.offerImages);
    const photos = getRandomItems<string>(this.mockData.offerImages).join(';');
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const rating = generateRandomValue(1, 5);
    const housingType = getRandomItem([HousingType.Apartment, HousingType.Hotel, HousingType.House, HousingType.Room]);
    const roomsCount = generateRandomValue(1, 5);
    const visitorsCount = generateRandomValue(1, 5);
    const rentCost = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems<string>([Amenity.AirConditioning, Amenity.BabySeat, Amenity.Breakfast, Amenity.Fridge, Amenity.LaptopFriendlyWorkspace, Amenity.Towels, Amenity.Washer]).join(';');
    const commentsCount = generateRandomValue(1, 5);

    const latitude = generateRandomValue(1, 5);
    const longitude = generateRandomValue(1, 5);

    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem([UserType.Default, UserType.Pro]);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title, description, createdDate,
      cityName, preview, photos, isPremium, isFavorite,
      rating, housingType, roomsCount, visitorsCount,
      rentCost, amenities, commentsCount,

      latitude, longitude,

      name, email, avatar, password, userType
    ].join('\t');
  }
}
