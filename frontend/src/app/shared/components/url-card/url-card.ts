import { Component, input, output } from '@angular/core';
import { UserLink } from '../../../core/types/user.type';
import { Toggle } from '../../ui/toggle/toggle';

@Component({
  selector: 'app-url-card',
  imports: [Toggle],
  templateUrl: './url-card.html',
  styleUrl: './url-card.scss',
})
export class UrlCard {
  urlData = input<UserLink | null>(null);
  toggleChanged = output<boolean>();
}
