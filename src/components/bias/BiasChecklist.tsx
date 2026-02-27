import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Brain, Users, LineChart } from 'lucide-react';
import type { CognitiveBias } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface BiasChecklistProps {
  biases: CognitiveBias[];
  onToggleBias: (biasId: string) => void;
  onUpdateMitigation: (biasId: string, notes: string) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Brain; color: string; label: string }> = {
  Cognitive: { icon: Brain, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30', label: 'Cognitive' },
  Analytical: { icon: LineChart, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', label: 'Analytical' },
  Social: { icon: Users, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', label: 'Social' },
};

export function BiasChecklist({ biases, onToggleBias, onUpdateMitigation }: BiasChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const theme = useTheme();

  const checkedCount = biases.filter((b) => b.checked).length;
  const totalCount = biases.length;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const groupedBiases = {
    Cognitive: biases.filter((b) => b.category === 'Cognitive'),
    Analytical: biases.filter((b) => b.category === 'Analytical'),
    Social: biases.filter((b) => b.category === 'Social'),
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{color: "var(--iw-text-muted)"}}>
            Bias Review Progress
          </span>
          <span className="text-xs font-mono" style={{ color: theme.accent }}>
            {checkedCount}/{totalCount} reviewed ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden border border-slate-700/30" style={{backgroundColor: "var(--iw-bg)"}}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: progressPct === 100 ? '#22c55e' : theme.accent,
            }}
          />
        </div>
        {progressPct === 100 && (
          <p className="text-xs text-intel-green mt-2 font-mono">
            ✓ All biases reviewed — analysis rigor check complete
          </p>
        )}
      </div>

      {/* Grouped biases */}
      {Object.entries(groupedBiases).map(([category, categoryBiases]) => {
        const config = CATEGORY_CONFIG[category];
        const CategoryIcon = config.icon;
        const categoryChecked = categoryBiases.filter((b) => b.checked).length;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <CategoryIcon size={16} className={config.color.split(' ')[0]} />
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{color: "var(--iw-text)"}}>
                {config.label} Biases
              </h3>
              <span className="text-xxs font-mono" style={{color: "var(--iw-text-muted)"}}>
                ({categoryChecked}/{categoryBiases.length})
              </span>
            </div>

            {categoryBiases.map((bias) => {
              const isExpanded = expandedId === bias.id;
              const catConfig = CATEGORY_CONFIG[bias.category];

              return (
                <div
                  key={bias.id}
                  className={`card transition-all duration-200 ${
                    bias.checked
                      ? 'border-slate-600/30 opacity-80'
                      : 'border-slate-700/50'
                  }`}
                >
                  {/* Main row */}
                  <div className="flex items-start gap-3 p-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleBias(bias.id)}
                      className="flex-shrink-0 mt-0.5 transition-colors"
                      title={bias.checked ? 'Mark as not reviewed' : 'Mark as reviewed'}
                    >
                      {bias.checked ? (
                        <CheckCircle2
                          size={20}
                          className="text-intel-green"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ) : (
                        <Circle size={20} className="hover:text-slate-400" style={{ color: "var(--iw-text-muted)" }} />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${
                            bias.checked ? 'line-through' : ''
                          }`}
                          style={{ color: bias.checked ? 'var(--iw-text-muted)' : 'var(--iw-text)' }}
                        >
                          {bias.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xxs font-mono font-medium uppercase tracking-wider border ${catConfig.color}`}
                        >
                          {bias.category}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{color: "var(--iw-text-muted)"}}>
                        {bias.description}
                      </p>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpanded(bias.id)}
                      className="flex-shrink-0 hover:text-slate-300 transition-colors p-1" style={{ color: "var(--iw-text-muted)" }}
                      title={isExpanded ? 'Collapse' : 'Expand mitigation notes'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expandable mitigation notes */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-12">
                      <label className="block text-xxs font-mono font-semibold uppercase tracking-wider mb-2" style={{color: "var(--iw-text-muted)"}}>
                        Mitigation Notes
                      </label>
                      <textarea
                        className="input-field text-xs resize-none font-mono"
                        rows={4}
                        value={bias.mitigationNotes}
                        onChange={(e) => onUpdateMitigation(bias.id, e.target.value)}
                        placeholder="Add notes on how you've mitigated this bias..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
