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
import { forkJoin, of, startWith } from 'rxjs';
import { toFieldResult } from '../../../core/utils/rxjs.utils';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly settingsService = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly profileForm = new FormGroup({
    displayName: new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(16)],
      nonNullable: true,
    }),

    bio: new FormControl('', {
      validators: [Validators.maxLength(120)],
      nonNullable: true,
    }),
  });

  readonly formValue = toSignal(
    this.profileForm.valueChanges.pipe(
      startWith(this.profileForm.getRawValue()),
    ),
    { initialValue: this.profileForm.getRawValue() },
  );

  private readonly initialValues = this.profileForm.getRawValue();

  readonly displayNameChanged = computed(() => {
    return this.formValue().displayName !== this.initialValues.displayName;
  });

  readonly bioChanged = computed(() => {
    return this.formValue().bio !== this.initialValues.bio;
  });

  readonly formChanged = computed(() => {
    return this.displayNameChanged() || this.bioChanged();
  });

  onSubmit(): void {
    try {
      const { displayName, bio } = this.profileForm.getRawValue();

      const displayNameCall$ = this.displayNameChanged()
        ? toFieldResult(
            this.settingsService.updateProfile({ display_name: displayName }),
            'Failed to update display name.',
          )
        : of(undefined);

      const bioCall$ = this.bioChanged()
        ? toFieldResult(
            this.settingsService.updateProfile({ bio: bio }),
            'Failed to update bio',
          )
        : of(null);

      forkJoin({ displayName: displayNameCall$, bio: bioCall$ })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response) => {
          if (response.bio?.ok) {
            this.profileForm.patchValue({ displayName: '', bio: '' });
          }

          if (response.displayName?.ok) {
            this.profileForm.patchValue({ displayName: '', bio: '' });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
