import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PublicProfileResponse } from '../types/public.profile.type';
import { BASE_URL } from '../consts/api.endpoint';
import { Observable } from 'rxjs';
import { ThemePreset } from '../consts/themes';
import { ENABLE_LOADING } from '../tokens/http.token';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  private readonly http = inject(HttpClient);

  getUserProfile(username: string): Observable<PublicProfileResponse> {
    return this.http.get<PublicProfileResponse>(
      `${BASE_URL}/username/${username}`,
      { context: new HttpContext().set(ENABLE_LOADING, true) },
    );
  }

  incrementClick(username: string, linkId: number) {
    return this.http.post(
      `${BASE_URL}/username/${username}/links/${linkId}/click`,
      {},
    );
  }
}
