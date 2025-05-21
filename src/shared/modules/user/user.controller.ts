import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './request/create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatedUserRdo } from './rdo/created-user.rdo.js';
import { LoginUserRequest } from './request/login-user-request.type.js';
import { RentOfferService } from '../rent-offer/index.js';
import { ParamCheckAuthorization } from './type/param-check-authorization.type.js';
import { RentOfferListElementRdo } from '../rent-offer/index.js';
import { ParamUserFavorite} from './type/param-user-favorite.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto), new ValidateObjectIdMiddleware('email')],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new ValidateDtoMiddleware(LogoutUserDto)],
    });
    this.addRoute({
      path: '/check-auth',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ],
    });
    this.addRoute({
      path: '/favorite/:userId',
      method: HttpMethod.Get,
      handler: this.saveToFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'offerId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ],
    });
    this.addRoute({
      path: '/favorite/:userId',
      method: HttpMethod.Delete,
      handler: this.deleteFromFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'RentOffer', 'offerId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ],
    });
    this.addRoute({
      path: '/favorite/:userId',
      method: HttpMethod.Post,
      handler: this.getFavorites,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ],
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    // 400

    // const [isValidInput, message] = validate(body);
    //
    // if (! isValidInput) {
    //   throw new HttpError(
    //     StatusCodes.BAD_REQUEST,
    //     message,
    //     'UserController'
    //   );
    // }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(CreatedUserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    // res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    // 400

    // const [isValidInput, message] = validate(body);
    //
    // if (! isValidInput) {
    //   throw new HttpError(
    //     StatusCodes.BAD_REQUEST,
    //     message,
    //     'UserController'
    //   );
    // }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );

    // 200

    // this.ok(res, token);
  }

  public async logout(
  // { body }: LogoutUserRequest,
  // res: Response,
  ): Promise<void> {
    // 400

    // const [isValidInput, message] = validate(body);
    //
    // if (! isValidInput) {
    //   throw new HttpError(
    //     StatusCodes.BAD_REQUEST,
    //     message,
    //     'UserController'
    //   );
    // }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );

    // 200

    // this.ok(res, null);
  }

  public async checkAuth(
  // { params }: Request<ParamCheckAuthorization>,
  // res: Response,
  ): Promise<void> {
    // const isAuthorized = validate(params.token);
    //
    // if (! isAuthorized) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'User unauthorized',
    //     'UserController',
    //   );
    // }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );

    // 404

    // const user = this.userService.findById(params.userId);
    //
    // if (! user) {
    //   throw new HttpError(
    //     StatusCodes.NOT_FOUND,
    //     `User with id ${params.userId} not found.`,
    //     'UserController',
    //   );
    // }

    // 200

    // this.ok(res, fillDTO(CreatedUserRdo, result));
  }

  public async saveToFavorite(
    { params }: Request<ParamUserFavorite>,
    res: Response,
  ): Promise<void> {
    // const isAuthorized = validate(params.token);
    //
    // if (! isAuthorized) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'User unauthorized',
    //     'UserController',
    //   );
    // }

    const existsUser = await this.userService.findById(params.userId);
    const existsOffer = await this.rentOfferService.findById(params.offerId);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with id ${params.userId} not found.`,
        'UserController',
      );
    }
    if (! existsOffer) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Offer with id ${params.offerId} not found.`,
        'UserController',
      );
    }

    await this.userService.addFavorite(params.userId, params.offerId);
    this.ok(res, null);
  }

  public async deleteFromFavorite(
    { params }: Request<ParamUserFavorite>,
    res: Response,
  ): Promise<void> {
    // const isAuthorized = validate(params.token);
    //
    // if (! isAuthorized) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'User unauthorized',
    //     'UserController',
    //   );
    // }

    const existsUser = await this.userService.findById(params.userId);
    const existsOffer = await this.rentOfferService.findById(params.offerId);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${params.userId} not found.`,
        'UserController',
      );
    }
    if (! existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'UserController',
      );
    }

    await this.userService.removeFavorite(params.userId, params.offerId);
    this.created(res, null);
  }

  public async getFavorites(
    { params }: Request<ParamCheckAuthorization>,
    res: Response,
  ): Promise<void> {
    // const isAuthorized = validate(params.token);
    //
    // if (! isAuthorized) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'User unauthorized',
    //     'UserController',
    //   );
    // }

    const user = this.userService.findById(params.userId);

    if (! user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${params.userId} not found.`,
        'UserController',
      );
    }

    const offerIds = await this.userService.getFavoriteOfferIds(params.userId);
    const result = await this.rentOfferService.findByIds(offerIds);
    this.ok(res, fillDTO(RentOfferListElementRdo, result));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
