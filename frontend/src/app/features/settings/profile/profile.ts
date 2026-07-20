import { Component, computed, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '../../../shared/ui/button/button';
import { SettingsService } from '../../../core/services/settings.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of, startWith, tap } from 'rxjs';
import { toFieldResult } from '../../../core/utils/rxjs.utils';
import { AuthService } from '../../../core/services/auth.service';
import { duplicateValueValidator } from '../../../core/utils/form-errors.util';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly settingsService = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = this.authService.currentUser;

  readonly profileForm = new FormGroup({
    displayName: new FormControl('', {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(16),
        duplicateValueValidator(() => this.user()?.display_name),
      ],
      nonNullable: true,
    }),

    bio: new FormControl('', {
      validators: [
        Validators.maxLength(120),
        duplicateValueValidator(() => this.user()?.bio),
      ],
      nonNullable: true,
    }),
  });

  readonly formValue = toSignal(
    this.profileForm.valueChanges.pipe(
      startWith(this.profileForm.getRawValue()),
    ),
    { initialValue: this.profileForm.getRawValue() },
  );

  readonly hasDisplayName = computed(
    () => this.formValue().displayName!.trim().length > 0,
  );
  readonly hasBio = computed(() => this.formValue().bio!.trim().length > 0);

  readonly canSubmit = computed(() => this.hasDisplayName() || this.hasBio());

  onSubmit(): void {
    if (this.profileForm.invalid || !this.canSubmit()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { displayName, bio } = this.profileForm.getRawValue();
    const trimmedDisplayName = displayName.trim();
    const trimmedBio = bio.trim();

    const displayNameCall$ = this.hasDisplayName()
      ? toFieldResult(
          this.settingsService.updateProfile({
            display_name: trimmedDisplayName,
          }),
          'Failed to update display name.',
        )
      : of(undefined);

    const bioCall$ = this.hasBio()
      ? toFieldResult(
          this.settingsService.updateProfile({ bio: trimmedBio }),
          'Failed to update bio.',
        )
      : of(undefined);

    forkJoin({ displayName: displayNameCall$, bio: bioCall$ })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.authService.currentUser.update((u) => {
          if (!u) return u;
          return {
            ...u,
            display_name: response.displayName?.ok
              ? trimmedDisplayName
              : u.display_name,
            bio: response.bio?.ok ? trimmedBio : u.bio,
          };
        });
        this.profileForm.reset();
      });
  }
}
