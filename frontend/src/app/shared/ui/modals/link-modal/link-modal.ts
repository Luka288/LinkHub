import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import { UserLink } from '../../../../core/types/user.type';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface LinkModalData {
  mode: 'create' | 'edit';
  link?: UserLink;
}

@Component({
  selector: 'app-link-modal',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './link-modal.html',
  styleUrl: './link-modal.scss',
})
export class LinkModal {
  private readonly dialogRef = inject(DialogRef);
  readonly data = inject<LinkModalData>(DIALOG_DATA);

  readonly form = new FormGroup({
    title: new FormControl(this.data.link?.title ?? '', [
      Validators.required,
      Validators.maxLength(64),
    ]),
    url: new FormControl(this.data.link?.url ?? '', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+/),
    ]),
  });

  readonly isEdit = computed(() => this.data.mode === 'edit');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.form.value,
      id: this.data.link?.id,
      userId: this.data.link?.user_id,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
