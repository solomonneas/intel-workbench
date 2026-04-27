import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { ProbabilityBand } from '../../types';
import { PROBABILITY_BANDS, getBandInfo } from '../../utils/icd203';

interface ProbabilityBandPickerProps {
  value?: ProbabilityBand;
  onChange: (next: ProbabilityBand | undefined) => void;
  /** Tooltip / aria label suffix, e.g. hypothesis name. */
  contextLabel?: string;
}

/**
 * ICD 203 estimative-language picker. Pops a panel listing all 7 bands
 * with their numeric ranges and lets the analyst pick one or clear it.
 */
export function ProbabilityBandPicker({ value, onChange, contextLabel }: ProbabilityBandPickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      const t = event.target as Node;
      if (buttonRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = value ? getBandInfo(value) : null;
  const triggerLabel = current ? `${current.label} (${current.min}-${current.max}%)` : 'Set likelihood';
  const triggerClass = current
    ? `${current.badge.bg} ${current.badge.text} ${current.badge.border}`
    : 'bg-surface-700 border-slate-700/40';

  const ariaLabel = contextLabel
    ? `ICD 203 likelihood for ${contextLabel}: ${current ? current.label : 'unset'}`
    : `ICD 203 likelihood: ${current ? current.label : 'unset'}`;

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xxs font-medium border transition-all hover:opacity-80 ${triggerClass}`}
        style={{ color: current ? undefined : 'var(--iw-text-muted)' }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        title="ICD 203 estimative likelihood"
      >
        <span className="truncate max-w-[10rem]">{triggerLabel}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label="ICD 203 likelihood bands"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 w-72 rounded-lg shadow-2xl border p-1 text-left"
          style={{
            backgroundColor: 'var(--iw-surface)',
            borderColor: 'var(--iw-border)',
            color: 'var(--iw-text)',
          }}
        >
          <div className="px-2 pt-1.5 pb-1 text-xxs font-mono uppercase tracking-wider" style={{ color: 'var(--iw-text-muted)' }}>
            ICD 203 estimative likelihood
          </div>
          {PROBABILITY_BANDS.map((info) => {
            const selected = value === info.band;
            return (
              <button
                key={info.band}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(info.band);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-xs transition-colors text-left ${
                  selected ? `${info.badge.bg} ${info.badge.text} ${info.badge.border} border` : 'hover:bg-surface-700/60 border border-transparent'
                }`}
              >
                <span className="font-medium">{info.label}</span>
                <span className="font-mono text-xxs" style={{ color: selected ? undefined : 'var(--iw-text-muted)' }}>
                  {info.min}-{info.max}%
                </span>
              </button>
            );
          })}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="w-full mt-1 flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-surface-700/60 transition-colors"
              style={{ color: 'var(--iw-text-muted)' }}
            >
              <X size={12} />
              Clear likelihood
            </button>
          )}
        </div>
      )}
    </div>
  );
}
