import { useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/** Minimal type declarations for the driver.js global loaded via CDN */
interface DriverStep {
  element?: string;
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
}

interface DriverConfig {
  showProgress?: boolean;
  animate?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  stagePadding?: number;
  stageRadius?: number;
  popoverClass?: string;
  steps?: DriverStep[];
  onDestroyStarted?: () => void;
  onDestroyed?: () => void;
}

interface DriverInstance {
  drive: () => void;
  destroy: () => void;
  isActive: () => boolean;
}

interface DriverConstructor {
  new (config: DriverConfig): DriverInstance;
}

declare global {
  interface Window {
    driver?: {
      js?: {
        driver: DriverConstructor;
      };
    };
  }
}

const TOUR_STORAGE_KEY = 'intel-workbench-tour-complete';

const TOUR_STEPS: DriverStep[] = [
  {
    popover: {
      title: '🛡️ Welcome to Intel Workbench',
      description:
        'Intel Workbench helps you perform structured Analysis of Competing Hypotheses (ACH). Let\'s take a quick tour of the key features.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="hypothesis-columns"]',
    popover: {
      title: 'Hypothesis Columns',
      description:
        'Each column represents a competing hypothesis. Add as many as you need — the matrix will score them against all evidence.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="evidence-rows"]',
    popover: {
      title: 'Evidence Rows',
      description:
        'Each row is a piece of evidence or intelligence indicator. Set credibility and relevance to weight its impact on scoring.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="scoring-cells"]',
    popover: {
      title: 'Scoring Cells',
      description:
        'Click any cell to cycle through ratings: Consistent (C), Inconsistent (I), Neutral (N), or N/A (—). Ratings drive the hypothesis scores.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="score-bar"]',
    popover: {
      title: 'Score Bar Results',
      description:
        'The score bar shows each hypothesis\'s weighted inconsistency score. The one with the lowest score (trophy icon) is the best-supported hypothesis.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="bias-nav"]',
    popover: {
      title: 'Bias Checklist',
      description:
        'Navigate here to review 12 cognitive biases that might affect your analysis. Check off each one as you mitigate it.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="export-nav"]',
    popover: {
      title: 'Export & Import',
      description:
        'Export your analysis as JSON (for backup) or Markdown (for reports). Import previously saved projects here too.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="docs-nav"]',
    popover: {
      title: 'Documentation',
      description:
        'Full in-app documentation covering ACH methodology, scoring formulas, keyboard shortcuts, and more.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="variant-picker"]',
    popover: {
      title: 'Theme Variants',
      description:
        'Switch between 5 visual themes — Langley, Terminal, Analyst\'s Desk, Stratcom, and Cyber Noir. Same tools, different aesthetic.',
      side: 'right',
      align: 'center',
    },
  },
];

function getDriverClass(): DriverConstructor | null {
  // driver.js loaded via CDN exposes window.driver.js.driver
  if (window.driver?.js?.driver) {
    return window.driver.js.driver;
  }
  return null;
}

interface GuidedTourProps {
  /** If true, force-start the tour regardless of localStorage */
  forceStart?: boolean;
  /** Called when tour completes or is dismissed */
  onComplete?: () => void;
}

export function GuidedTour({ forceStart = false, onComplete }: GuidedTourProps) {
  const theme = useTheme();

  const startTour = useCallback(() => {
    const Driver = getDriverClass();
    if (!Driver) {
      console.warn('driver.js not loaded — tour skipped');
      return;
    }

    const driverInstance = new Driver({
      showProgress: true,
      animate: true,
      overlayColor: theme.bg,
      overlayOpacity: 0.75,
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: 'intel-tour-popover',
      steps: TOUR_STEPS,
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        driverInstance.destroy();
        onComplete?.();
      },
      onDestroyed: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        onComplete?.();
      },
    });

    // Short delay to let the DOM settle
    requestAnimationFrame(() => {
      driverInstance.drive();
    });
  }, [theme.bg, onComplete]);

  // Auto-start on first visit
  useEffect(() => {
    if (forceStart) {
      startTour();
      return;
    }

    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Delay auto-start to let the page render
      const timer = setTimeout(startTour, 800);
      return () => clearTimeout(timer);
    }
  }, [forceStart, startTour]);

  return null;
}

/** Button component to manually trigger the tour */
export function TakeTourButton() {
  const theme = useTheme();

  const handleClick = () => {
    const Driver = getDriverClass();
    if (!Driver) {
      console.warn('driver.js not loaded — tour unavailable');
      return;
    }

    const driverInstance = new Driver({
      showProgress: true,
      animate: true,
      overlayColor: theme.bg,
      overlayOpacity: 0.75,
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: 'intel-tour-popover',
      steps: TOUR_STEPS,
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        driverInstance.destroy();
      },
      onDestroyed: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      },
    });

    driverInstance.drive();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:opacity-80"
      style={{
        backgroundColor: `${theme.accent}15`,
        color: theme.accent,
        border: `1px solid ${theme.border}`,
      }}
      title="Take guided tour"
    >
      <span>?</span>
      <span>Tour</span>
    </button>
  );
}
