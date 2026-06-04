import { Injectable, signal } from '@angular/core';

export enum AlertVariant {
  Info,
  Success,
  Warning,
  Error,
}

interface AlertState {
  text: string;
  variant: AlertVariant;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _alert = signal<AlertState | null>(null);
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly alert = this._alert.asReadonly();

  displayAlert(
    title: string,
    text: string,
    variant: AlertVariant,
    duration: number = 3000,
  ) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this._alert.set({ text, title, variant });

    if (duration !== null) {
      this.hideTimeout = setTimeout(() => this.hideAlert(), duration);
    }
  }

  hideAlert() {
    this._alert.set(null);
  }
}
