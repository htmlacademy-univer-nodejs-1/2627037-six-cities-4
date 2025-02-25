import { Amenity } from '../types/amenity.enum.js';
import { CityName } from '../types/city-name.enum.js';
import { HousingType } from '../types/housing-type.enum.js';

export class ValuesValidationHandler {
  public constructor(
    private readonly collectionSeparator: string
  ) {}

  public validateDataTokens(dataTokens: string[]): boolean {
    const [
      title,
      description,
      ,
      cityName,
      ,
      photos,
      ,
      ,
      rating,
      housingType,
      roomsCount,
      visitorsCount,
      rentCost,
      amenities,
      ,
      ,
      cityCoordinates
    ] = dataTokens;

    try {
      this.validateStringLength(title, 10, 100);
      this.validateStringLength(description, 20, 1024);
      this.validateCityNameEnumStringValue(cityName);
      this.validateStringArrayLength(photos.split(this.collectionSeparator), 6, 6);
      this.validateNumberLimit(+rating.replace(',', '.'), 1.0, 5.0);
      this.validateHousingTypeEnumStringValue(housingType);
      this.validateNumberLimit(+roomsCount, 1, 8);
      this.validateNumberLimit(+visitorsCount, 1, 10);
      this.validateNumberLimit(+rentCost, 100, 100000);
      amenities.split(this.collectionSeparator).forEach((amenity) => this.validateAmenityEnumStringValue(amenity));
      this.validateStringArrayLength(cityCoordinates.split(this.collectionSeparator), 2, 2);
      return true;
    } catch {
      return false;
    }
  }

  private validateStringLength(value: string, minLength: number, maxLength: number) {
    if (value.length < minLength || value.length > maxLength) {
      throw new Error(`Wrong string value length. Value: ${value}, minLength: ${minLength}, maxLength: ${maxLength}.`);
    }
  }

  private validateStringArrayLength(array: string[], minLength: number, maxLength: number) {
    if (array.length < minLength || array.length > maxLength) {
      throw new Error(`Wrong string array length. Value: ${array}, minLength: ${minLength}, maxLength: ${maxLength}.`);
    }
  }

  private validateNumberLimit(value: number, minValue: number, maxValue: number) {
    if (value < minValue || value > maxValue) {
      throw new Error(`Value exceeds allowed range. Value: ${value}, minValue: ${minValue}, maxValue: ${maxValue}.`);
    }
  }

  private validateCityNameEnumStringValue(value: string) {
    if (!Object.values(CityName).includes(value as CityName)) {
      throw new Error(`Value does not match enum ${CityName}. Value: ${value}.`);
    }
  }

  private validateHousingTypeEnumStringValue(value: string) {
    if (!Object.values(HousingType).includes(value as HousingType)) {
      throw new Error(`Value does not match enum ${HousingType}. Value: ${value}.`);
    }
  }

  private validateAmenityEnumStringValue(value: string) {
    if (!Object.values(Amenity).includes(value as Amenity)) {
      throw new Error(`Value does not match enum ${Amenity}. Value: ${value}.`);
    }
  }
}
