import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService, AlertVariant } from '../services/alert.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.error ?? 'Something went wrong';
      alert.displayAlert('Error', message, AlertVariant.Error);

      console.error(error);

      return throwError(() => error);
    }),
  );
};
