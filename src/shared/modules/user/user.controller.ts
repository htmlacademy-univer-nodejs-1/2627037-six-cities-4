import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './request/create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ViewUserRdo } from './rdo/view-user.rdo.js';
import { LoginUserRequest } from './request/login-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';
import { AuthService } from '../auth/index.js';
import { AuthorizedUserRdo } from './rdo/authorized-user.rdo.js';
import { LogoutUserRequest } from './request/logout-user-request.type.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserAvatarRdo } from './rdo/user-avatar.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
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
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(LogoutUserDto),
      ],
    });
    this.addRoute({
      path: '/check-auth',
      method: HttpMethod.Get,
      handler: this.checkAuth,
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
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

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(ViewUserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email «${body.email}» not found.`,
        'UserController'
      );
    }

    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    this.ok(res, fillDTO(AuthorizedUserRdo, { email: user.email, token }));
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response,
  ): Promise<void> {
    const foundUser = await this.userService.findByEmail(body.email);

    if (! foundUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email «${body.email}» not found.`,
        'UserController'
      );
    }

    const token = await this.authService.logout(body);
    this.ok(res, fillDTO(AuthorizedUserRdo, { email: body.email, token }));
  }

  public async checkAuth({ tokenPayload: { email }}: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(email);

    if (! foundUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email «${email}» not found.`,
        'UserController',
      );
    }

    this.ok(res, fillDTO(AuthorizedUserRdo, foundUser));
  }

  public async uploadAvatar({ tokenPayload, file }: Request, res: Response) {
    if (! file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'File required',
        'UserController',
      );
    }
    const update = { avatarPath: file?.filename };
    await this.userService.uploadAvatar(update, tokenPayload.id);
    this.created(res, fillDTO(UserAvatarRdo, update));
  }
}
