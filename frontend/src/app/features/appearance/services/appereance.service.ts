import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ThemePreset } from '@linkhub/shared';
import { BASE_URL } from '../../../core/consts/api.endpoint';
import { PublicProfileService } from '../../../core/services/public-profile.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private readonly http = inject(HttpClient);
  private readonly publicProfileService = inject(PublicProfileService);

  readonly currentTheme = signal<ThemePreset | null>(null);

  updateAppearance(preset: ThemePreset) {
    return this.http
      .put<ThemePreset>(`${BASE_URL}/profile/preferences`, preset)
      .pipe(
        tap((res) => {
          this.publicProfileService.updateProfileData(res);
        }),
      );
  }
}
