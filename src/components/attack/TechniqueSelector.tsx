import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  loadAttack,
  isValidTechniqueId,
  type AttackDataset,
  type AttackTechnique,
} from '../../data/attack';
import { TechniqueChips } from './TechniqueChips';

interface TechniqueSelectorProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  helper?: string;
  maxResults?: number;
}

export function TechniqueSelector({
  value,
  onChange,
  label = 'MITRE ATT&CK Techniques',
  helper = 'Search by ID (T1059), technique name, or tactic.',
  maxResults = 25,
}: TechniqueSelectorProps) {
  const [dataset, setDataset] = useState<AttackDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeTactic, setActiveTactic] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAttack().then(
      (d) => {
        if (!cancelled) setDataset(d);
      },
      (e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load ATT&CK dataset.');
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const matches = useMemo<AttackTechnique[]>(() => {
    if (!dataset) return [];
    const q = query.trim().toLowerCase();
    let pool = dataset.techniques;
    if (activeTactic) {
      pool = pool.filter((t) => t.tactics.includes(activeTactic));
    }
    if (q) {
      pool = pool.filter((t) => {
        return (
          t.id.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      });
    }
    if (!q && !activeTactic) {
      // Default: don't dump all 691 — show top techniques alphabetically by ID, no subs
      pool = pool.filter((t) => !t.is_sub);
    }
    return pool.slice(0, maxResults);
  }, [dataset, query, activeTactic, maxResults]);

  const addById = (id: string) => {
    const cleaned = id.trim().toUpperCase();
    if (!isValidTechniqueId(cleaned)) return;
    if (selectedSet.has(cleaned)) return;
    onChange([...value, cleaned]);
  };

  const remove = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const handleManualAdd = () => {
    addById(query);
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium" style={{ color: 'var(--iw-text-muted)' }}>
        {label}
      </label>

      {value.length > 0 && (
        <TechniqueChips ids={value} onRemove={remove} size="sm" />
      )}

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--iw-text-muted)' }}
            />
            <input
              type="text"
              className="input-field pl-8 text-xs"
              placeholder="Search techniques (e.g., T1059, phishing, lateral movement)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter' && isValidTechniqueId(query.trim().toUpperCase())) {
                  e.preventDefault();
                  handleManualAdd();
                }
              }}
            />
          </div>
          {isValidTechniqueId(query.trim().toUpperCase()) && !selectedSet.has(query.trim().toUpperCase()) && (
            <button
              type="button"
              onClick={handleManualAdd}
              className="btn-secondary text-xs whitespace-nowrap"
            >
              <Plus size={12} className="inline mr-1" /> Add {query.trim().toUpperCase()}
            </button>
          )}
        </div>

        {dataset && open && (
          <>
            <div className="flex flex-wrap gap-1 mt-2">
              <button
                type="button"
                onClick={() => setActiveTactic(null)}
                className={`text-xxs font-mono px-2 py-0.5 rounded border transition-colors ${
                  activeTactic === null ? 'border-accent-500/50' : 'border-slate-700/40'
                }`}
                style={{
                  color: activeTactic === null ? 'var(--iw-accent, #38bdf8)' : 'var(--iw-text-muted)',
                  backgroundColor: activeTactic === null
                    ? 'var(--iw-accent-soft, rgba(56, 189, 248, 0.1))'
                    : 'transparent',
                }}
              >
                All
              </button>
              {dataset.tactics.map((t) => (
                <button
                  key={t.shortname}
                  type="button"
                  onClick={() =>
                    setActiveTactic(activeTactic === t.shortname ? null : t.shortname)
                  }
                  className={`text-xxs font-mono px-2 py-0.5 rounded border transition-colors ${
                    activeTactic === t.shortname ? 'border-accent-500/50' : 'border-slate-700/40'
                  }`}
                  style={{
                    color:
                      activeTactic === t.shortname ? 'var(--iw-accent, #38bdf8)' : 'var(--iw-text-muted)',
                    backgroundColor: activeTactic === t.shortname
                      ? 'var(--iw-accent-soft, rgba(56, 189, 248, 0.1))'
                      : 'transparent',
                  }}
                  title={t.id ?? t.name}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div
              className="mt-2 border rounded-lg max-h-64 overflow-y-auto"
              style={{
                backgroundColor: 'var(--iw-bg)',
                borderColor: 'var(--iw-border, rgba(148, 163, 184, 0.2))',
              }}
            >
              {matches.length === 0 && (
                <div className="p-3 text-xs" style={{ color: 'var(--iw-text-muted)' }}>
                  No techniques match. Try a different query, or paste a technique ID directly.
                </div>
              )}
              {matches.map((t) => {
                const already = selectedSet.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={already}
                    onClick={() => {
                      addById(t.id);
                      setQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-xs border-b last:border-b-0 hover:bg-surface-700/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: 'var(--iw-border, rgba(148, 163, 184, 0.1))' }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-semibold" style={{ color: 'var(--iw-accent, #38bdf8)' }}>
                        {t.id}
                      </span>
                      <span style={{ color: 'var(--iw-text)' }}>{t.name}</span>
                      {already && (
                        <span className="ml-auto text-xxs" style={{ color: 'var(--iw-text-muted)' }}>
                          added
                        </span>
                      )}
                    </div>
                    {t.tactics.length > 0 && (
                      <div className="text-xxs font-mono mt-0.5" style={{ color: 'var(--iw-text-muted)' }}>
                        {t.tactics.join(' · ')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {error && (
          <p className="text-xxs text-red-400 mt-2">{error}</p>
        )}
        {helper && !error && (
          <p className="text-xxs mt-1.5" style={{ color: 'var(--iw-text-muted)' }}>
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}
