import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/ui/button/button';
import { Toggle } from '../../../shared/ui/toggle/toggle';

@Component({
  selector: 'app-account',
  imports: [FormsModule, ReactiveFormsModule, Button, Toggle],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;

  readonly accountForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),

    password: new FormControl('', [
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
  });
}
