import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware, HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component } from '../../types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { RentOfferDto } from './dto/rent-offer.dto.js';
import { RentOfferRdo } from './rdo/rent-offer.rdo.js';
import { ParamRentOfferId } from './type/param-rent-offer-id.type.js';
import { CommentService } from '../comment/index.js';
import { RentOfferListElementRdo } from './rdo/rent-offer-list-element.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../user/index.js';

@injectable()
export class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
    this.logger.info('Register routes for RentOfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createRentOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(RentOfferDto),
      ],
    });
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Put,
      handler: this.updateRentOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(RentOfferDto),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'rentOfferId'),
      ],
    });
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Delete,
      handler: this.deleteRentOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'rentOfferId'),
      ],
    });
    this.addRoute({
      path: '/index',
      method: HttpMethod.Get,
      handler: this.indexRentOffers,
    });
    this.addRoute({
      path: '/info/:rentOfferId',
      method: HttpMethod.Get,
      handler: this.getRentOfferInfo,
      middlewares: [
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'rentOfferId'),
      ],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumRentOffersForCity,
    });
    this.addRoute({
      path: '/favorite/:rentOfferId',
      method: HttpMethod.Post,
      handler: this.saveToFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'rentOfferId'),
      ],
    });
    this.addRoute({
      path: '/favorite/:rentOfferId',
      method: HttpMethod.Delete,
      handler: this.deleteFromFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'rentOfferId'),
      ],
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async createRentOffer(
    { body, tokenPayload }: Request<unknown, unknown, RentOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.rentOfferService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(RentOfferRdo, result));
  }

  public async updateRentOffer(
    { body, params, tokenPayload }: Request<ParamRentOfferId, unknown, RentOfferDto>,
    res: Response,
  ): Promise<void> {
    const { rentOfferId } = params;
    const foundOffer = await this.rentOfferService.findById(rentOfferId);

    if (foundOffer?.userId.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Access denied. Unable to update offer ${rentOfferId} which user ${tokenPayload.id} does not have update access.`,
        'RentOfferController',
      );
    }

    const updatedOffer = await this.rentOfferService.updateById(body, rentOfferId);
    this.ok(res, fillDTO(RentOfferRdo, updatedOffer));
  }

  public async deleteRentOffer(
    { params }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    const { rentOfferId } = params;
    const offer = await this.rentOfferService.deleteById(rentOfferId);

    await this.commentService.deleteByRentOfferId(rentOfferId);
    this.noContent(res, offer);
  }

  public async indexRentOffers(
    { query }: Request,
    res: Response,
  ): Promise<void> {
    const { count } = query;
    const result = await this.rentOfferService.getList(count
      ? Number.parseInt(count as string, 10) : null);
    this.ok(res, fillDTO(RentOfferListElementRdo, result));
  }

  public async getRentOfferInfo(
    { params }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    const { rentOfferId } = params;
    const offer = await this.rentOfferService.findById(rentOfferId);
    this.ok(res, fillDTO(RentOfferRdo, offer));
  }

  public async getPremiumRentOffersForCity(
    { query }: Request,
    res: Response,
  ): Promise<void> {
    const { cityName, count } = query;

    if (! cityName || !(cityName as string in CityName)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with name ${cityName} not found.`,
        'RentOfferController',
      );
    }

    const result = await this.rentOfferService.getPremiumRentOffers(cityName as CityName, count
      ? Number.parseInt(count as string, 10) : null);
    this.ok(res, fillDTO(RentOfferListElementRdo, result));
  }

  public async saveToFavorite(
    { params , tokenPayload }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findById(tokenPayload.id);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${tokenPayload.id} not found.`,
        'RentOfferController',
      );
    }

    const result = await this.rentOfferService.addFavoriteRentOffer(
      tokenPayload.id, params.rentOfferId);
    this.created(res, fillDTO(RentOfferRdo, result));
  }

  public async deleteFromFavorite(
    { params, tokenPayload }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findById(tokenPayload.id);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${tokenPayload.id} not found.`,
        'RentOfferController',
      );
    }

    const result = await this.rentOfferService.removeFavoriteRentOffer(
      tokenPayload.id, params.rentOfferId);
    this.ok(res, fillDTO(RentOfferRdo, result));
  }

  public async getFavorites(
    { tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const user = this.userService.findById(tokenPayload.id);

    if (! user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${tokenPayload.id} not found.`,
        'RentOfferController',
      );
    }

    const offers = await this.rentOfferService.getFavoriteRentOffers(tokenPayload.id);
    this.ok(res, fillDTO(RentOfferListElementRdo, offers));
  }
}
