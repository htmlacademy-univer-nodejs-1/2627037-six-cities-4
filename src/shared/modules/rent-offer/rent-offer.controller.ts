import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component } from '../../types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { RentOfferEntity } from './rent-offer.entity.js';
import { RentOfferRdo } from './rdo/rent-offer.rdo.js';
import { ParamRentOfferId } from './type/param-rent-offer-id.type.js';
import { ParamPremiumRentOffers } from './type/param-premium-rent-offers.type.js';
import { ParamRentOfferList } from './type/param-rent-offer-list.type.js';

@injectable()
export class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for RentOfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createRentOffer,
      middlewares: [new ValidateDtoMiddleware(CreateRentOfferDto)],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Put,
      handler: this.updateRentOffer,
      middlewares: [
        new ValidateDtoMiddleware(CreateRentOfferDto),
        new ValidateObjectIdMiddleware('rentOfferId')
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.deleteRentOffer,
      middlewares: [new ValidateObjectIdMiddleware('rentOfferId')],
    });
    this.addRoute({
      path: '/get-list',
      method: HttpMethod.Get,
      handler: this.getRentOfferList,
    });
    this.addRoute({
      path: '/info/:rentOfferId',
      method: HttpMethod.Get,
      handler: this.getRentOfferInfo,
      middlewares: [new ValidateObjectIdMiddleware('rentOfferId')],
    });
    this.addRoute({
      path: '/premium/:cityName',
      method: HttpMethod.Get,
      handler: this.getPremiumRentOffersForCity,
    });
  }

  public async createRentOffer(
    { body }: Request<unknown, unknown, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.rentOfferService.create(body);
    this.created(res, fillDTO(RentOfferRdo, result));
  }

  public async updateRentOffer(
    { body, params }: Request<ParamRentOfferId, unknown, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {
    const rentOfferId = params.rentOfferId;
    const existRentOffer = await this.rentOfferService.findById(rentOfferId);

    if (! existRentOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent offer with id '${rentOfferId}' does not exist.`,
        'RentOfferController'
      );
    }

    const result = await this.rentOfferService.update(body, rentOfferId);
    this.created(res, fillDTO(RentOfferEntity, result));
  }

  public async deleteRentOffer(
    { params }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    await this.rentOfferService.delete(params.rentOfferId);
    this.ok(res, null);
  }

  public async getRentOfferList(
    { params }: Request<ParamRentOfferList>,
    res: Response,
  ): Promise<void> {
    const count = params.count;
    const result = await this.rentOfferService.getList(count
      ? null : Number.parseInt(count!, 10));
    this.ok(res, fillDTO(CreateRentOfferDto, result));
  }

  public async getRentOfferInfo(
    { params }: Request<ParamRentOfferId>,
    res: Response,
  ): Promise<void> {
    const rentOfferId = params.rentOfferId;
    const result = await this.rentOfferService.findById(rentOfferId);

    if (! result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent offer with id '${rentOfferId}' does not exist.`,
        'RentOfferController'
      );
    }

    this.ok(res, fillDTO(RentOfferEntity, result));
  }

  public async getPremiumRentOffersForCity(
    { params }: Request<ParamPremiumRentOffers>,
    res: Response,
  ): Promise<void> {
    const cityName = params.cityName as CityName;
    const count = params.count;
    const result = await this.rentOfferService.getPremiumRentOffers(cityName, count
      ? null : Number.parseInt(count!, 10));
    this.ok(res, fillDTO(RentOfferEntity, result));
  }
}
