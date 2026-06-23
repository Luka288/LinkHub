import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserCard } from '../../shared/components/user-card/user-card';
import { Preview } from '../../shared/components/preview/preview';
import { LinkService } from '../../core/services/link.service';
import {
  CreateLinkPayload,
  UpdateLinkPayload,
} from '../../core/types/link.types';
import { Dialog } from '@angular/cdk/dialog';
import { LinkModal } from '../../shared/ui/modals/link-modal/link-modal';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  switchMap,
} from 'rxjs';
import { UrlCard } from '../../shared/components/url-card/url-card';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UserLink } from '../../core/types/user.type';
import { LinkModalData } from '../../core/types/modal.type';

@Component({
  selector: 'app-links',
  imports: [UserCard, Preview, UrlCard],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private readonly authService = inject(AuthService);
  private readonly linkService = inject(LinkService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(Dialog);

  readonly user = this.authService.currentUser;

  private readonly toggleAction = new Subject<UpdateLinkPayload>();
  readonly toggleAction$ = toSignal(
    this.toggleAction.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((payload) => {
        return this.linkService.toggleLink({
          userId: payload.userId,
          id: payload.id,
          is_active: payload.is_active,
        });
      }),
      takeUntilDestroyed(this.destroyRef),
    ),
  );

  onToggleChanged(payload: UpdateLinkPayload) {
    this.toggleAction.next(payload);
  }

  onRemove(id: number) {
    this.linkService.deleteLink({ id: id }).subscribe(console.log);
  }

  openCreate(): void {
    const ref = this.dialog.open<CreateLinkPayload, LinkModalData>(LinkModal, {
      data: { kind: 'link', mode: 'create' },
      width: '450px',
    });

    ref.closed
      .pipe(
        filter(Boolean),
        switchMap((result) => this.linkService.createLink(result)),
      )
      .subscribe();
  }

  openModify(link: UserLink): void {
    const ref = this.dialog.open<UpdateLinkPayload, LinkModalData>(LinkModal, {
      data: { kind: 'link', mode: 'edit', link },
      width: '450px',
    });

    ref.closed
      .pipe(
        filter(Boolean),
        switchMap((result) => this.linkService.modifyLink(result)),
      )
      .subscribe();
  }
}
