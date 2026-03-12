import type { ConfidenceLevel } from '../../types';

interface ACHScoreBarProps {
  score: number;       // 0-100 normalized (0 = most supported)
  rawScore: number;    // Raw weighted score
  isPreferred: boolean;
  confidence?: ConfidenceLevel;
}

const CONFIDENCE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Low: { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-500', 
    border: 'border-amber-500/30',
    label: 'Low'
  },
  Moderate: { 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-500', 
    border: 'border-blue-500/30',
    label: 'Moderate'
  },
  High: { 
    bg: 'bg-green-500/20', 
    text: 'text-green-500', 
    border: 'border-green-500/30',
    label: 'High'
  },
  Unassessed: { 
    bg: 'bg-gray-500/20', 
    text: 'text-gray-400', 
    border: 'border-gray-500/30',
    label: 'Unassessed'
  },
};

export function ACHScoreBar({ score, rawScore, isPreferred, confidence }: ACHScoreBarProps) {
  // Color gradient: green (supported) → amber (mixed) → red (contradicted)
  const getBarColor = () => {
    if (score <= 25) return 'bg-intel-green';
    if (score <= 50) return 'bg-intel-green/70';
    if (score <= 75) return 'bg-intel-amber';
    return 'bg-intel-red';
  };

  const getBorderColor = () => {
    if (isPreferred) return 'border-intel-green/50';
    return 'border-slate-700/30';
  };

  const getConfidenceStyle = () => {
    return confidence ? CONFIDENCE_STYLES[confidence] : CONFIDENCE_STYLES.Unassessed;
  };

  const confStyle = getConfidenceStyle();

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Bar */}
      <div
        className={`w-full h-3 rounded-full overflow-hidden border ${getBorderColor()}`} style={{ backgroundColor: "var(--iw-bg)" }}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${Math.max(100 - score, 5)}%` }}
        />
      </div>
      {/* Score and Confidence row */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xxs font-mono ${
            isPreferred ? 'text-intel-green font-bold' : ''
          }`}
          style={{ color: isPreferred ? undefined : 'var(--iw-text-muted)' }}
        >
          {rawScore > 0 ? '+' : ''}{rawScore}
        </span>
        {/* Confidence Badge */}
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-medium border ${confStyle.bg} ${confStyle.text} ${confStyle.border}`}>
          {confStyle.label}
        </span>
      </div>
    </div>
  );
}
