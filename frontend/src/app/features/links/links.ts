import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserCard } from '../../shared/components/user-card/user-card';
import { Preview } from '../../shared/components/preview/preview';
import { LinkService } from '../../core/services/link.service';
import { CreateLinkPayload } from '../../core/types/link.types';
import { Dialog } from '@angular/cdk/dialog';
import {
  LinkModal,
  LinkModalData,
} from '../../shared/ui/modals/link-modal/link-modal';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-links',
  imports: [UserCard, Preview],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private readonly authService = inject(AuthService);
  private readonly linkService = inject(LinkService);
  private readonly dialog = inject(Dialog);

  readonly user = this.authService.currentUser;

  openCreate(): void {
    const ref = this.dialog.open<CreateLinkPayload, LinkModalData>(LinkModal, {
      data: { mode: 'create' },
      width: '450px',
    });

    ref.closed
      .pipe(
        filter(Boolean),
        switchMap((result) => this.linkService.createLink(result)),
      )
      .subscribe();
  }
}
