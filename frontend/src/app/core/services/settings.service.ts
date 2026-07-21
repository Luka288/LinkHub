import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { AlertService, AlertVariant } from './alert.service';
import {
  UpdateProfilePayload,
  UpdateUsernamePayload,
  UpdatePasswordPayload,
  UpdateProfileVisibilityPayload,
} from '@linkhub/shared';

export interface ProfileUpdatePayload {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  updateUsername(newUsername: UpdateUsernamePayload) {
    return this.http
      .patch<{
        id: number;
        username: string;
      }>(`${BASE_URL}/profile/username`, newUsername)
      .pipe(
        tap((response) => {
          this.authService.currentUser.update((u) =>
            u ? { ...u, username: response.username } : u,
          );

          this.alertService.displayAlert(
            'Success',
            'Username updated.',
            AlertVariant.Success,
          );
        }),
      );
  }

  updatePassword(payload: UpdatePasswordPayload) {
    return this.http
      .patch(`${BASE_URL}/profile/password`, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      })
      .pipe(
        tap(() => {
          this.alertService.displayAlert(
            'Success',
            'Password updated.',
            AlertVariant.Success,
          );
        }),
      );
  }

  updateProfileVisibility(is_public: boolean) {
    return this.http.patch<{ is_public: boolean }>(
      `${BASE_URL}/profile/visibility`,
      { is_public },
    );
  }

  updateProfile(payload: UpdateProfilePayload) {
    return this.http
      .patch(`${BASE_URL}/profile`, {
        bio: payload.bio,
        display_name: payload.display_name,
        avatar_url: payload.avatar_url,
      })
      .pipe(
        tap(() => {
          this.alertService.displayAlert(
            'Success',
            `Profile updated!`,
            AlertVariant.Success,
          );
        }),
      );
  }
}
