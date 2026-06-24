import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ThemePreset } from '../../../core/consts/themes';
import { BASE_URL } from '../../../core/consts/api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private readonly http = inject(HttpClient);

  readonly currentTheme = signal<ThemePreset | null>(null);

  updateAppearance(preset: ThemePreset) {
    return this.http.put<ThemePreset>(
      `${BASE_URL}/profile/preferences`,
      preset,
    );
  }
}
