import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component } from '../../types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { RentOfferEntity } from './rent-offer.entity.js';
import { RentOfferRdo } from './rdo/rent-offer.rdo.js';

@injectable()
export class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for RentOfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.createRentOffer });
    this.addRoute({ path: '/', method: HttpMethod.Put, handler: this.updateRentOffer });
    this.addRoute({ path: '/', method: HttpMethod.Delete, handler: this.deleteRentOffer });
    this.addRoute({ path: '/get-list', method: HttpMethod.Get, handler: this.getRentOfferList });
    this.addRoute({ path: '/info/:rentOfferId', method: HttpMethod.Get, handler: this.getRentOfferInfo });
    this.addRoute({ path: '/premium/:cityName', method: HttpMethod.Get, handler: this.getPremiumRentOffersForCity });
  }

  public async createRentOffer(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.rentOfferService.create(body);
    this.created(res, fillDTO(RentOfferRdo, result));
  }

  public async updateRentOffer(
    { body, params }: Request<Record<string, string>, Record<string, unknown>, CreateRentOfferDto>,
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
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {
    await this.rentOfferService.delete(params.rentOfferId);
    this.ok(res, null);
  }

  public async getRentOfferList(
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {

    const count = params.count;
    const result = count
      ? await this.rentOfferService.getList(Number.parseInt(count, 10))
      : await this.rentOfferService.getListWithDefaultPagination();
    this.ok(res, fillDTO(CreateRentOfferDto, result));
  }

  public async getRentOfferInfo(
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateRentOfferDto>,
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
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateRentOfferDto>,
    res: Response,
  ): Promise<void> {

    const cityName = params.cityName as CityName;
    const count = params.count;
    const result = count
      ? await this.rentOfferService.getPremiumRentOffers(cityName, Number.parseInt(count, 10))
      : await this.rentOfferService.getPremiumRentOffersWithDefaultPagination(cityName);
    this.ok(res, fillDTO(RentOfferEntity, result));
  }
}
