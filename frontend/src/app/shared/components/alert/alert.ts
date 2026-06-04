import { Component, computed, inject } from '@angular/core';
import {
  AlertService,
  AlertVariant,
} from '../../../core/services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  readonly alertService = inject(AlertService);

  readonly alert = this.alertService.alert;

  variant = computed(() => {
    const variant = this.alert()?.variant ?? AlertVariant.Info;
    return AlertVariant[variant].toLowerCase();
  });

  iconClass = computed(() => {
    const icons: Record<AlertVariant, string> = {
      [AlertVariant.Info]: 'fa-solid fa-circle-info',
      [AlertVariant.Success]: 'fa-regular fa-circle-check',
      [AlertVariant.Warning]: 'fa-solid fa-triangle-exclamation',
      [AlertVariant.Error]: 'fa-solid fa-circle-exclamation',
    };
    return icons[this.alert()?.variant ?? AlertVariant.Info];
  });
}
