import { useThemeContext } from '@/context/ThemeContext';

/**
 * Convenience hook for accessing and setting the app theme.
 * @returns {{ theme: 'dark'|'light'|'system', setTheme: Function }}
 */
export function useTheme() {
  return useThemeContext();
}