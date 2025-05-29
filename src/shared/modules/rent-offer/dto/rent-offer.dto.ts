import { Amenity, CityName, HousingType } from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { RentOfferValidationMessage } from './rent-offer.messages.js';

export class RentOfferDto {
  @MinLength(10, { message: RentOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: RentOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: RentOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: RentOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsDateString({}, { message: RentOfferValidationMessage.postDate.invalidFormat })
  public postDate!: Date;

  @IsEnum(CityName, { message: RentOfferValidationMessage.cityName.invalidFormat })
  public cityName!: CityName;

  @IsString({ message: RentOfferValidationMessage.preview.invalidFormat })
  public preview!: string;

  @IsArray({ message: RentOfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(6, { message: RentOfferValidationMessage.photos.minLength })
  @ArrayMaxSize(6, { message: RentOfferValidationMessage.photos.maxLength })
  @IsString({ each: true, message: RentOfferValidationMessage.photos.invalidContent })
  public photos!: string[];

  @IsBoolean({ message: RentOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: RentOfferValidationMessage.housingType.invalidFormat })
  public housingType!: HousingType;

  @IsInt({ message: RentOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: RentOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: RentOfferValidationMessage.roomsCount.maxValue })
  public roomsCount!: number;

  @IsInt({ message: RentOfferValidationMessage.visitorsCount.invalidFormat })
  @Min(1, { message: RentOfferValidationMessage.visitorsCount.minValue })
  @Max(10, { message: RentOfferValidationMessage.visitorsCount.maxValue })
  public visitorsCount!: number;

  @IsInt({ message: RentOfferValidationMessage.rentCost.invalidFormat })
  @Min(100, { message: RentOfferValidationMessage.rentCost.minValue })
  @Max(100_000, { message: RentOfferValidationMessage.rentCost.maxValue })
  public rentCost!: number;

  @IsArray({ message: RentOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: RentOfferValidationMessage.amenities.invalidContent })
  public amenities!: Amenity[];

  @IsMongoId({ message: RentOfferValidationMessage.userId.invalidId })
  public userId!: string;
}
