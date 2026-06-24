import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  readonly profileForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),

    bio: new FormControl('', [Validators.maxLength(120)]),
  });
}
