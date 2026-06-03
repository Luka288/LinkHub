import { Component, DestroyRef, inject, signal } from '@angular/core';

import { LoginForm } from '../../../../core/types/auth.type';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getFieldError } from '../../../../core/utils/form-errors.util';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly authModel = signal<LoginForm>({
    email: '',
    password: '',
  });

  readonly loading = this.authService.loading;

  protected readonly loginForm = new FormGroup({
    email: new FormControl('lukagaxokidze28@gmail.com', {
      validators: [Validators.email, Validators.required],
      nonNullable: true,
    }),

    password: new FormControl('niniko787', {
      validators: [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.required,
      ],
      nonNullable: true,
    }),
  });

  protected getError = (field: keyof typeof this.loginForm.controls) =>
    getFieldError(this.loginForm.get(field));

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
      });
  }
}
