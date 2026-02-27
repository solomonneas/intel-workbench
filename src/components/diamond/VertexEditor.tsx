import { X } from 'lucide-react';
import {
  useDiamondStore,
  type VertexKey,
  type DiamondEvent,
  type AdversaryVertex,
  type CapabilityVertex,
  type InfrastructureVertex,
  type VictimVertex,
} from '../../store/useDiamondStore';

interface VertexEditorProps {
  event: DiamondEvent;
  vertex: VertexKey;
  onClose: () => void;
}

const VERTEX_TITLES: Record<VertexKey, string> = {
  adversary: 'Adversary',
  capability: 'Capability',
  infrastructure: 'Infrastructure',
  victim: 'Victim',
};

const VERTEX_DESCRIPTIONS: Record<VertexKey, string> = {
  adversary: 'The threat actor or group responsible for the intrusion event.',
  capability: 'The tools, malware, and techniques used in the attack.',
  infrastructure: 'The physical or logical resources used to deliver the capability.',
  victim: 'The target of the intrusion, including organization, sector, and impact.',
};

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const ADVERSARY_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Threat Actor Name', placeholder: 'e.g., APT28, Fancy Bear' },
  { key: 'aliases', label: 'Known Aliases', placeholder: 'e.g., Sofacy, Sednit, Pawn Storm' },
  { key: 'motivation', label: 'Motivation', placeholder: 'e.g., Espionage, Financial gain, Hacktivism' },
  { key: 'attributionConfidence', label: 'Attribution Confidence', placeholder: 'e.g., High, based on DOJ indictment' },
];

const CAPABILITY_FIELDS: FieldDef[] = [
  { key: 'malware', label: 'Malware', placeholder: 'e.g., X-Agent, Mimikatz', multiline: true },
  { key: 'tools', label: 'Tools', placeholder: 'e.g., Cobalt Strike, PsExec', multiline: true },
  { key: 'techniques', label: 'Techniques', placeholder: 'e.g., Spear-phishing, credential harvesting', multiline: true },
  { key: 'attackIds', label: 'ATT&CK IDs', placeholder: 'e.g., T1566.001, T1059.001' },
];

const INFRASTRUCTURE_FIELDS: FieldDef[] = [
  { key: 'c2Servers', label: 'C2 Servers', placeholder: 'e.g., command-control.example[.]com', multiline: true },
  { key: 'domains', label: 'Domains', placeholder: 'e.g., malicious-domain[.]com', multiline: true },
  { key: 'ips', label: 'IP Addresses', placeholder: 'e.g., 192.168.1[.]100', multiline: true },
  { key: 'hostingProviders', label: 'Hosting Providers', placeholder: 'e.g., Bulletproof hosting, Cloud provider' },
];

const VICTIM_FIELDS: FieldDef[] = [
  { key: 'organization', label: 'Target Organization', placeholder: 'e.g., ACME Corp, Government of X' },
  { key: 'sector', label: 'Sector', placeholder: 'e.g., Energy, Financial, Government' },
  { key: 'geography', label: 'Geography', placeholder: 'e.g., United States, Western Europe' },
  { key: 'impact', label: 'Impact', placeholder: 'e.g., Data exfiltration, service disruption', multiline: true },
];

const FIELD_MAP: Record<VertexKey, FieldDef[]> = {
  adversary: ADVERSARY_FIELDS,
  capability: CAPABILITY_FIELDS,
  infrastructure: INFRASTRUCTURE_FIELDS,
  victim: VICTIM_FIELDS,
};

export function VertexEditor({ event, vertex, onClose }: VertexEditorProps) {
  const store = useDiamondStore();
  const fields = FIELD_MAP[vertex];
  const data = event[vertex] as unknown as Record<string, string>;

  const handleChange = (key: string, value: string) => {
    const update = { [key]: value };
    switch (vertex) {
      case 'adversary':
        store.updateAdversary(event.id, update as Partial<AdversaryVertex>);
        break;
      case 'capability':
        store.updateCapability(event.id, update as Partial<CapabilityVertex>);
        break;
      case 'infrastructure':
        store.updateInfrastructure(event.id, update as Partial<InfrastructureVertex>);
        break;
      case 'victim':
        store.updateVictim(event.id, update as Partial<VictimVertex>);
        break;
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--iw-accent)' }}>
            {VERTEX_TITLES[vertex]}
          </h3>
          <p className="text-xxs mt-0.5" style={{ color: 'var(--iw-text-muted)' }}>
            {VERTEX_DESCRIPTIONS[vertex]}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: 'var(--iw-text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--iw-text-muted)' }}
            >
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                className="input-field font-mono text-xs"
                style={{ minHeight: '60px', resize: 'vertical' }}
                placeholder={field.placeholder}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            ) : (
              <input
                className="input-field text-xs"
                placeholder={field.placeholder}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
