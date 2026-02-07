import type { CognitiveBias } from '../types';

export interface BiasDefinition {
  id: string;
  name: string;
  category: 'Cognitive' | 'Analytical' | 'Social';
  description: string;
  defaultMitigation: string;
}

export const BIAS_DEFINITIONS: BiasDefinition[] = [
  {
    id: 'bias-anchoring',
    name: 'Anchoring',
    category: 'Cognitive',
    description: 'Over-relying on the first piece of information encountered',
    defaultMitigation:
      'Deliberately seek out multiple initial data points before forming judgments. Consider what conclusion you would reach if your first piece of evidence had been different.',
  },
  {
    id: 'bias-confirmation',
    name: 'Confirmation Bias',
    category: 'Cognitive',
    description: 'Seeking/favoring info that confirms existing beliefs',
    defaultMitigation:
      'Actively seek disconfirming evidence. Assign a team member to play devil\'s advocate. Use ACH to force consideration of alternatives.',
  },
  {
    id: 'bias-availability',
    name: 'Availability Heuristic',
    category: 'Cognitive',
    description: 'Judging likelihood by how easily examples come to mind',
    defaultMitigation:
      'Use base-rate data and statistical analysis rather than relying on memorable examples. Ask: "Am I recalling this easily because it\'s common, or because it\'s vivid?"',
  },
  {
    id: 'bias-mirror-imaging',
    name: 'Mirror-Imaging',
    category: 'Analytical',
    description: 'Assuming adversaries think and act like we do',
    defaultMitigation:
      'Study the adversary\'s culture, doctrine, decision-making processes, and historical behavior patterns. Use Red Team analysis to model their perspective.',
  },
  {
    id: 'bias-groupthink',
    name: 'Groupthink',
    category: 'Social',
    description: 'Conforming to group consensus without critical evaluation',
    defaultMitigation:
      'Encourage dissent and independent analysis before group discussion. Use anonymous polling for initial assessments. Rotate devil\'s advocate roles.',
  },
  {
    id: 'bias-satisficing',
    name: 'Satisficing',
    category: 'Analytical',
    description: 'Accepting the first "good enough" explanation',
    defaultMitigation:
      'Require analysts to generate at least 3 alternative explanations before accepting any. Use a checklist to ensure all reasonable hypotheses have been considered.',
  },
  {
    id: 'bias-premature-closure',
    name: 'Premature Closure',
    category: 'Analytical',
    description: 'Reaching a conclusion before all evidence is examined',
    defaultMitigation:
      'Establish a formal evidence review process. Track which evidence items have been evaluated against each hypothesis. Delay final conclusions until a predetermined evidence threshold is met.',
  },
  {
    id: 'bias-vividness',
    name: 'Vividness Bias',
    category: 'Cognitive',
    description: 'Overweighting dramatic or memorable events',
    defaultMitigation:
      'Weight evidence by credibility and relevance scores, not emotional impact. Ask: "Would I give this evidence the same weight if it were presented in dry, statistical terms?"',
  },
  {
    id: 'bias-hindsight',
    name: 'Hindsight Bias',
    category: 'Cognitive',
    description: '"I knew it all along" — overestimating prior predictability',
    defaultMitigation:
      'Document predictions and confidence levels BEFORE outcomes are known. Review past analyses to calibrate accuracy. Acknowledge uncertainty explicitly in assessments.',
  },
  {
    id: 'bias-bandwagon',
    name: 'Bandwagon Effect',
    category: 'Social',
    description: 'Adopting views because others hold them',
    defaultMitigation:
      'Conduct independent analysis before reviewing peer assessments. Document your reasoning chain before consulting others. Track the source of each analytical judgment.',
  },
  {
    id: 'bias-denial-of-change',
    name: 'Denial of Change',
    category: 'Analytical',
    description: 'Assuming patterns will continue unchanged',
    defaultMitigation:
      'Explicitly identify assumptions about continuity. Conduct "What if?" analysis for pattern breaks. Monitor leading indicators that could signal change.',
  },
  {
    id: 'bias-proportionality',
    name: 'Proportionality Bias',
    category: 'Cognitive',
    description: 'Assuming big events must have big causes',
    defaultMitigation:
      'Consider simple explanations alongside complex ones. Review historical cases where small causes led to large effects (e.g., single misconfiguration causing major breach).',
  },
];

/**
 * Create a fresh set of CognitiveBias entries from the definitions.
 */
export function createDefaultBiases(): CognitiveBias[] {
  return BIAS_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    category: def.category,
    checked: false,
    mitigationNotes: def.defaultMitigation,
  }));
}
