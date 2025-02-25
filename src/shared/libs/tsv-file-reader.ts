import { Amenity } from '../types/amenity.enum.js';
import { CityName } from '../types/city-name.enum.js';
import { HousingType } from '../types/housing-type.enum.js';
import { RentOffer } from '../types/rent-offer.type.js';
import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { ValuesParser } from './values-parser.js';
import { ValuesValidationHandler } from './values-validation-handler.js';

export class TSVFileReader implements FileReader {
  private readonly collectionSeparator = ';';
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public convertToRentOfferArray(): RentOffer[] {
    if (!this.rawData) {
      throw new Error('File has empty content');
    }

    const validationHandler = new ValuesValidationHandler(this.collectionSeparator);
    const result: RentOffer[] = [];

    this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((lineData) => lineData.split('\t'))
      .forEach((dataTokens) => {
        if (validationHandler.validateDataTokens(dataTokens)) {
          const [
            title,
            description,
            publicationDate,
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
            authorLink,
            commentsCount,
            cityCoordinates
          ] = dataTokens;

          result.push({
            title,
            description,
            publicationDate: new Date(publicationDate),
            cityName: cityName as CityName,
            preview,
            photos: photos.split(this.collectionSeparator),
            isPremium: ValuesParser.parseStringBoolean(isPremium),
            isFavorite: ValuesParser.parseStringBoolean(isFavorite),
            rating: +rating,
            housingType: housingType as HousingType,
            roomsCount: +roomsCount,
            visitorsCount: +visitorsCount,
            rentCost: +rentCost,
            amenities: amenities.split(this.collectionSeparator) as Amenity[],
            authorLink,
            commentsCount: +commentsCount,
            cityCoordinates: {
              latitude: +cityCoordinates.split(this.collectionSeparator)[0],
              longitude: +cityCoordinates.split(this.collectionSeparator)[1]
            }
          });
        }
      });

    return result;
  }
}
