import { Injectable, signal, computed } from '@angular/core';
import { Observable, defer, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _count = signal(0);
  readonly loading = computed(() => this._count() > 0);

  start() {
    this._count.update((c) => c + 1);
  }

  stop() {
    this._count.update((c) => Math.max(0, c - 1));
  }

  track<T>(obs: Observable<T>): Observable<T> {
    return defer(() => {
      this.start();
      return obs.pipe(finalize(() => this.stop()));
    });
  }
}
