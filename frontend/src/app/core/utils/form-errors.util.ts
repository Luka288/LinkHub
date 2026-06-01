import { AbstractControl } from '@angular/forms';

const errorMessages: Record<string, string> = {
  required: 'This field is required',
  email: 'Enter a valid email address',
  minlength: 'Too short',
  maxlength: 'Too long',
};

export function getFieldError(control: AbstractControl | null): string | null {
  if (!control?.invalid || !control.touched) return null;

  const firstError = Object.keys(control.errors!)[0];
  return errorMessages[firstError] ?? 'Invalid value';
}
