import { Component, computed, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/ui/button/button';
import { Toggle } from '../../../shared/ui/toggle/toggle';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { toFieldResult } from '../../../core/utils/rxjs.utils';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-account',
  imports: [FormsModule, ReactiveFormsModule, Button, Toggle],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly authService = inject(AuthService);
  private readonly settingsService = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.currentUser;

  readonly isPublic = new Subject<boolean>();

  readonly visibilityUpdate = toSignal(
    this.isPublic.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((result: boolean) => {
        if (result === this.user()?.is_public) {
          return of(null);
        }

        return this.settingsService.updateProfileVisibility(result).pipe(
          tap(() => {
            this.user.update((u) => (u ? { ...u, is_public: result } : u));
          }),

          catchError((err) => {
            console.error('Failed to change visibility profile:', err);
            return of(null);
          }),
        );
      }),
    ),
    { initialValue: null },
  );

  readonly accountForm = new FormGroup({
    username: new FormControl(this.user()?.username ?? '', [
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
    currentPassword: new FormControl('', []),
  });

  readonly formValue = toSignal(
    this.accountForm.valueChanges.pipe(
      startWith(this.accountForm.getRawValue()),
    ),
  );

  readonly usernameChanged = computed(() => {
    return this.formValue()?.username !== this.user()?.username;
  });

  readonly passwordChanged = computed(() => {
    return !!this.formValue()?.password;
  });

  readonly hasChanges = computed(() => {
    return this.usernameChanged() || this.passwordChanged();
  });

  onSubmit(): void {
    try {
      if (this.accountForm.invalid) {
        return;
      }

      const { username, currentPassword, password } =
        this.accountForm.getRawValue();

      if (!this.usernameChanged() && !this.passwordChanged()) return;

      const usernameCall$ = this.usernameChanged()
        ? toFieldResult(
            this.settingsService.updateUsername(username!),
            'Failed to update username.',
          )
        : of(undefined);

      const passwordCall$ = this.passwordChanged()
        ? toFieldResult(
            this.settingsService.updatePassword(
              currentPassword ?? '',
              password!,
            ),
            'Failed to update password.',
          )
        : of(undefined);

      forkJoin({ username: usernameCall$, password: passwordCall$ })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response) => {
          if (response.password?.ok) {
            this.accountForm.patchValue({ password: '', currentPassword: '' });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
