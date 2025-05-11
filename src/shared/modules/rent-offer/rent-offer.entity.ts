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
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public postDate: Date;

  @prop({
    type: () => String,
    enum: CityName
  })
  public cityName: CityName;

  @prop()
  public preview: string;

  @prop({
    required: true,
    default: [],
    _id: false
  })
  public photos: string[];

  @prop()
  public isPremium: boolean;

  @prop()
  public isFavorite: boolean;

  @prop()
  public rating: number;

  @prop({
    type: () => String,
    enum: HousingType
  })
  public housingType: HousingType;

  @prop()
  public roomsCount: number;

  @prop()
  public visitorsCount: number;

  @prop()
  public rentCost: number;

  @prop({
    type: () => String,
    enum: Amenity,
    required: true,
    default: [],
    _id: false
  })
  public amenities: Amenity[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public authorId: Ref<UserEntity>;

  @prop()
  public commentsCount: number;

  @prop()
  public cityCoordinates: CityCoordinates;
}

export const RentOfferModel = getModelForClass(RentOfferEntity);
