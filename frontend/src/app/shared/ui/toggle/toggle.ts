import {
  Component,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
})
export class Toggle {
  isActive = input<boolean>(true);
  toggled = output<boolean>();

  protected active = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.active.set(this.isActive());
    });
  }

  toggle() {
    this.active.set(!this.active());
    this.toggled.emit(this.active());
  }
}
