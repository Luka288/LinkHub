import { Component, DestroyRef, inject } from '@angular/core';
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
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { forkJoin, of, Subject } from 'rxjs';
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

  readonly accountForm = new FormGroup({
    username: new FormControl(this.user()?.username ?? '', [
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
    currentPassword: new FormControl(''),
  });

  onSubmit(): void {
    try {
      if (this.accountForm.invalid) {
        console.log('invalid form');
        return;
      }

      const { username, currentPassword, password } =
        this.accountForm.getRawValue();

      const usernameChanged = username && username !== this.user()?.username;
      const passwordChanged = !!password;

      console.log('raw values', { username, currentPassword, password });

      if (!usernameChanged && !passwordChanged) return;

      const usernameCall$ = usernameChanged
        ? toFieldResult(
            this.settingsService.updateUsername(username!),
            'Failed to update username.',
          )
        : of(undefined);

      const passwordCall$ = passwordChanged
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
