import { createContext, useContext, type ReactNode } from 'react';

export interface ThemeColors {
  /** Primary background color */
  bg: string;
  /** Secondary/surface background */
  surface: string;
  /** Primary accent color */
  accent: string;
  /** Secondary accent (optional) */
  accentSecondary?: string;
  /** Primary text color */
  text: string;
  /** Muted/secondary text */
  textMuted: string;
  /** Border color */
  border: string;
  /** Heading font family */
  fontHeading: string;
  /** Body font family */
  fontBody: string;
  /** Variant name */
  variantName: string;
}

export const DEFAULT_THEME: ThemeColors = {
  bg: '#0b0f19',
  surface: '#111827',
  accent: '#06b6d4',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  border: 'rgba(51,65,85,0.5)',
  fontHeading: 'Inter, system-ui, sans-serif',
  fontBody: 'Inter, system-ui, sans-serif',
  variantName: 'default',
};

const ThemeContext = createContext<ThemeColors>(DEFAULT_THEME);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeColors;
  children: ReactNode;
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext);
}
