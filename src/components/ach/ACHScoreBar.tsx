interface ACHScoreBarProps {
  score: number;       // 0-100 normalized (0 = most supported)
  rawScore: number;    // Raw weighted score
  isPreferred: boolean;
}

export function ACHScoreBar({ score, rawScore, isPreferred }: ACHScoreBarProps) {
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
      {/* Raw score label */}
      <span
        className={`text-xxs font-mono ${
          isPreferred ? 'text-intel-green font-bold' : ''
        }`}
        style={{ color: isPreferred ? undefined : 'var(--iw-text-muted)' }}
      >
        {rawScore > 0 ? '+' : ''}{rawScore}
      </span>
    </div>
  );
}
