import { Copy, FileDown, ToggleLeft, ToggleRight, Trash2, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useIOCStore, formatIOC } from '../../store/useIOCStore';
import { copyText } from '../../utils/clipboard';

export function IOCActionsBar() {
  const iocs = useIOCStore((s) => s.iocs);
  const defanged = useIOCStore((s) => s.defanged);
  const toggleDefang = useIOCStore((s) => s.toggleDefang);
  const selectAll = useIOCStore((s) => s.selectAll);
  const deselectAll = useIOCStore((s) => s.deselectAll);
  const clear = useIOCStore((s) => s.clear);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [copyError, setCopyError] = useState('');

  const selectedIOCs = iocs.filter((ioc) => ioc.selected);
  const hasSelection = selectedIOCs.length > 0;
  const hasIOCs = iocs.length > 0;
  const allSelected = hasIOCs && selectedIOCs.length === iocs.length;

  const getFormattedSelected = () =>
    selectedIOCs.map((ioc) => formatIOC(ioc.value, ioc.type, defanged));

  const handleCopySelected = async () => {
    try {
      const values = getFormattedSelected();
      const copied = await copyText(values.join('\n'));
      if (!copied) {
        throw new Error('Clipboard copy failed');
      }
      setCopyError('');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch {
      const message = 'Unable to copy selected IOCs to the clipboard.';
      setCopyError(message);
      window.alert(message);
      setTimeout(() => setCopyError(''), 4000);
    }
  };

  const handleExportCSV = () => {
    const rows = selectedIOCs.map(
      (ioc) => `"${ioc.type}","${formatIOC(ioc.value, ioc.type, defanged).replace(/"/g, '""')}"`
    );
    const csv = 'type,value\n' + rows.join('\n');
    downloadFile(csv, 'iocs.csv', 'text/csv');
  };

  const handleExportJSON = () => {
    const data = selectedIOCs.map((ioc) => ({
      type: ioc.type,
      value: formatIOC(ioc.value, ioc.type, defanged),
    }));
    downloadFile(JSON.stringify(data, null, 2), 'iocs.json', 'application/json');
  };

  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg"
        style={{
          backgroundColor: 'var(--iw-surface)',
          border: '1px solid var(--iw-border)',
        }}
      >
        <button
          onClick={toggleDefang}
          className="btn-ghost flex items-center gap-1.5"
          title={defanged ? 'Show refanged (live) IOCs' : 'Show defanged (safe) IOCs'}
        >
          {defanged ? <ToggleRight size={16} style={{ color: 'var(--iw-accent)' }} /> : <ToggleLeft size={16} />}
          <span className="text-xs">{defanged ? 'Defanged' : 'Refanged'}</span>
        </button>

        <div className="w-px h-5" style={{ backgroundColor: 'var(--iw-border)' }} />

        <button
          onClick={allSelected ? deselectAll : selectAll}
          className="btn-ghost flex items-center gap-1.5"
          disabled={!hasIOCs}
        >
          {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
          <span className="text-xs">{allSelected ? 'Deselect All' : 'Select All'}</span>
        </button>

        <div className="w-px h-5" style={{ backgroundColor: 'var(--iw-border)' }} />

        <button
          onClick={handleCopySelected}
          className="btn-ghost flex items-center gap-1.5"
          disabled={!hasSelection}
        >
          <Copy size={14} />
          <span className="text-xs">
            {copyFeedback ? 'Copied!' : `Copy Selected (${selectedIOCs.length})`}
          </span>
        </button>

        <button
          onClick={handleExportCSV}
          className="btn-ghost flex items-center gap-1.5"
          disabled={!hasSelection}
        >
          <FileDown size={14} />
          <span className="text-xs">CSV</span>
        </button>

        <button
          onClick={handleExportJSON}
          className="btn-ghost flex items-center gap-1.5"
          disabled={!hasSelection}
        >
          <FileDown size={14} />
          <span className="text-xs">JSON</span>
        </button>

        <div className="flex-1" />

        <button
          onClick={clear}
          className="btn-ghost flex items-center gap-1.5 text-red-400 hover:text-red-300"
          disabled={!hasIOCs && !useIOCStore.getState().rawInput}
        >
          <Trash2 size={14} />
          <span className="text-xs">Clear</span>
        </button>
      </div>

      {copyError && (
        <div className="flex items-center gap-2 text-xs text-red-400 px-1">
          <AlertTriangle size={14} />
          <span>{copyError}</span>
        </div>
      )}
    </div>
  );
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
