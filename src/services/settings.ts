/**
 * Poran Smart Calculator - Settings Management
 * Persistent configuration stored in localStorage
 */

export type ThemeOption = 'dark' | 'light' | 'neon';
export type DisplaySizeOption = 'small' | 'medium' | 'large';
export type ButtonSizeOption = 'medium' | 'large' | 'xlarge';
export type AngleUnitOption = 'deg' | 'rad';
export type AppLanguage = 'en' | 'bn';

export interface AppSettings {
  theme: ThemeOption;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  displayFontSize: DisplaySizeOption;
  buttonSize: ButtonSizeOption;
  autoSave: boolean;
  angleUnit: AngleUnitOption;
  language: AppLanguage;
  bengaliDigits: boolean;
}

const SETTINGS_KEY = 'poran_calculator_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true,
  displayFontSize: 'large',
  buttonSize: 'large',
  autoSave: true,
  angleUnit: 'deg',
  language: 'en',
  bengaliDigits: false,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applyThemeClass(settings.theme);
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function applyThemeClass(theme: ThemeOption): void {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-light', 'theme-neon', 'dark', 'light');

  if (theme === 'dark') {
    root.classList.add('dark', 'theme-dark');
  } else if (theme === 'neon') {
    root.classList.add('dark', 'theme-neon');
  } else {
    root.classList.add('light', 'theme-light');
  }
}
