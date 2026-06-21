import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ThemePreset, APPEARANCE_PRESETS } from '../../core/themes/themes';
import { Thumbnail } from '../../shared/components/thumbnail/thumbnail';
import { Preview } from '../../shared/components/preview/preview';
import { AuthService } from '../../core/services/auth.service';
import { AppearanceService } from '../../core/services/appereance.service';
import { Button } from '../../shared/ui/button/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  readonly themes: ThemePreset[] = APPEARANCE_PRESETS;
  readonly user = this.authService.currentUser;
  readonly selectedTheme = signal<ThemePreset | null>(null);

  updateTheme(preset: ThemePreset): void {
    this.selectedTheme.set(preset);
    this.appearanceService
      .updateAppearance(preset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.selectedTheme.set(null);
          this.user.update((u) => (u ? { ...u, preferences: response } : u));
        },
      });
  }
}
