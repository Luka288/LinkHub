import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import { AuthResponse, LoginPayload } from '../types/auth.type';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserResponse } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<UserResponse | null>(null);

  login(payLoad: LoginPayload) {
    return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, payLoad).pipe(
      tap(({ user }) => {
        this.currentUser.set(user);
      }),
    );
  }

  logout() {
    return this.http.post(`${BASE_URL}/auth/logout`, {}).pipe(
      tap((response) => {
        this.currentUser.set(null);
      }),
    );
  }

  fetchCurrentProfile(): Observable<UserResponse | null> {
    return this.http.get<UserResponse>(`${BASE_URL}/profile`).pipe(
      tap((response) => {
        this.currentUser.set(response);
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }
}
