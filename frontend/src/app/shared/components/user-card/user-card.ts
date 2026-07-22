import { Component, input } from '@angular/core';
import { UserResponse } from '@linkhub/shared';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  userData = input<UserResponse | null>(null);
}
