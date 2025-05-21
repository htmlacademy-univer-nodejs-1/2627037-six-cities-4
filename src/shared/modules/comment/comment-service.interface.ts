import { CreateOfferCommentDto } from './dto/create-offer-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  create(dto: CreateOfferCommentDto): Promise<DocumentType<CommentEntity>>;
  findByRentOfferId(rentOfferId: string): Promise<DocumentType<CommentEntity>[] | null>;
  getCountForRentOffer(rentOfferId: string): Promise<number>;
}
