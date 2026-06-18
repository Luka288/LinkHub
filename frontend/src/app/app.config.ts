import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { credentialsInterceptor } from './core/interceptors/credentials-interceptor';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        authInterceptor,
        ErrorInterceptor,
        LoadingInterceptor,
      ]),
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return authService.initialize();
    }),
  ],
};
