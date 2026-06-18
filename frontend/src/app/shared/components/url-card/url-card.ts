import { Component, inject, input, output } from '@angular/core';
import { UserLink } from '../../../core/types/user.type';
import { Toggle } from '../../ui/toggle/toggle';
import { UpdateLinkPayload } from '../../../core/types/link.types';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationModalData } from '../../../core/types/modal.type';
import { ConfirmationModal } from '../../ui/modals/confirmation-modal/confirmation-modal';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-url-card',
  imports: [Toggle],
  templateUrl: './url-card.html',
  styleUrl: './url-card.scss',
})
export class UrlCard {
  private readonly dialog = inject(Dialog);

  urlData = input<UserLink | null>(null);
  toggleChanged = output<UpdateLinkPayload>();
  emitDelete = output<number>();
  openEdit = output<void>();
  showActions = input<boolean>(true);
  emitter = output<void>();

  onToggle(isActive: boolean) {
    const link = this.urlData();
    if (!link) return;

    this.toggleChanged.emit({
      id: link.id,
      userId: link.user_id,
      is_active: isActive,
    });
  }

  removeAction(link: UserLink | null) {
    const ref = this.dialog.open<boolean, ConfirmationModalData>(
      ConfirmationModal,
      {
        data: {
          kind: 'confirmation',
          message: `Are you sure you want to remove ${link?.title}?`,
        },
        width: '450px',
      },
    );

    ref.closed
      .pipe(
        filter(Boolean),
        tap(() => this.emitDelete.emit(link!.id)),
      )
      .subscribe();
  }
}
