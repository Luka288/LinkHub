import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { switchMap } from 'rxjs';
import { UrlCard } from '../../shared/components/url-card/url-card';
import { UserLink } from '../../core/types/user.type';

@Component({
  selector: 'app-public-profile',
  imports: [UrlCard],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.scss',
  host: {
    '[style.--bg]': 'theme()?.background',
    '[style.--text-primary]': 'theme()?.text_primary',
    '[style.--text-secondary]': 'theme()?.text_secondary',
    '[style.--button-bg]': 'theme()?.button_bg',
    '[style.--button-text]': 'theme()?.button_text',
  },
})
export class PublicProfile {
  private readonly profileService = inject(PublicProfileService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);

  readonly publicProfile = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((paramMap) => {
        const username = paramMap.get('username');
        return this.profileService.getUserProfile(username!);
      }),
    ),
  );

  readonly theme = computed(() => this.publicProfile()?.preferences);

  openUrl(link: UserLink) {
    const username = this.publicProfile()?.user.username;
    if (!username) return;

    this.profileService
      .incrementClick(username, link.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }
}
