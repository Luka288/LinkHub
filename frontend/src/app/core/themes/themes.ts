export interface ThemePreset {
  preset_id: string;
  label: string;
  background: string;
  text_primary: string;
  text_secondary: string;
  button_bg: string;
  button_text: string;
  border: string;
  radius: 'sm' | 'md' | 'lg' | 'full';
}

export const APPEARANCE_PRESETS: ThemePreset[] = [
  {
    preset_id: 'lavender',
    label: 'Lavender',
    background: 'linear-gradient(135deg, #A89CFF 0%, #FF8FE3 100%)',
    text_primary: '#1A1240',
    text_secondary: '#3D2E8C',
    button_bg: 'linear-gradient(135deg, #6E4FFF 0%, #B14EFF 100%)',
    button_text: '#FFFFFF',
    border: '#6E4FFF',
    radius: 'md',
  },

  {
    preset_id: 'violet-night',
    label: 'Violet night',
    background:
      'linear-gradient(135deg, #2B1B4D 0%, #6E2FA8 60%, #C23FCC 100%)',
    text_primary: '#FFFFFF',
    text_secondary: '#E0B8FF',
    button_bg: 'linear-gradient(135deg, #7B4DFF 0%, #C23FCC 100%)',
    button_text: '#FFFFFF',
    border: '#9B6BFF',
    radius: 'md',
  },

  {
    preset_id: 'forest',
    label: 'Forest',
    background:
      'linear-gradient(135deg, #054D3F 0%, #16A570 55%, #9BE15D 100%)',
    text_primary: '#EFFFF6',
    text_secondary: '#A6F2D0',
    button_bg: 'linear-gradient(135deg, #0FB37A 0%, #8FE04C 100%)',
    button_text: '#04241C',
    border: '#1D9E75',
    radius: 'lg',
  },
  {
    preset_id: 'terracotta',
    label: 'Terracotta',
    background: 'linear-gradient(135deg, #FF7A45 0%, #FFB23E 100%)',
    text_primary: '#3A1505',
    text_secondary: '#8A2E0F',
    button_bg: 'linear-gradient(135deg, #E8431F 0%, #FF8A00 100%)',
    button_text: '#FFFFFF',
    border: '#D85A30',
    radius: 'sm',
  },
  {
    preset_id: 'slate',
    label: 'Slate',
    background:
      'linear-gradient(135deg, #2B2B2B 0%, #5B5BE0 60%, #00C2D1 100%)',
    text_primary: '#FFFFFF',
    text_secondary: '#BFE9FF',
    button_bg: 'linear-gradient(135deg, #4D5BFF 0%, #00C2D1 100%)',
    button_text: '#FFFFFF',
    border: '#5B5BE0',
    radius: 'md',
  },

  {
    preset_id: 'slate-2',
    label: 'Slate',
    background:
      'linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)',
    text_primary: '#F9FAFB',
    text_secondary: '#D1D5DB',
    button_bg: 'linear-gradient(135deg, #64748B, #94A3B8)',
    button_text: '#FFFFFF',
    border: '#64748B',
    radius: 'md',
  },

  {
    preset_id: 'sunset',
    label: 'Sunset',
    background:
      'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFD166 100%)',
    text_primary: '#FFFFFF',
    text_secondary: '#FFE7B3',
    button_bg: 'linear-gradient(135deg, #F43F5E, #FB7185)',
    button_text: '#FFFFFF',
    border: '#F43F5E',
    radius: 'md',
  },

  {
    preset_id: 'ocean',
    label: 'Ocean',
    background:
      'linear-gradient(135deg, #0EA5E9 0%, #2563EB 50%, #4F46E5 100%)',
    text_primary: '#FFFFFF',
    text_secondary: '#BFDBFE',
    button_bg: 'linear-gradient(135deg, #38BDF8, #6366F1)',
    button_text: '#FFFFFF',
    border: '#2563EB',
    radius: 'md',
  },

  {
    preset_id: 'neon',
    label: 'Neon',
    background:
      'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)',
    text_primary: '#F8FAFC',
    text_secondary: '#67E8F9',
    button_bg: 'linear-gradient(135deg, #06B6D4, #A855F7)',
    button_text: '#FFFFFF',
    border: '#A855F7',
    radius: 'md',
  },
];
