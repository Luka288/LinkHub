import { Component, input, output } from '@angular/core';
import { UserLink } from '../../../core/types/user.type';
import { Toggle } from '../../ui/toggle/toggle';
import { UpdateLinkPayload } from '../../../core/types/link.types';

@Component({
  selector: 'app-url-card',
  imports: [Toggle],
  templateUrl: './url-card.html',
  styleUrl: './url-card.scss',
})
export class UrlCard {
  urlData = input<UserLink | null>(null);
  toggleChanged = output<UpdateLinkPayload>();
  openEdit = output<void>();

  onToggle(isActive: boolean) {
    const link = this.urlData();
    if (!link) return;

    this.toggleChanged.emit({
      id: link.id,
      userId: link.user_id,
      is_active: isActive,
    });
  }
}
