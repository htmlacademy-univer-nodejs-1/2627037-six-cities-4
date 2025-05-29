import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { RentOfferService } from '../rent-offer/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { ParamOfferId } from './type/param-offer-id.type.js';
import { StatusCodes } from 'http-status-codes';
import { ViewCommentRdo } from './rdo/view-comment.rdo.js';
import { CreateOfferCommentDto } from './dto/create-offer-comment.dto.js';
import { CommentService } from './comment-service.interface.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferCommentDto),
      ],
    });
  }

  public async indexComments(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const result = await this.commentService.findByRentOfferId(params.offerId);

    this.ok(res, fillDTO(ViewCommentRdo, result ? result : []));
  }

  public async createComment(
    { body, tokenPayload }: Request<unknown, unknown, CreateOfferCommentDto>,
    res: Response,
  ): Promise<void> {
    const existsOffer = await this.rentOfferService.findById(body.offerId);

    if (! existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id '${body.offerId}' does not exist.`,
        'CommentController'
      );
    }

    const result = await this.commentService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(ViewCommentRdo, result));
  }
}
