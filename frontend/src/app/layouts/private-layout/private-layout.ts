import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { SidePanel } from '../../shared/components/side-panel/side-panel';
import { Preview } from '../../shared/components/preview/preview';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, SidePanel],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout implements OnInit {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly userData = toSignal(this.authService.fetchCurrentProfile(), {
    initialValue: null,
  });

  logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl(''),
      });
  }

  ngOnInit(): void {}
}
