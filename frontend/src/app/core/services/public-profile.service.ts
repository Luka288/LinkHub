import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PublicProfileResponse } from '../types/public.profile.type';
import { BASE_URL } from '../consts/api.endpoint';
import { Observable, of, tap } from 'rxjs';
import { ThemePreset } from '../consts/themes';
import { ENABLE_LOADING } from '../tokens/http.token';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  private readonly http = inject(HttpClient);

  private readonly _publicInfo = signal<PublicProfileResponse | null>(null);
  readonly publicInfo = this._publicInfo.asReadonly();

  getUserProfile(username: string): Observable<PublicProfileResponse> {
    const currentCache = this._publicInfo();

    if (currentCache && currentCache.user.username === username) {
      return of(currentCache);
    }

    return this.http
      .get<PublicProfileResponse>(`${BASE_URL}/username/${username}`, {
        context: new HttpContext().set(ENABLE_LOADING, true),
      })
      .pipe(
        tap((res) => {
          this._publicInfo.set(res);
        }),
      );
  }

  incrementClick(username: string, linkId: number) {
    return this.http.post(
      `${BASE_URL}/username/${username}/links/${linkId}/click`,
      {},
    );
  }

  updateProfileData(data: ThemePreset) {
    const current = this._publicInfo();
    if (!current) return;

    const updatedProfile: PublicProfileResponse = {
      ...current,
      preferences: data,
    };

    this._publicInfo.set(updatedProfile);

    console.log(this._publicInfo());
  }
}
