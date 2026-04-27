import { describe, it, expect } from 'vitest';
import {
  PROBABILITY_BANDS,
  getBandInfo,
  isProbabilityBand,
  formatBandRange,
  formatBandWithRange,
} from '../icd203';
import type { ProbabilityBand } from '../../types';

describe('PROBABILITY_BANDS', () => {
  it('exposes the 7 ICD 203 bands in ascending likelihood order', () => {
    expect(PROBABILITY_BANDS.map((b) => b.band)).toEqual([
      'almost-no-chance',
      'very-unlikely',
      'unlikely',
      'roughly-even-chance',
      'likely',
      'very-likely',
      'almost-certainly',
    ]);
  });

  it('every band has min < max within 1-99%', () => {
    for (const info of PROBABILITY_BANDS) {
      expect(info.min).toBeGreaterThanOrEqual(1);
      expect(info.max).toBeLessThanOrEqual(99);
      expect(info.min).toBeLessThan(info.max);
    }
  });

  it('adjacent bands meet at their boundary', () => {
    for (let i = 1; i < PROBABILITY_BANDS.length; i++) {
      const prev = PROBABILITY_BANDS[i - 1];
      const curr = PROBABILITY_BANDS[i];
      expect(curr.min).toBe(prev.max);
    }
  });

  it('uses the canonical ICD 203 band ranges', () => {
    const ranges = Object.fromEntries(
      PROBABILITY_BANDS.map((b) => [b.band, [b.min, b.max]]),
    );
    expect(ranges).toEqual({
      'almost-no-chance': [1, 5],
      'very-unlikely': [5, 20],
      unlikely: [20, 45],
      'roughly-even-chance': [45, 55],
      likely: [55, 80],
      'very-likely': [80, 95],
      'almost-certainly': [95, 99],
    });
  });
});

describe('getBandInfo', () => {
  it('returns the matching record for every band', () => {
    for (const info of PROBABILITY_BANDS) {
      expect(getBandInfo(info.band)).toBe(info);
    }
  });
});

describe('isProbabilityBand', () => {
  const valid: ProbabilityBand[] = [
    'almost-no-chance',
    'very-unlikely',
    'unlikely',
    'roughly-even-chance',
    'likely',
    'very-likely',
    'almost-certainly',
  ];

  it.each(valid)('accepts %s', (band) => {
    expect(isProbabilityBand(band)).toBe(true);
  });

  it.each([
    undefined,
    null,
    '',
    'Likely', // case-sensitive
    'maybe',
    'High', // legacy ConfidenceLevel value
    42,
    {},
  ])('rejects %p', (input) => {
    expect(isProbabilityBand(input)).toBe(false);
  });
});

describe('formatters', () => {
  it('formatBandRange produces "min-max%"', () => {
    expect(formatBandRange('roughly-even-chance')).toBe('45-55%');
    expect(formatBandRange('almost-certainly')).toBe('95-99%');
  });

  it('formatBandWithRange produces "<Label> (min-max%)"', () => {
    expect(formatBandWithRange('likely')).toBe('Likely (55-80%)');
    expect(formatBandWithRange('almost-no-chance')).toBe('Almost no chance (1-5%)');
  });
});
