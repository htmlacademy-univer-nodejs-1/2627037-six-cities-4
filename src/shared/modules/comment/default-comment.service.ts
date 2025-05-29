import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateOfferCommentDto } from './dto/create-offer-comment.dto.js';
import { MAX_ENTRY_COUNT } from './comment-service.constant.js';
import { RentOfferEntity } from '../rent-offer/index.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.RentOfferModel) private readonly rentOfferModel: types.ModelType<RentOfferEntity>
  ) {}

  public async create(dto: CreateOfferCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${ dto.text }`);

    const rentOfferComments = await this.commentModel.find({ offerId: dto.offerId }).exec();

    if (rentOfferComments.length > 0) {
      const ratingSum = rentOfferComments
        .map(comment => comment.rating)
        .reduce((currSum, val) => currSum + val, 0);
      const avgRating = ratingSum / rentOfferComments.length;
      await this.rentOfferModel.findByIdAndUpdate(dto.offerId, {
        commentsCount: rentOfferComments.length,
        rating: avgRating,
      }).exec();
      this.logger.info(`Offer ${dto.offerId} updated. New average rating: ${avgRating}`);
    }

    return result;
  }

  public async findByRentOfferId(rentOfferId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return await this.commentModel.find({ offerId: rentOfferId })
      .limit(MAX_ENTRY_COUNT)
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async deleteByRentOfferId(rentOfferId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ rentOfferId })
      .exec();

    return result.deletedCount;
  }
}
