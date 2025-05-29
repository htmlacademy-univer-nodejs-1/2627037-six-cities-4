import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Amenity, CityCoordinates, CityName, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RentOfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RentOfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: 10, maxlength: 1024 })
  public title!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: CityName
  })
  public cityName!: CityName;

  @prop({ required: true })
  public preview!: string;

  @prop({
    required: true,
    validate: (arr: string[]) => arr.length === 6,
    default: [],
    _id: false
  })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsCount!: number;

  @prop({ required: true, min: 1, max: 10 })
  public visitorsCount!: number;

  @prop({ required: true, min: 100, max: 100_000 })
  public rentCost!: number;

  @prop({
    type: () => [String],
    enum: Amenity,
    required: true,
    default: [],
    _id: false
  })
  public amenities!: Amenity[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true })
  public commentsCount!: number;

  @prop({ required: true })
  public cityCoordinates!: CityCoordinates;

  @prop({ required: true })
  public favoriteUserIds!: string[];
}

export const RentOfferModel = getModelForClass(RentOfferEntity);
