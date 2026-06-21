import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PublicProfileResponse } from '../types/public.profile.type';
import { BASE_URL } from '../consts/api.endpoint';
import { Observable } from 'rxjs';
import { ThemePreset } from '../themes/themes';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  private readonly http = inject(HttpClient);

  getUserProfile(username: string): Observable<PublicProfileResponse> {
    return this.http.get<PublicProfileResponse>(
      `${BASE_URL}/username/${username}`,
    );
  }

  incrementClick(username: string, linkId: number) {
    return this.http.post(
      `${BASE_URL}/username/${username}/links/${linkId}/click`,
      {},
    );
  }
}
