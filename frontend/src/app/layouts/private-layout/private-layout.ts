import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { SidePanel } from '../../shared/components/side-panel/side-panel';
import { Preview } from '../../shared/components/preview/preview';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, SidePanel, Preview],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout implements OnInit {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl(''),
      // error
    });
  }

  ngOnInit(): void {}
}
