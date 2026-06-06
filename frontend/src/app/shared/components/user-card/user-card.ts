import { Component, input } from '@angular/core';
import { UserResponse } from '../../../core/types/user.type';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  userData = input<UserResponse | null>(null);
}
