import { AbstractControl, ValidationErrors } from '@angular/forms';

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

export function duplicateValueValidator(
  getCurrent: () => string | null | undefined,
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return value === getCurrent() ? { sameAsCurrent: true } : null;
  };
}
