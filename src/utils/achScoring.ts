import type { ACHMatrix, ConsistencyRating } from '../types';

const RATING_WEIGHTS: Record<ConsistencyRating, number> = {
  C: -1,   // Consistent — supports hypothesis
  I: 2,    // Inconsistent — contradicts hypothesis
  N: 0,    // Neutral
  NA: 0,   // Not Applicable
};

const CREDIBILITY_WEIGHTS: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const RELEVANCE_WEIGHTS: Record<string, number> = {
  High: 1.5,
  Medium: 1.0,
  Low: 0.5,
};

/**
 * Calculate the weighted inconsistency score for a hypothesis.
 *
 * Scoring model:
 *   score += ratingWeight * credibilityWeight * relevanceWeight
 *
 * - ratingWeight: C = -1 (supports), I = +2 (contradicts), N = 0, NA = 0
 * - credibilityWeight: High = 3, Medium = 2, Low = 1
 * - relevanceWeight: High = 1.5, Medium = 1.0, Low = 0.5
 *
 * Lower score = more supported hypothesis (less inconsistency).
 * Positive score = hypothesis is contradicted by evidence.
 * Negative score = hypothesis is strongly supported.
 */
export function calculateInconsistencyScore(
  matrix: ACHMatrix,
  hypothesisId: string
): number {
  let score = 0;

  for (const evidence of matrix.evidence) {
    const rating = matrix.ratings[evidence.id]?.[hypothesisId];
    if (!rating) continue;

    const ratingWeight = RATING_WEIGHTS[rating];
    const credWeight = CREDIBILITY_WEIGHTS[evidence.credibility] ?? 1;
    const relWeight = RELEVANCE_WEIGHTS[evidence.relevance] ?? 1.0;

    score += ratingWeight * credWeight * relWeight;
  }

  return score;
}

/**
 * Calculate all hypothesis scores for a matrix.
 * Returns a map of hypothesisId -> score.
 */
export function calculateAllScores(
  matrix: ACHMatrix
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const h of matrix.hypotheses) {
    scores[h.id] = calculateInconsistencyScore(matrix, h.id);
  }
  return scores;
}

/**
 * Find the hypothesis with the lowest inconsistency score (most supported).
 * Returns null if no hypotheses exist.
 */
export function findPreferredHypothesis(matrix: ACHMatrix): string | null {
  if (matrix.hypotheses.length === 0) return null;

  const scores = calculateAllScores(matrix);
  let minScore = Infinity;
  let preferredId: string | null = null;

  for (const [id, score] of Object.entries(scores)) {
    if (score < minScore) {
      minScore = score;
      preferredId = id;
    }
  }

  return preferredId;
}

/**
 * Get a normalized score (0–100) for visualization.
 * 0 = most supported, 100 = most contradicted.
 */
export function getNormalizedScores(
  matrix: ACHMatrix
): Record<string, number> {
  const scores = calculateAllScores(matrix);
  const values = Object.values(scores);

  if (values.length === 0) return {};

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    // All scores equal — everyone gets 50%
    const result: Record<string, number> = {};
    for (const id of Object.keys(scores)) {
      result[id] = 50;
    }
    return result;
  }

  const normalized: Record<string, number> = {};
  for (const [id, score] of Object.entries(scores)) {
    normalized[id] = Math.round(((score - min) / range) * 100);
  }

  return normalized;
}

/**
 * Get the rating label for display.
 */
export function getRatingLabel(rating: ConsistencyRating): string {
  switch (rating) {
    case 'C':
      return 'Consistent';
    case 'I':
      return 'Inconsistent';
    case 'N':
      return 'Neutral';
    case 'NA':
      return 'N/A';
  }
}

/**
 * Cycle to the next rating in order.
 */
export function cycleRating(current: ConsistencyRating | undefined): ConsistencyRating {
  if (!current || current === 'NA') return 'C';
  if (current === 'C') return 'I';
  if (current === 'I') return 'N';
  return 'NA';
}
