import { Settings2 } from 'lucide-react';
import {
  useDiamondStore,
  type DiamondEvent,
  type KillChainPhase,
  type ConfidenceLevel,
  type SourceReliability,
  KILL_CHAIN_LABELS,
  CONFIDENCE_OPTIONS,
  SOURCE_RELIABILITY_OPTIONS,
  SOURCE_RELIABILITY_LABELS,
} from '../../store/useDiamondStore';

interface MetaFeaturesPanelProps {
  event: DiamondEvent;
}

export function MetaFeaturesPanel({ event }: MetaFeaturesPanelProps) {
  const updateMeta = useDiamondStore((s) => s.updateMeta);
  const { meta } = event;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Settings2 size={16} style={{ color: 'var(--iw-accent)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--iw-text)' }}>
          Meta-Features
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Timestamp */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--iw-text-muted)' }}>
            Event Timestamp
          </label>
          <input
            type="datetime-local"
            className="input-field text-xs"
            value={meta.timestamp}
            onChange={(e) => updateMeta(event.id, { timestamp: e.target.value })}
          />
        </div>

        {/* Kill Chain Phase */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--iw-text-muted)' }}>
            Kill Chain Phase
          </label>
          <select
            className="input-field text-xs"
            value={meta.phase}
            onChange={(e) => updateMeta(event.id, { phase: e.target.value as KillChainPhase })}
          >
            {(Object.keys(KILL_CHAIN_LABELS) as KillChainPhase[]).map((phase) => (
              <option key={phase} value={phase}>
                {KILL_CHAIN_LABELS[phase]}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--iw-text-muted)' }}>
            Confidence Level
          </label>
          <select
            className="input-field text-xs"
            value={meta.confidence}
            onChange={(e) => updateMeta(event.id, { confidence: e.target.value as ConfidenceLevel })}
          >
            {CONFIDENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Reliability */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--iw-text-muted)' }}>
            Source Reliability
          </label>
          <select
            className="input-field text-xs"
            value={meta.sourceReliability}
            onChange={(e) => updateMeta(event.id, { sourceReliability: e.target.value as SourceReliability })}
          >
            {SOURCE_RELIABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {SOURCE_RELIABILITY_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--iw-text-muted)' }}>
          Notes
        </label>
        <textarea
          className="input-field font-mono text-xs"
          style={{ minHeight: '80px', resize: 'vertical' }}
          placeholder="Additional context, analyst comments, references..."
          value={meta.notes}
          onChange={(e) => updateMeta(event.id, { notes: e.target.value })}
        />
      </div>
    </div>
  );
}
