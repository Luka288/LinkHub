import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { UserLink } from '../../../core/types/user.type';
import { Toggle } from '../../ui/toggle/toggle';
import { LinkService } from '../../../core/services/link.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-url-card',
  imports: [Toggle],
  templateUrl: './url-card.html',
  styleUrl: './url-card.scss',
})
export class UrlCard {
  private readonly linkService = inject(LinkService);
  private readonly destroyRef = inject(DestroyRef);

  urlData = input<UserLink | null>(null);
  toggleChanged = output<boolean>();

  private readonly toggleAction = new Subject<boolean>();

  private readonly toggleAction$ = this.toggleAction
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((action) => {
        const link = this.urlData();
        if (!link) return [];
        if (action === link.is_active) return [link];

        return this.linkService.updateUrl({
          userId: link.user_id,
          id: link.id,
          is_active: action,
        });
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

  onToggle(isActive: boolean) {
    this.toggleAction.next(isActive);
  }
}
