import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  disabled = input<boolean>();
  variant = input<'primary' | 'secondary' | 'danger'>();
  loading = input<boolean>();
  clicked = output<void>();
}
