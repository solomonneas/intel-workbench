import type { ProbabilityBand } from '../types';

export interface ProbabilityBandInfo {
  band: ProbabilityBand;
  label: string;
  min: number; // inclusive percentage
  max: number; // inclusive percentage
  short: string;
  /** Tailwind classes for badges / chips. */
  badge: { bg: string; text: string; border: string };
  /** Tailwind class for the ribbon background. */
  ribbon: string;
}

export const PROBABILITY_BANDS: readonly ProbabilityBandInfo[] = [
  {
    band: 'almost-no-chance',
    label: 'Almost no chance',
    short: 'remote',
    min: 1,
    max: 5,
    badge: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    ribbon: 'bg-red-500/15 border-red-500/40 text-red-300',
  },
  {
    band: 'very-unlikely',
    label: 'Very unlikely',
    short: 'highly improbable',
    min: 5,
    max: 20,
    badge: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    ribbon: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
  },
  {
    band: 'unlikely',
    label: 'Unlikely',
    short: 'improbable',
    min: 20,
    max: 45,
    badge: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    ribbon: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  },
  {
    band: 'roughly-even-chance',
    label: 'Roughly even chance',
    short: 'roughly even odds',
    min: 45,
    max: 55,
    badge: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    ribbon: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-200',
  },
  {
    band: 'likely',
    label: 'Likely',
    short: 'probable',
    min: 55,
    max: 80,
    badge: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    ribbon: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  },
  {
    band: 'very-likely',
    label: 'Very likely',
    short: 'highly probable',
    min: 80,
    max: 95,
    badge: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    ribbon: 'bg-green-500/15 border-green-500/40 text-green-300',
  },
  {
    band: 'almost-certainly',
    label: 'Almost certainly',
    short: 'nearly certain',
    min: 95,
    max: 99,
    badge: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
    ribbon: 'bg-teal-500/15 border-teal-500/40 text-teal-200',
  },
] as const;

const BAND_INDEX: Record<ProbabilityBand, ProbabilityBandInfo> = PROBABILITY_BANDS.reduce(
  (acc, info) => {
    acc[info.band] = info;
    return acc;
  },
  {} as Record<ProbabilityBand, ProbabilityBandInfo>,
);

export function getBandInfo(band: ProbabilityBand): ProbabilityBandInfo {
  return BAND_INDEX[band];
}

export function isProbabilityBand(value: unknown): value is ProbabilityBand {
  return typeof value === 'string' && value in BAND_INDEX;
}

export function formatBandRange(band: ProbabilityBand): string {
  const info = BAND_INDEX[band];
  return `${info.min}-${info.max}%`;
}

export function formatBandWithRange(band: ProbabilityBand): string {
  const info = BAND_INDEX[band];
  return `${info.label} (${info.min}-${info.max}%)`;
}
