export type ConsistencyRating = 'C' | 'I' | 'N' | 'NA';

export interface Evidence {
  id: string;
  description: string;
  source: string;
  credibility: 'High' | 'Medium' | 'Low';
  relevance: 'High' | 'Medium' | 'Low';
}

export interface Hypothesis {
  id: string;
  name: string;
  description: string;
}

export interface ACHMatrix {
  id: string;
  name: string;
  hypotheses: Hypothesis[];
  evidence: Evidence[];
  ratings: Record<string, Record<string, ConsistencyRating>>; // evidence.id -> hypothesis.id -> rating
  createdAt: string;
  updatedAt: string;
}

export interface CognitiveBias {
  id: string;
  name: string;
  description: string;
  category: string;
  checked: boolean;
  mitigationNotes: string;
}

export interface BiasChecklist {
  id: string;
  name: string;
  biases: CognitiveBias[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  achMatrices: ACHMatrix[];
  biasChecklists: BiasChecklist[];
  createdAt: string;
  updatedAt: string;
}
