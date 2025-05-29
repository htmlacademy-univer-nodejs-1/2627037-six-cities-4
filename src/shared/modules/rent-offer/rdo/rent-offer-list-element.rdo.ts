import { Expose } from 'class-transformer';

export class RentOfferListElementRdo {
  @Expose()
  public id: number;

  @Expose()
  public rentCost: number;

  @Expose()
  public title: string;

  @Expose()
  public housingType: string;

  @Expose()
  public isFavorite: boolean;

  @Expose({ name: 'createdAt' })
  public postDate: string;

  @Expose()
  public cityName: string;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
