import { Container } from 'inversify';
import { AuthService, AuthExceptionFilter, DefaultAuthService } from './index.js';
import { Component } from '../../types/index.js';
import { ExceptionFilter } from '../../libs/rest/index.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
