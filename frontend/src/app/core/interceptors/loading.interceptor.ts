import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ENABLE_LOADING } from '../tokens/http.token';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const enabled = req.context.get(ENABLE_LOADING);

  if (enabled) loadingService.start();

  return next(req).pipe(finalize(() => loadingService.stop()));
};
