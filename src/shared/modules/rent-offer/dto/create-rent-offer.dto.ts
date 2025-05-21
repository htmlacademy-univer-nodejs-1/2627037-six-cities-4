import { Amenity, CityName, HousingType } from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBooleanString,
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
import { CreateRentOfferValidationMessage } from './create-rent-offer.messages.js';

export class CreateRentOfferDto {
  @MinLength(10, { message: CreateRentOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateRentOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateRentOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateRentOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateRentOfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsEnum(CityName, { message: CreateRentOfferValidationMessage.cityName.invalidFormat })
  public cityName: CityName;

  @IsString({ message: CreateRentOfferValidationMessage.preview.invalidFormat })
  public preview: string;

  @IsArray({ message: CreateRentOfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(6, { message: CreateRentOfferValidationMessage.photos.minLength })
  @ArrayMaxSize(6, { message: CreateRentOfferValidationMessage.photos.maxLength })
  public photos: string[];

  @IsBooleanString({ message: CreateRentOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(HousingType, { message: CreateRentOfferValidationMessage.housingType.invalidFormat })
  public housingType: HousingType;

  @IsInt({ message: CreateRentOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateRentOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateRentOfferValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: CreateRentOfferValidationMessage.visitorsCount.invalidFormat })
  @Min(1, { message: CreateRentOfferValidationMessage.visitorsCount.minValue })
  @Max(10, { message: CreateRentOfferValidationMessage.visitorsCount.maxValue })
  public visitorsCount: number;

  @IsInt({ message: CreateRentOfferValidationMessage.rentCost.invalidFormat })
  @Min(100, { message: CreateRentOfferValidationMessage.rentCost.minValue })
  @Max(100_000, { message: CreateRentOfferValidationMessage.rentCost.maxValue })
  public rentCost: number;

  @IsArray({ message: CreateRentOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: CreateRentOfferValidationMessage.amenities.invalidContent })
  public amenities: Amenity[];

  @IsString({ message: CreateRentOfferValidationMessage.userId.invalidFormat })
  @IsMongoId({ message: CreateRentOfferValidationMessage.userId.invalidId })
  public userId: string;
}
