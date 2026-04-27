/**
 * MITRE ATT&CK Enterprise dataset (slimmed).
 *
 * Vendored at build time so the workbench stays offline-first. The source bundle
 * is `mitre/cti` `enterprise-attack/enterprise-attack.json`; we keep only the
 * fields the workbench needs (id, name, tactics, description, platforms, url).
 *
 * The dataset is loaded lazily on first use to keep the initial bundle small.
 */

export interface AttackTactic {
  shortname: string;
  name: string;
  id: string | null;
}

export interface AttackTechnique {
  id: string;
  url: string;
  name: string;
  description: string;
  tactics: string[];
  is_sub: boolean;
  platforms: string[];
}

export interface AttackDataset {
  domain: 'enterprise-attack';
  fetched: string;
  tactics: AttackTactic[];
  techniques: AttackTechnique[];
}

let cached: AttackDataset | null = null;
let inflight: Promise<AttackDataset> | null = null;

export async function loadAttack(): Promise<AttackDataset> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = import('./attack-enterprise.json').then((mod) => {
    cached = mod.default as AttackDataset;
    inflight = null;
    return cached;
  });
  return inflight;
}

const TECHNIQUE_RE = /^T\d{4}(\.\d{3})?$/;

export function isValidTechniqueId(id: string): boolean {
  return TECHNIQUE_RE.test(id);
}

export function techniqueUrl(id: string): string {
  if (!isValidTechniqueId(id)) return '';
  const [base, sub] = id.split('.');
  return sub
    ? `https://attack.mitre.org/techniques/${base}/${sub}/`
    : `https://attack.mitre.org/techniques/${base}/`;
}
