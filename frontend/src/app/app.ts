import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alert } from './shared/components/alert/alert';
import { AlertService, AlertVariant } from './core/services/alert.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alert],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly alertService = inject(AlertService);
  readonly alert = this.alertService.alert;
}
