import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LinkModalData } from '../../../../core/types/modal.type';
import { debounceTime, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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

  private initialValue = this.form.getRawValue();

  readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  readonly isChanged = computed(() => {
    const val = this.formValue();

    return (
      val.title !== this.initialValue.title || val.url !== this.initialValue.url
    );
  });

  readonly isEdit = computed(() => this.data.mode === 'create');

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
