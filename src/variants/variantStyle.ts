import type { CSSProperties } from 'react';
import type { ThemeColors } from '../contexts/ThemeContext';

export function themeVariableStyle(theme: ThemeColors): CSSProperties {
  return {
    '--iw-bg': theme.bg,
    '--iw-surface': theme.surface,
    '--iw-accent': theme.accent,
    '--iw-text': theme.text,
    '--iw-text-muted': theme.textMuted,
    '--iw-border': theme.border,
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: theme.fontBody,
  } as CSSProperties;
}
