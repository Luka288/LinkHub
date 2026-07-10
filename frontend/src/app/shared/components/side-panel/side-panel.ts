import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavItems } from '../../../core/consts/navigation.const';
import { NavInterface } from '../../../core/types/navigation.type';

@Component({
  selector: 'app-side-panel',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly NavItems: NavInterface[] = NavItems;
  readonly user = this.authService.currentUser;

  logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl(''),
      });
  }
}
