import { Crosshair } from 'lucide-react';
import { useIOCStore } from '../../store/useIOCStore';

export function IOCInputPanel() {
  const rawInput = useIOCStore((s) => s.rawInput);
  const setRawInput = useIOCStore((s) => s.setRawInput);
  const extract = useIOCStore((s) => s.extract);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Crosshair size={16} style={{ color: 'var(--iw-accent)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--iw-text)' }}>
          Input
        </h3>
      </div>
      <textarea
        className="input-field font-mono text-xs"
        style={{ minHeight: '200px', resize: 'vertical' }}
        placeholder="Paste threat intel here: reports, logs, emails, raw text with IOCs..."
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
      />
      <button
        className="btn-primary w-full"
        onClick={extract}
        disabled={!rawInput.trim()}
      >
        <Crosshair size={14} className="inline mr-1.5" />
        Extract IOCs
      </button>
    </div>
  );
}
