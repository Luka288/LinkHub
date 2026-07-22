import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
} from '@angular/core';
import { UserResponse } from '@linkhub/shared';
import { ThemePreset } from '@linkhub/shared';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--bg]': 'activeTheme()?.background',
    '[style.--text-primary]': 'activeTheme()?.text_primary',
    '[style.--text-secondary]': 'activeTheme()?.text_secondary',
    '[style.--button-bg]': 'activeTheme()?.button_bg',
    '[style.--button-text]': 'activeTheme()?.button_text',
  },
})
export class Preview {
  data = input<UserResponse | null>();
  themePreview = input<ThemePreset | null>();

  readonly activeTheme = computed(
    () => this.themePreview() ?? this.data()?.preferences ?? null,
  );

  constructor() {
    effect(() => console.log(this.data()));
  }
}
