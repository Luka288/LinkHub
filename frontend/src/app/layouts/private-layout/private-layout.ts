import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private-layout',
  imports: [],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl(''),
      // error
    });
  }

  ngOnInit(): void {}
}
