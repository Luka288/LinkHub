import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-download-button',
  imports: [CommonModule],
  templateUrl: './download-button.html',
  styleUrl: './download-button.scss',
})
export class DownloadButton {
  variant = input<'primary' | 'secondary'>('primary');
  download = input<string | File>();
  href = input<string>();
  ico = input<string>();
}
