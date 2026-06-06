import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefresh = req.url.includes('/auth/refresh');

      if (error.status === 401 && !isRefresh) {
        return authService.initialize().pipe(
          switchMap((res) => {
            if (!res?.user) {
              authService.currentUser.set(null);
              return throwError(() => error);
            }

            return next(
              authReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.getAccessToken()}`,
                },
              }),
            );
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
