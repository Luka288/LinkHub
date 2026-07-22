import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { ENABLE_LOADING } from '../tokens/http.token';
import {
  CreateLinkPayload,
  DeleteLinkPayload,
  UpdateLinkPayload,
  UserLink,
} from '@linkhub/shared';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  createLink(payload: CreateLinkPayload): Observable<UserLink> {
    return this.http
      .post<UserLink>(`${BASE_URL}/links`, payload, {
        context: new HttpContext().set(ENABLE_LOADING, true),
      })
      .pipe(
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

  reorderLinks(payload: { id: number; order_index: number }[]) {
    return this.http
      .patch<
        { id: number; order_index: number }[]
      >(`${BASE_URL}/profile/reorder`, { links: payload })
      .pipe(
        tap((updatedLinks) => {
          this.authService.currentUser.update((user) => {
            if (!user) return user;

            const orderMap = new Map(
              updatedLinks.map((link) => [link.id, link.order_index]),
            );

            return {
              ...user,
              links: user.links
                .map((link) =>
                  orderMap.has(link.id)
                    ? { ...link, order_index: orderMap.get(link.id)! }
                    : link,
                )
                .sort((a, b) => a.order_index - b.order_index),
            };
          });
        }),
      );
  }
}
