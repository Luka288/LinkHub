import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {}
