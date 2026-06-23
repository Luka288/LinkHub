import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ThemePreset, APPEARANCE_PRESETS } from '../../core/themes/themes';
import { Thumbnail } from '../../shared/components/thumbnail/thumbnail';
import { Preview } from '../../shared/components/preview/preview';
import { AuthService } from '../../core/services/auth.service';
import { Button } from '../../shared/ui/button/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppearanceService } from './services/appereance.service';

@Component({
  selector: 'app-appearance',
  imports: [Thumbnail, Preview, Button],
  templateUrl: './appearance.html',
  styleUrl: './appearance.scss',
})
export class Appearance {
  private readonly authService = inject(AuthService);
  private readonly appearanceService = inject(AppearanceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.currentUser;

  readonly themes: ThemePreset[] = APPEARANCE_PRESETS;
  readonly newTheme = signal<ThemePreset | null>(null);

  readonly selectedTheme = computed(() => {
    const currentTheme = this.newTheme();

    if (!currentTheme) {
      return false;
    }

    const currentUser = this.user();
    const oldThemeId = currentUser?.preferences?.preset_id;

    return oldThemeId !== currentTheme.preset_id;
  });

  updateTheme(preset: ThemePreset): void {
    this.appearanceService
      .updateAppearance(preset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.user.update((u) => (u ? { ...u, preferences: response } : u));
        },
      });
  }
}
