import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getFieldError } from '../../../../core/utils/form-errors.util';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterPayload } from '../../../../core/types/auth.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly registerForm = new FormGroup({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ],
      nonNullable: true,
    }),

    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),

    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
      nonNullable: true,
    }),
  });

  readonly getError = (field: keyof typeof this.registerForm.controls) =>
    getFieldError(this.registerForm.get(field));

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.getRawValue();

    this.register({ username, email, password });
  }

  register(payload: RegisterPayload) {
    this.authService
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        // error handler here
      });
  }
}
