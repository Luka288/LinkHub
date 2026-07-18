import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  tap,
} from 'rxjs';
import { UrlCard } from '../../shared/components/url-card/url-card';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UserLink } from '../../core/types/user.type';
import { LinkModalData } from '../../core/types/modal.type';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { QrModal } from '../../shared/ui/modals/qr-modal/qr-modal';

@Component({
  selector: 'app-links',
  imports: [UserCard, Preview, UrlCard, DragDropModule],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private readonly authService = inject(AuthService);
  private readonly linkService = inject(LinkService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(Dialog);

  readonly user = this.authService.currentUser;

  readonly isCopied = signal<boolean>(false);

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

  private readonly reorderAction = new Subject<UserLink[]>();
  readonly reorderAction$ = toSignal(
    this.reorderAction.pipe(
      switchMap((links) =>
        this.linkService.reorderLinks(
          links.map((link, index) => ({
            id: link.id,
            order_index: index,
          })),
        ),
      ),

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

  openShare() {
    const ref = this.dialog.open(QrModal, {
      width: '450px',
      height: '250px',
    });
  }

  onDrop(event: CdkDragDrop<UserLink[] | undefined>) {
    if (event.previousIndex === event.currentIndex) return;

    const links = this.user()?.links;
    if (!links) return;

    moveItemInArray(links, event.previousIndex, event.currentIndex);

    this.reorderAction.next(links);
  }

  copyUrl() {
    const url: string = `${window.location.origin}/p/${this.user()?.username}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.isCopied.set(true);

        setTimeout(() => {
          this.isCopied.set(false);
        }, 2500);
      })
      .catch((err) => console.error('Failed to copy URL:', err));
  }
}
