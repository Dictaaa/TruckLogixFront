import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => player,
    }),

    provideRouter(routes),

    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ]
};