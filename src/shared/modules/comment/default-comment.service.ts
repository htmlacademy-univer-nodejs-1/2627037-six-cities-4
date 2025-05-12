import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { MAX_ENTRY_COUNT } from './comment-service.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${ dto.text }`);

    return result;
  }

  public async findByRentOfferId(rentOfferId: string): Promise<DocumentType<CommentEntity>[] | null> {
    const result = await this.commentModel.find({ rentOfferId })
      .limit(MAX_ENTRY_COUNT).exec();
    return result.sort((a: CommentEntity, b: CommentEntity) =>
      b.publicationDate.getMilliseconds() - a.publicationDate.getMilliseconds()
    );
  }

  public async getCountForRentOffer(rentOfferId: string): Promise<number> {
    return this.commentModel.countDocuments({ rentOfferId });
  }
}
