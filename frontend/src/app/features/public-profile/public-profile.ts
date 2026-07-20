import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { of, switchMap, tap } from 'rxjs';
import { UrlCard } from '../../shared/components/url-card/url-card';
import { UserLink } from '../../core/types/user.type';
import { AuthService } from '../../core/services/auth.service';

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
export class PublicProfile implements OnInit {
  private readonly profileService = inject(PublicProfileService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  readonly router = inject(Router);

  ngOnInit(): void {}

  readonly publicProfile = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((paramMap) => {
        const username = paramMap.get('username');

        if (!username) {
          this.router.navigateByUrl('/not-found');
          return of(null);
        }

        return this.profileService.getUserProfile(username).pipe(
          tap((response) => {
            if (!response || !response.user.is_public) {
              this.router.navigateByUrl('/not-found');
            }
          }),
        );
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
    console.log(link);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }
}
