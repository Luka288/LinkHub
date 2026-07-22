import { Component, input, output } from '@angular/core';
import { ThemePreset } from '@linkhub/shared';

@Component({
  selector: 'app-thumbnail',
  imports: [],
  templateUrl: './thumbnail.html',
  styleUrl: './thumbnail.scss',
})
export class Thumbnail {
  preset = input.required<ThemePreset>();
  thubnailEmitter = output<ThemePreset>();

  radiusMap = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '999px',
  };
}
