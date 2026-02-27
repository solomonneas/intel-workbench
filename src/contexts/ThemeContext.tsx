import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

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

export const DARK_THEME: ThemeColors = {
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

export const LIGHT_THEME: ThemeColors = {
  bg: '#fafaf9',
  surface: '#ffffff',
  accent: '#2563eb',
  text: '#334155',
  textMuted: '#94a3b8',
  border: 'rgba(226,232,240,1)',
  fontHeading: 'Inter, system-ui, sans-serif',
  fontBody: 'Inter, system-ui, sans-serif',
  variantName: 'analyst-desk',
};

export const DEFAULT_THEME = DARK_THEME;

type ColorMode = 'dark' | 'light';

interface ThemeModeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
  theme: ThemeColors;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'dark',
  toggleMode: () => {},
  theme: DARK_THEME,
});

const STORAGE_KEY = 'iw-color-mode';

function applyCSSVariables(theme: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty('--iw-bg', theme.bg);
  root.style.setProperty('--iw-surface', theme.surface);
  root.style.setProperty('--iw-accent', theme.accent);
  root.style.setProperty('--iw-text', theme.text);
  root.style.setProperty('--iw-text-muted', theme.textMuted);
  root.style.setProperty('--iw-border', theme.border);
}

function getInitialMode(): ColorMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage unavailable
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(getInitialMode);
  const theme = mode === 'dark' ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    applyCSSVariables(theme);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable
    }
  }, [mode, theme]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

const ThemeContext = createContext<ThemeColors>(DARK_THEME);

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
