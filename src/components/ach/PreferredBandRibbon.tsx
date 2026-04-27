import { Trophy } from 'lucide-react';
import type { ProbabilityBand } from '../../types';
import { getBandInfo } from '../../utils/icd203';

interface PreferredBandRibbonProps {
  band: ProbabilityBand;
}

/**
 * Banner shown above the preferred hypothesis column with its ICD 203
 * estimative-likelihood band and probability range.
 */
export function PreferredBandRibbon({ band }: PreferredBandRibbonProps) {
  const info = getBandInfo(band);
  return (
    <div
      className={`flex items-center justify-center gap-1.5 w-full px-2 py-1 rounded border text-xxs font-mono uppercase tracking-wider ${info.ribbon}`}
      role="status"
      aria-label={`Preferred hypothesis is assessed as ${info.label}, ${info.min} to ${info.max} percent likely`}
    >
      <Trophy size={11} />
      <span className="font-semibold">{info.label}</span>
      <span aria-hidden="true">·</span>
      <span>{info.min}-{info.max}%</span>
    </div>
  );
}
