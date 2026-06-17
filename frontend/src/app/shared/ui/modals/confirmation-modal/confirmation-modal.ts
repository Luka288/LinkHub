import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ConfirmationModalData } from '../../../../core/types/modal.type';
import { Button } from '../../button/button';

@Component({
  selector: 'app-confirmation-modal',
  imports: [Button],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal {
  private readonly dialog = inject(DialogRef);
  readonly modalData = inject<ConfirmationModalData>(DIALOG_DATA);

  confirm(): void {
    this.dialog.close(true);
  }

  cancel(): void {
    this.dialog.close(false);
  }
}
