import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/id';

export interface AdversaryVertex {
  name: string;
  aliases: string;
  motivation: string;
  attributionConfidence: string;
}

export interface CapabilityVertex {
  malware: string;
  tools: string;
  techniques: string;
  attackIds: string;
}

export interface InfrastructureVertex {
  c2Servers: string;
  domains: string;
  ips: string;
  hostingProviders: string;
}

export interface VictimVertex {
  organization: string;
  sector: string;
  geography: string;
  impact: string;
}

export type KillChainPhase =
  | 'recon'
  | 'weaponization'
  | 'delivery'
  | 'exploitation'
  | 'installation'
  | 'c2'
  | 'actions';

export type ConfidenceLevel = 'Confirmed' | 'Probable' | 'Possible' | 'Doubtful';
export type SourceReliability = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface DiamondMeta {
  timestamp: string;
  phase: KillChainPhase;
  confidence: ConfidenceLevel;
  sourceReliability: SourceReliability;
  notes: string;
}

export interface DiamondEvent {
  id: string;
  name: string;
  adversary: AdversaryVertex;
  capability: CapabilityVertex;
  infrastructure: InfrastructureVertex;
  victim: VictimVertex;
  meta: DiamondMeta;
  createdAt: string;
  updatedAt: string;
}

export type VertexKey = 'adversary' | 'capability' | 'infrastructure' | 'victim';

interface DiamondStore {
  events: DiamondEvent[];
  activeEventId: string | null;

  getActiveEvent: () => DiamondEvent | null;

  createEvent: (name: string) => string;
  deleteEvent: (id: string) => void;
  setActiveEvent: (id: string | null) => void;
  updateEventName: (id: string, name: string) => void;

  updateAdversary: (eventId: string, data: Partial<AdversaryVertex>) => void;
  updateCapability: (eventId: string, data: Partial<CapabilityVertex>) => void;
  updateInfrastructure: (eventId: string, data: Partial<InfrastructureVertex>) => void;
  updateVictim: (eventId: string, data: Partial<VictimVertex>) => void;
  updateMeta: (eventId: string, data: Partial<DiamondMeta>) => void;

  exportEvents: () => string;
  importEvents: (json: string) => boolean;
}

function createEmptyAdversary(): AdversaryVertex {
  return { name: '', aliases: '', motivation: '', attributionConfidence: '' };
}

function createEmptyCapability(): CapabilityVertex {
  return { malware: '', tools: '', techniques: '', attackIds: '' };
}

function createEmptyInfrastructure(): InfrastructureVertex {
  return { c2Servers: '', domains: '', ips: '', hostingProviders: '' };
}

function createEmptyVictim(): VictimVertex {
  return { organization: '', sector: '', geography: '', impact: '' };
}

function createEmptyMeta(): DiamondMeta {
  return {
    timestamp: '',
    phase: 'recon',
    confidence: 'Possible',
    sourceReliability: 'C',
    notes: '',
  };
}

function hasVertexData(event: DiamondEvent, key: VertexKey): boolean {
  const vertex = event[key];
  return Object.values(vertex).some((v) => typeof v === 'string' && v.trim() !== '');
}

export function getVertexFillStatus(event: DiamondEvent) {
  return {
    adversary: hasVertexData(event, 'adversary'),
    capability: hasVertexData(event, 'capability'),
    infrastructure: hasVertexData(event, 'infrastructure'),
    victim: hasVertexData(event, 'victim'),
  };
}

export const KILL_CHAIN_LABELS: Record<KillChainPhase, string> = {
  recon: 'Reconnaissance',
  weaponization: 'Weaponization',
  delivery: 'Delivery',
  exploitation: 'Exploitation',
  installation: 'Installation',
  c2: 'Command & Control',
  actions: 'Actions on Objectives',
};

export const CONFIDENCE_OPTIONS: ConfidenceLevel[] = ['Confirmed', 'Probable', 'Possible', 'Doubtful'];
export const SOURCE_RELIABILITY_OPTIONS: SourceReliability[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export const SOURCE_RELIABILITY_LABELS: Record<SourceReliability, string> = {
  A: 'A: Completely reliable',
  B: 'B: Usually reliable',
  C: 'C: Fairly reliable',
  D: 'D: Not usually reliable',
  E: 'E: Unreliable',
  F: 'F: Reliability unknown',
};

export const useDiamondStore = create<DiamondStore>()(
  persist(
    (set, get) => ({
      events: [],
      activeEventId: null,

      getActiveEvent: () => {
        const state = get();
        return state.events.find((e) => e.id === state.activeEventId) ?? null;
      },

      createEvent: (name: string) => {
        const id = generateId();
        const now = new Date().toISOString();
        const event: DiamondEvent = {
          id,
          name,
          adversary: createEmptyAdversary(),
          capability: createEmptyCapability(),
          infrastructure: createEmptyInfrastructure(),
          victim: createEmptyVictim(),
          meta: createEmptyMeta(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          events: [...state.events, event],
          activeEventId: id,
        }));
        return id;
      },

      deleteEvent: (id: string) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          activeEventId: state.activeEventId === id
            ? (state.events.find((e) => e.id !== id)?.id ?? null)
            : state.activeEventId,
        }));
      },

      setActiveEvent: (id: string | null) => {
        set({ activeEventId: id });
      },

      updateEventName: (id: string, name: string) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, name, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      updateAdversary: (eventId, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, adversary: { ...e.adversary, ...data }, updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      updateCapability: (eventId, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, capability: { ...e.capability, ...data }, updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      updateInfrastructure: (eventId, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, infrastructure: { ...e.infrastructure, ...data }, updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      updateVictim: (eventId, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, victim: { ...e.victim, ...data }, updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      updateMeta: (eventId, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, meta: { ...e.meta, ...data }, updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      exportEvents: () => {
        return JSON.stringify(get().events, null, 2);
      },

      importEvents: (json: string) => {
        try {
          const parsed = JSON.parse(json);
          if (!Array.isArray(parsed)) return false;
          set({ events: parsed, activeEventId: parsed[0]?.id ?? null });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'intel-workbench-diamond',
    }
  )
);
