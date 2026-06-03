import { Component, input } from '@angular/core';
import { UserResponse } from '../../../core/types/user.type';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class Preview {
  data = input<UserResponse | null>();
}
