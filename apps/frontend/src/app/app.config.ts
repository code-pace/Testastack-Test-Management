import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)],
};
