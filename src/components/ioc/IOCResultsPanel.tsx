import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useIOCStore, getIOCTypeLabel, formatIOC, type IOCType } from '../../store/useIOCStore';

const TYPE_COLORS: Record<IOCType, string> = {
  ipv4: '#06b6d4',
  ipv6: '#06b6d4',
  domain: '#8b5cf6',
  url: '#f59e0b',
  email: '#ec4899',
  md5: '#10b981',
  sha1: '#10b981',
  sha256: '#10b981',
  cve: '#ef4444',
};

export function IOCResultsPanel() {
  const iocs = useIOCStore((s) => s.iocs);
  const defanged = useIOCStore((s) => s.defanged);
  const duplicatesRemoved = useIOCStore((s) => s.duplicatesRemoved);
  const toggleSelect = useIOCStore((s) => s.toggleSelect);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyOne = async (value: string, type: IOCType, index: number) => {
    const formatted = formatIOC(value, type, defanged);
    await navigator.clipboard.writeText(formatted);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (iocs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-sm" style={{ color: 'var(--iw-text-muted)' }}>
          Extracted IOCs will appear here.
        </p>
      </div>
    );
  }

  // Group by type
  const grouped = iocs.reduce<Record<IOCType, { value: string; selected: boolean; originalIndex: number }[]>>(
    (acc, ioc, idx) => {
      if (!acc[ioc.type]) acc[ioc.type] = [];
      acc[ioc.type].push({ value: ioc.value, selected: ioc.selected, originalIndex: idx });
      return acc;
    },
    {} as Record<IOCType, { value: string; selected: boolean; originalIndex: number }[]>
  );

  const typeOrder: IOCType[] = ['ipv4', 'ipv6', 'domain', 'url', 'email', 'md5', 'sha1', 'sha256', 'cve'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--iw-text)' }}>
          Results ({iocs.length} IOCs)
        </h3>
        {duplicatesRemoved > 0 && (
          <span className="text-xxs font-mono" style={{ color: 'var(--iw-text-muted)' }}>
            {duplicatesRemoved} duplicates removed
          </span>
        )}
      </div>

      {typeOrder.map((type) => {
        const items = grouped[type];
        if (!items || items.length === 0) return null;
        return (
          <div key={type} className="space-y-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="badge text-xxs"
                style={{
                  backgroundColor: `${TYPE_COLORS[type]}20`,
                  color: TYPE_COLORS[type],
                  border: `1px solid ${TYPE_COLORS[type]}30`,
                }}
              >
                {getIOCTypeLabel(type)}
              </span>
              <span className="text-xxs font-mono" style={{ color: 'var(--iw-text-muted)' }}>
                {items.length}
              </span>
            </div>
            {items.map((item) => (
              <div
                key={item.originalIndex}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg group"
                style={{
                  backgroundColor: item.selected
                    ? 'color-mix(in srgb, var(--iw-accent) 8%, var(--iw-bg))'
                    : 'var(--iw-bg)',
                  border: '1px solid var(--iw-border)',
                }}
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.originalIndex)}
                  className="rounded"
                  style={{ accentColor: 'var(--iw-accent)' }}
                />
                <span
                  className="flex-1 font-mono text-xs truncate"
                  style={{ color: 'var(--iw-text)' }}
                  title={formatIOC(item.value, type, defanged)}
                >
                  {formatIOC(item.value, type, defanged)}
                </span>
                <button
                  onClick={() => handleCopyOne(item.value, type, item.originalIndex)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                  title="Copy to clipboard"
                >
                  {copiedIndex === item.originalIndex ? (
                    <Check size={14} style={{ color: '#10b981' }} />
                  ) : (
                    <Copy size={14} style={{ color: 'var(--iw-text-muted)' }} />
                  )}
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
