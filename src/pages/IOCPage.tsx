import { Crosshair } from 'lucide-react';
import { IOCInputPanel } from '../components/ioc/IOCInputPanel';
import { IOCResultsPanel } from '../components/ioc/IOCResultsPanel';
import { IOCActionsBar } from '../components/ioc/IOCActionsBar';
import { useIOCStore } from '../store/useIOCStore';

export function IOCPage() {
  const iocs = useIOCStore((s) => s.iocs);
  const hasResults = iocs.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair size={20} style={{ color: 'var(--iw-accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--iw-text)' }}>
            IOC Extractor
          </h2>
        </div>
        <span className="text-xxs font-mono" style={{ color: 'var(--iw-text-muted)' }}>
          Client-side extraction, no data leaves your browser
        </span>
      </div>

      <p className="text-sm" style={{ color: 'var(--iw-text-muted)' }}>
        Paste raw threat intelligence text below to automatically extract Indicators of Compromise.
        Supports IPv4, IPv6, domains, URLs, emails, file hashes (MD5, SHA1, SHA256), and CVE IDs.
        Defanged indicators are recognized and normalized automatically.
      </p>

      {/* Actions bar */}
      {hasResults && <IOCActionsBar />}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="card p-5">
          <IOCInputPanel />
        </div>

        {/* Results panel */}
        <div className="card p-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <IOCResultsPanel />
        </div>
      </div>
    </div>
  );
}
