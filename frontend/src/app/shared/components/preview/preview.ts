import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UserResponse } from '../../../core/types/user.type';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Preview {
  data = input<UserResponse | null>();
}
