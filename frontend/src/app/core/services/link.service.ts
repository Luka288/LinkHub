import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../consts/api.endpoint';
import { CreateLinkPayload } from '../types/link.types';
import { Observable, tap } from 'rxjs';
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
}
