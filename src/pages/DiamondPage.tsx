import { useState } from 'react';
import { Diamond, Download, Upload } from 'lucide-react';
import { useDiamondStore, type VertexKey } from '../store/useDiamondStore';
import { DiamondVisualization } from '../components/diamond/DiamondVisualization';
import { VertexEditor } from '../components/diamond/VertexEditor';
import { MetaFeaturesPanel } from '../components/diamond/MetaFeaturesPanel';
import { EventList } from '../components/diamond/EventList';

export function DiamondPage() {
  const activeEvent = useDiamondStore((s) => s.getActiveEvent());
  const exportEvents = useDiamondStore((s) => s.exportEvents);
  const importEvents = useDiamondStore((s) => s.importEvents);
  const events = useDiamondStore((s) => s.events);
  const [activeVertex, setActiveVertex] = useState<VertexKey | null>(null);
  const [importError, setImportError] = useState('');

  const handleVertexClick = (vertex: VertexKey) => {
    setActiveVertex(activeVertex === vertex ? null : vertex);
  };

  const handleExport = () => {
    const json = exportEvents();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diamond-events.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = importEvents(text);
      if (!ok) {
        setImportError('Invalid JSON format. Expected an array of diamond events.');
        setTimeout(() => setImportError(''), 3000);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Diamond size={20} style={{ color: 'var(--iw-accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--iw-text)' }}>
            Diamond Model
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {events.length > 0 && (
            <>
              <button onClick={handleExport} className="btn-ghost flex items-center gap-1.5">
                <Download size={14} />
                <span className="text-xs">Export</span>
              </button>
              <button onClick={handleImport} className="btn-ghost flex items-center gap-1.5">
                <Upload size={14} />
                <span className="text-xs">Import</span>
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--iw-text-muted)' }}>
        Map intrusion events across the Diamond Model of Intrusion Analysis. Each event has four
        vertices: Adversary, Capability, Infrastructure, and Victim. Click a vertex to edit its
        fields. Use the meta-features panel to record timestamps, kill chain phase, confidence,
        and source reliability.
      </p>

      {importError && (
        <div
          className="px-4 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
          }}
        >
          {importError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Event list sidebar */}
        <div className="lg:col-span-1">
          <EventList />
          {events.length === 0 && (
            <div className="mt-4">
              <button
                onClick={handleImport}
                className="btn-secondary w-full flex items-center justify-center gap-1.5"
              >
                <Upload size={14} />
                <span className="text-xs">Import Events</span>
              </button>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {activeEvent ? (
            <>
              {/* Diamond visualization */}
              <div className="card p-6">
                <DiamondVisualization
                  event={activeEvent}
                  onVertexClick={handleVertexClick}
                  activeVertex={activeVertex}
                />
              </div>

              {/* Vertex editor (shown when a vertex is selected) */}
              {activeVertex && (
                <VertexEditor
                  event={activeEvent}
                  vertex={activeVertex}
                  onClose={() => setActiveVertex(null)}
                />
              )}

              {/* Meta-features panel */}
              <MetaFeaturesPanel event={activeEvent} />
            </>
          ) : (
            <div
              className="card p-12 flex items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              <div className="text-center">
                <Diamond size={48} className="mx-auto mb-4" style={{ color: 'var(--iw-text-muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--iw-text)' }}>
                  No Event Selected
                </h3>
                <p className="text-sm max-w-md" style={{ color: 'var(--iw-text-muted)' }}>
                  Create a new event from the event list to begin mapping an intrusion
                  using the Diamond Model framework.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
