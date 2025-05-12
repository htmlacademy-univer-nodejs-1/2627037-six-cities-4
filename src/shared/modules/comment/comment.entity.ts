import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop()
  public rentOfferId!: string;

  @prop()
  public commentAuthorId!: string;

  @prop({ required: true })
  public text!: string;

  @prop()
  public publicationDate!: Date;

  @prop()
  public rating!: number;
}

export const CommentModel = getModelForClass(CommentEntity);
