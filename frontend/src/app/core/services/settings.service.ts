import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { ENABLE_LOADING } from '../tokens/http.token';
import { AlertService, AlertVariant } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  updateUsername(newUsername: string) {
    return this.http
      .patch<{
        id: number;
        username: string;
      }>(`${BASE_URL}/profile/username`, { username: newUsername })
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

  updatePassword(currentPassword: string, password: string) {
    return this.http
      .patch(`${BASE_URL}/profile/password`, {
        currentPassword: currentPassword,
        newPassword: password,
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
}
