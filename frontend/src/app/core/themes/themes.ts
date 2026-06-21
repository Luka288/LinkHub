export interface ThemePreset {
  preset_id: string;
  label: string;
  background: string;
  text_primary: string;
  text_secondary: string;
  button_bg: string;
  button_text: string;
  radius: 'sm' | 'md' | 'lg' | 'full';
}

export const APPEARANCE_PRESETS: ThemePreset[] = [
  {
    preset_id: 'lavender',
    label: 'Lavender',
    background: '#EEEDFE',
    text_primary: '#26215C',
    text_secondary: '#534AB7',
    button_bg: '#534AB7',
    button_text: '#EEEDFE',
    radius: 'md',
  },

  {
    preset_id: 'violet-night',
    label: 'Violet night',
    background: '#1A1A1A',
    text_primary: '#FFFFFF',
    text_secondary: '#B4B2A9',
    button_bg: '#534AB7',
    button_text: '#EEEDFE',
    radius: 'md',
  },

  {
    preset_id: 'forest',
    label: 'Forest',
    background: '#04342C',
    text_primary: '#9FE1CB',
    text_secondary: '#5DCAA5',
    button_bg: '#1D9E75',
    button_text: '#ffff',
    radius: 'lg',
  },
  {
    preset_id: 'terracotta',
    label: 'Terracotta',
    background: '#FAECE7',
    text_primary: '#4A1B0C',
    text_secondary: '#993C1D',
    button_bg: '#D85A30',
    button_text: '#FAECE7',
    radius: 'sm',
  },
  {
    preset_id: 'slate',
    label: 'Slate',
    background: '#2C2C2A',
    text_primary: '#D3D1C7',
    text_secondary: '#888780',
    button_bg: '#888780',
    button_text: '#FFFF',
    radius: 'md',
  },
];
