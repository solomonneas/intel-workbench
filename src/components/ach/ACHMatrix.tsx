import { useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  Plus,
  Trash2,
  AlertTriangle,
  Trophy,
  X,
  Grid3X3,
} from 'lucide-react';
import type { ACHMatrix as ACHMatrixType, ConsistencyRating, Evidence, Hypothesis } from '../../types';
import { useProjectStore } from '../../store/useProjectStore';
import {
  calculateAllScores,
  findPreferredHypothesis,
  getNormalizedScores,
  cycleRating,
  getRatingLabel,
} from '../../utils/achScoring';
import { ACHScoreBar } from './ACHScoreBar';

interface ACHMatrixProps {
  projectId: string;
  matrix: ACHMatrixType;
}

const RATING_STYLES: Record<ConsistencyRating, string> = {
  C: 'bg-green-500/20 text-green-400 border-green-500/30',
  I: 'bg-red-500/20 text-red-400 border-red-500/30',
  N: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  NA: 'bg-transparent text-slate-600 border-slate-700/30',
};

const RATING_LABELS: Record<ConsistencyRating, string> = {
  C: 'C',
  I: 'I',
  N: 'N',
  NA: '—',
};

export function ACHMatrix({ projectId, matrix }: ACHMatrixProps) {
  const store = useProjectStore();
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'hypothesis' | 'evidence';
    id: string;
  } | null>(null);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddHypothesis, setShowAddHypothesis] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    type: 'hypothesis' | 'evidence';
    id: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  // New evidence form
  const [newEvidence, setNewEvidence] = useState<Omit<Evidence, 'id'>>({
    description: '',
    source: '',
    credibility: 'Medium',
    relevance: 'Medium',
  });

  // New hypothesis form
  const [newHypName, setNewHypName] = useState('');
  const [newHypDesc, setNewHypDesc] = useState('');

  const scores = useMemo(
    () => calculateAllScores(matrix),
    [matrix.ratings, matrix.evidence, matrix.hypotheses]
  );
  const normalizedScores = useMemo(
    () => getNormalizedScores(matrix),
    [matrix.ratings, matrix.evidence, matrix.hypotheses]
  );
  const preferredId = useMemo(
    () => findPreferredHypothesis(matrix),
    [matrix.ratings, matrix.evidence, matrix.hypotheses]
  );

  const handleCycleRating = useCallback(
    (evidenceId: string, hypothesisId: string) => {
      const current = matrix.ratings[evidenceId]?.[hypothesisId];
      const next = cycleRating(current);
      store.setRating(projectId, matrix.id, evidenceId, hypothesisId, next);
    },
    [projectId, matrix.id, matrix.ratings, store]
  );

  const handleAddEvidence = () => {
    if (!newEvidence.description.trim()) return;
    store.addEvidence(projectId, matrix.id, newEvidence);
    setNewEvidence({ description: '', source: '', credibility: 'Medium', relevance: 'Medium' });
    setShowAddEvidence(false);
  };

  const handleAddHypothesis = () => {
    if (!newHypName.trim()) return;
    store.addHypothesis(projectId, matrix.id, newHypName, newHypDesc);
    setNewHypName('');
    setNewHypDesc('');
    setShowAddHypothesis(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'hypothesis') {
      store.removeHypothesis(projectId, matrix.id, confirmDelete.id);
    } else {
      store.removeEvidence(projectId, matrix.id, confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  const startEditing = (type: 'hypothesis' | 'evidence', id: string, field: string, value: string) => {
    setEditingCell({ type, id, field });
    setEditValue(value);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    if (editingCell.type === 'hypothesis') {
      store.updateHypothesis(projectId, matrix.id, editingCell.id, {
        [editingCell.field]: editValue,
      } as Partial<Pick<Hypothesis, 'name' | 'description'>>);
    } else {
      store.updateEvidence(projectId, matrix.id, editingCell.id, {
        [editingCell.field]: editValue,
      });
    }
    setEditingCell(null);
    setEditValue('');
  };

  const credBadgeClass = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      case 'Low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  if (matrix.hypotheses.length === 0 && matrix.evidence.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Grid3X3 size={48} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">Empty Matrix</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          Start by adding hypotheses (columns) and evidence (rows) to build your Analysis of Competing Hypotheses matrix.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setShowAddHypothesis(true)} className="btn-primary">
            <Plus size={16} className="inline mr-1" /> Add Hypothesis
          </button>
          <button onClick={() => setShowAddEvidence(true)} className="btn-secondary">
            <Plus size={16} className="inline mr-1" /> Add Evidence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button onClick={() => setShowAddHypothesis(true)} className="btn-secondary text-xs">
          <Plus size={14} className="inline mr-1" /> Hypothesis
        </button>
        <button onClick={() => setShowAddEvidence(true)} className="btn-secondary text-xs">
          <Plus size={14} className="inline mr-1" /> Evidence
        </button>
        {preferredId && (
          <div className="ml-auto flex items-center gap-2 text-xs text-intel-green">
            <Trophy size={14} />
            <span className="font-mono">
              Preferred: {matrix.hypotheses.find((h) => h.id === preferredId)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-800">
              {/* Evidence header */}
              <th className="sticky left-0 z-10 bg-surface-800 p-3 text-left text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider border-b border-r border-slate-700/50 min-w-[300px]">
                Evidence / Indicators
              </th>
              <th className="p-3 text-center text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-700/50 w-16">
                Cred.
              </th>
              <th className="p-3 text-center text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-700/50 w-16">
                Rel.
              </th>
              {/* Hypothesis columns */}
              {matrix.hypotheses.map((h, hIdx) => (
                <th
                  key={h.id}
                  className={`p-3 text-center border-b border-r border-slate-700/50 min-w-[140px] ${
                    h.id === preferredId ? 'bg-intel-green/5' : ''
                  }`}
                  {...(hIdx === 0 ? { 'data-tour': 'hypothesis-columns' } : {})}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      {h.id === preferredId && (
                        <Trophy size={12} className="text-intel-green" />
                      )}
                      {editingCell?.type === 'hypothesis' &&
                      editingCell.id === h.id &&
                      editingCell.field === 'name' ? (
                        <input
                          autoFocus
                          className="input-field text-xs text-center w-full"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                        />
                      ) : (
                        <span
                          className="text-xs font-semibold text-slate-200 cursor-pointer hover:text-accent-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none rounded"
                          onClick={() => startEditing('hypothesis', h.id, 'name', h.name)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              startEditing('hypothesis', h.id, 'name', h.name);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          title="Click to edit"
                          aria-label={`Edit hypothesis: ${h.name}`}
                        >
                          {h.name}
                        </span>
                      )}
                    </div>
                    <span className="text-xxs font-mono text-slate-500">
                      Score: {scores[h.id] ?? 0}
                    </span>
                    <button
                      onClick={() => setConfirmDelete({ type: 'hypothesis', id: h.id })}
                      className="text-slate-600 hover:text-red-400 transition-colors p-0.5"
                      title="Delete hypothesis"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.evidence.map((e, idx) => (
              <tr
                key={e.id}
                className={`${
                  idx % 2 === 0 ? 'bg-surface-900/50' : 'bg-surface-800/30'
                } hover:bg-surface-700/30 transition-colors`}
              >
                {/* Evidence description */}
                <td
                  className="sticky left-0 z-10 p-3 border-r border-slate-700/50 bg-inherit"
                  {...(idx === 0 ? { 'data-tour': 'evidence-rows' } : {})}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      {editingCell?.type === 'evidence' &&
                      editingCell.id === e.id &&
                      editingCell.field === 'description' ? (
                        <textarea
                          autoFocus
                          className="input-field text-xs w-full resize-none"
                          rows={2}
                          value={editValue}
                          onChange={(ev) => setEditValue(ev.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(ev) => {
                            if (ev.key === 'Enter' && !ev.shiftKey) {
                              ev.preventDefault();
                              commitEdit();
                            }
                            if (ev.key === 'Escape') setEditingCell(null);
                          }}
                        />
                      ) : (
                        <p
                          className="text-xs text-slate-300 leading-relaxed cursor-pointer hover:text-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none rounded"
                          onClick={() =>
                            startEditing('evidence', e.id, 'description', e.description)
                          }
                          onKeyDown={(ev) => {
                            if (ev.key === 'Enter' || ev.key === ' ') {
                              ev.preventDefault();
                              startEditing('evidence', e.id, 'description', e.description);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          title="Click to edit"
                          aria-label={`Edit evidence: ${e.description.substring(0, 60)}`}
                        >
                          {e.description}
                        </p>
                      )}
                      <p className="text-xxs text-slate-500 font-mono mt-1">{e.source}</p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete({ type: 'evidence', id: e.id })}
                      className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors p-0.5 mt-0.5"
                      title="Delete evidence"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
                {/* Credibility badge */}
                <td className="p-2 text-center border-r border-slate-700/50">
                  <span className={credBadgeClass(e.credibility)}>{e.credibility[0]}</span>
                </td>
                {/* Relevance badge */}
                <td className="p-2 text-center border-r border-slate-700/50">
                  <span className={credBadgeClass(e.relevance)}>{e.relevance[0]}</span>
                </td>
                {/* Rating cells */}
                {matrix.hypotheses.map((h, hIdx) => {
                  const rating = matrix.ratings[e.id]?.[h.id];
                  const displayRating = rating ?? 'NA';
                  const ratingLabel = getRatingLabel(displayRating);
                  return (
                    <td
                      key={`${e.id}-${h.id}`}
                      className={`p-2 text-center border-r border-slate-700/50 cursor-pointer select-none transition-all duration-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none ${
                        h.id === preferredId ? 'bg-intel-green/5' : ''
                      }`}
                      {...(idx === 0 && hIdx === 0 ? { 'data-tour': 'scoring-cells' } : {})}
                      onClick={() => handleCycleRating(e.id, h.id)}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault();
                          handleCycleRating(e.id, h.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Rate evidence "${e.description.substring(0, 40)}" against hypothesis "${h.name}", currently ${ratingLabel}`}
                      title={`${ratingLabel} — Click to cycle`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-mono font-bold transition-all ${RATING_STYLES[displayRating]}`}
                      >
                        {RATING_LABELS[displayRating]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {/* Score bar footer */}
          {matrix.hypotheses.length > 0 && (
            <tfoot data-tour="score-bar">
              <tr className="bg-surface-800 border-t border-slate-700/50">
                <td className="sticky left-0 z-10 bg-surface-800 p-3 border-r border-slate-700/50">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                    Inconsistency Score
                  </span>
                </td>
                <td className="border-r border-slate-700/50" />
                <td className="border-r border-slate-700/50" />
                {matrix.hypotheses.map((h) => (
                  <td key={h.id} className="p-3 border-r border-slate-700/50">
                    <ACHScoreBar
                      score={normalizedScores[h.id] ?? 50}
                      rawScore={scores[h.id] ?? 0}
                      isPreferred={h.id === preferredId}
                    />
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xxs font-mono text-slate-500">
        <span>Legend:</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-5 rounded border bg-green-500/20 border-green-500/30 text-center leading-5 text-green-400">
            C
          </span>
          Consistent
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-5 rounded border bg-red-500/20 border-red-500/30 text-center leading-5 text-red-400">
            I
          </span>
          Inconsistent
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-5 rounded border bg-gray-500/20 border-gray-500/30 text-center leading-5 text-gray-400">
            N
          </span>
          Neutral
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-5 rounded border bg-transparent border-slate-700/30 text-center leading-5 text-slate-600">
            —
          </span>
          N/A
        </span>
      </div>

      {/* Add Hypothesis Modal */}
      {showAddHypothesis && (
        <Modal title="Add Hypothesis" onClose={() => setShowAddHypothesis(false)}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
              <input
                autoFocus
                className="input-field"
                placeholder="e.g., State-sponsored APT group"
                value={newHypName}
                onChange={(e) => setNewHypName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddHypothesis();
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Description (optional)
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Describe this hypothesis..."
                value={newHypDesc}
                onChange={(e) => setNewHypDesc(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddHypothesis(false)} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleAddHypothesis} className="btn-primary" disabled={!newHypName.trim()}>
                Add Hypothesis
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidence && (
        <Modal title="Add Evidence" onClose={() => setShowAddEvidence(false)}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
              <textarea
                autoFocus
                className="input-field resize-none"
                rows={3}
                placeholder="Describe the evidence or indicator..."
                value={newEvidence.description}
                onChange={(e) =>
                  setNewEvidence((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Source</label>
              <input
                className="input-field"
                placeholder="e.g., OSINT, vendor report, government advisory"
                value={newEvidence.source}
                onChange={(e) =>
                  setNewEvidence((prev) => ({ ...prev, source: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Credibility</label>
                <select
                  className="input-field"
                  value={newEvidence.credibility}
                  onChange={(e) =>
                    setNewEvidence((prev) => ({
                      ...prev,
                      credibility: e.target.value as Evidence['credibility'],
                    }))
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Relevance</label>
                <select
                  className="input-field"
                  value={newEvidence.relevance}
                  onChange={(e) =>
                    setNewEvidence((prev) => ({
                      ...prev,
                      relevance: e.target.value as Evidence['relevance'],
                    }))
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddEvidence(false)} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleAddEvidence}
                className="btn-primary"
                disabled={!newEvidence.description.trim()}
              >
                Add Evidence
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <Modal
          title={`Delete ${confirmDelete.type === 'hypothesis' ? 'Hypothesis' : 'Evidence'}?`}
          onClose={() => setConfirmDelete(null)}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                This will permanently remove this {confirmDelete.type} and all associated ratings.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Simple modal wrapper */
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
