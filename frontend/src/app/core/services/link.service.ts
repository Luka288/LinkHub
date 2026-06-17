import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import {
  CreateLinkPayload,
  DeleteLinkPayload,
  UpdateLinkPayload,
} from '../types/link.types';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserLink } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  createLink(payload: CreateLinkPayload): Observable<UserLink> {
    return this.http.post<UserLink>(`${BASE_URL}/links`, payload).pipe(
      tap((link: UserLink) => {
        this.authService.currentUser.update((user) => {
          if (!user) return null;

          return { ...user, links: [...user.links, link] };
        });
      }),
    );
  }

  toggleLink(payload: UpdateLinkPayload): Observable<UserLink> {
    const currentUser = this.authService.currentUser;

    const matchUser = currentUser()!.links.find((url) => url.id === payload.id);

    if (payload.is_active === matchUser?.is_active) {
      return of(matchUser as UserLink);
    }

    return this.http.patch<UserLink>(`${BASE_URL}/links/toggle`, payload).pipe(
      tap((updatedLink: UserLink) => {
        currentUser.update((user) => {
          if (!user) return user;

          return {
            ...user,
            links: user.links.map((link) =>
              link.id === updatedLink.id ? updatedLink : link,
            ),
          };
        });
      }),
    );
  }

  modifyLink(payload: UpdateLinkPayload) {
    console.log(payload);
    return this.http.put<UserLink>(`${BASE_URL}/links/update`, payload).pipe(
      tap((modifiedLink) => {
        this.authService.currentUser.update((user) => {
          if (!user) return user;

          return {
            ...user,
            links: user.links.map((link) =>
              link.id === modifiedLink.id ? modifiedLink : link,
            ),
          };
        });
      }),
    );
  }

  deleteLink(payload: DeleteLinkPayload) {
    return this.http
      .delete<{ message: string }>(`${BASE_URL}/links/delete/${payload.id}`)
      .pipe(
        tap(() => {
          this.authService.currentUser.update((user) => {
            if (!user) return user;

            return {
              ...user,
              links: user.links.filter((url) => url.id !== payload.id),
            };
          });
        }),
      );
  }
}
