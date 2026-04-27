import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { loadAttack, techniqueUrl, type AttackTechnique } from '../../data/attack';

interface TechniqueChipsProps {
  ids: string[];
  onRemove?: (id: string) => void;
  size?: 'xs' | 'sm';
}

export function TechniqueChips({ ids, onRemove, size = 'xs' }: TechniqueChipsProps) {
  const [byId, setById] = useState<Record<string, AttackTechnique>>({});

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    loadAttack().then((dataset) => {
      if (cancelled) return;
      const map: Record<string, AttackTechnique> = {};
      for (const t of dataset.techniques) map[t.id] = t;
      setById(map);
    });
    return () => {
      cancelled = true;
    };
  }, [ids.length]);

  if (ids.length === 0) return null;

  const padding = size === 'sm' ? 'px-2 py-1' : 'px-1.5 py-0.5';
  const text = size === 'sm' ? 'text-xs' : 'text-xxs';

  return (
    <div className="flex flex-wrap gap-1">
      {ids.map((id) => {
        const t = byId[id];
        const label = t ? `${id} · ${t.name}` : id;
        const url = techniqueUrl(id);
        return (
          <span
            key={id}
            className={`inline-flex items-center gap-1 ${padding} ${text} font-mono rounded border`}
            style={{
              backgroundColor: 'var(--iw-accent-soft, rgba(56, 189, 248, 0.08))',
              color: 'var(--iw-accent, #38bdf8)',
              borderColor: 'var(--iw-accent-border, rgba(56, 189, 248, 0.3))',
            }}
            title={t?.description || label}
          >
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
                onClick={(ev) => ev.stopPropagation()}
              >
                {label}
                <ExternalLink size={size === 'sm' ? 11 : 9} />
              </a>
            )}
            {!url && <span>{label}</span>}
            {onRemove && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onRemove(id);
                }}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${id}`}
              >
                <X size={size === 'sm' ? 12 : 10} />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
