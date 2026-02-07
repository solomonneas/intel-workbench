import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Upload,
  Copy,
  Check,
  FileJson,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { calculateAllScores, findPreferredHypothesis } from '../utils/achScoring';
import { useBasePath } from '../utils/useBasePath';

export function ExportPage() {
  const store = useProjectStore();
  const navigate = useNavigate();
  const basePath = useBasePath();
  const project = store.getActiveProject();
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown'>('json');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Download size={48} className="mx-auto text-slate-600 mb-4" />
          <h2 className="text-lg font-medium text-slate-300 mb-2">No Project Selected</h2>
          <p className="text-sm text-slate-500 mb-4">
            Select a project to export its data.
          </p>
          <button onClick={() => navigate(`${basePath}/`)} className="btn-primary">
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  const generateJSON = (): string => {
    return store.exportProject(project.id) ?? '{}';
  };

  /** Escape a value for use inside a markdown table cell. */
  const escapeCell = (value: string): string =>
    value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();

  const generateMarkdown = (): string => {
    const lines: string[] = [];
    lines.push(`# ${project.name}`);
    lines.push('');
    if (project.description) {
      lines.push(`> ${project.description}`);
      lines.push('');
    }
    lines.push(`**Created:** ${new Date(project.createdAt).toLocaleString()}`);
    lines.push(`**Updated:** ${new Date(project.updatedAt).toLocaleString()}`);
    lines.push('');

    for (const matrix of project.achMatrices) {
      lines.push(`## ACH Matrix: ${escapeCell(matrix.name)}`);
      lines.push('');

      const scores = calculateAllScores(matrix);
      const preferredId = findPreferredHypothesis(matrix);

      // Table header
      const hNames = matrix.hypotheses.map((h) => escapeCell(h.name));
      lines.push(`| Evidence | Source | Cred. | ${hNames.join(' | ')} |`);
      lines.push(`| --- | --- | --- | ${hNames.map(() => '---').join(' | ')} |`);

      // Table rows
      for (const e of matrix.evidence) {
        const ratings = matrix.hypotheses.map((h) => {
          const r = matrix.ratings[e.id]?.[h.id] ?? 'NA';
          return r;
        });
        const desc = escapeCell(e.description).substring(0, 80);
        const source = escapeCell(e.source);
        const cred = escapeCell(e.credibility);
        lines.push(`| ${desc} | ${source} | ${cred} | ${ratings.join(' | ')} |`);
      }
      lines.push('');

      // Scores
      lines.push('### Inconsistency Scores');
      lines.push('');
      for (const h of matrix.hypotheses) {
        const score = scores[h.id] ?? 0;
        const marker = h.id === preferredId ? ' ⭐ **PREFERRED**' : '';
        lines.push(`- **${escapeCell(h.name)}:** ${score}${marker}`);
      }
      lines.push('');

      // Legend
      lines.push('*Legend: C = Consistent, I = Inconsistent, N = Neutral, NA = Not Applicable*');
      lines.push('*Scoring: I = +2, N = 0, C = -1 (weighted by credibility × relevance)*');
      lines.push('');
    }

    // Bias checklists
    for (const checklist of project.biasChecklists) {
      lines.push(`## Bias Checklist: ${escapeCell(checklist.name)}`);
      lines.push('');
      const checked = checklist.biases.filter((b) => b.checked).length;
      lines.push(`**Progress:** ${checked}/${checklist.biases.length} reviewed`);
      lines.push('');
      lines.push('| Bias | Category | Reviewed | Mitigation Notes |');
      lines.push('| --- | --- | --- | --- |');
      for (const bias of checklist.biases) {
        const status = bias.checked ? '✅' : '⬜';
        const name = escapeCell(bias.name);
        const category = escapeCell(bias.category);
        const notes = escapeCell(bias.mitigationNotes).substring(0, 100);
        lines.push(`| ${name} | ${category} | ${status} | ${notes} |`);
      }
      lines.push('');
    }

    return lines.join('\n');
  };

  const getExportContent = (): string => {
    return exportFormat === 'json' ? generateJSON() : generateMarkdown();
  };

  const [copyError, setCopyError] = useState('');

  const handleCopy = async () => {
    const content = getExportContent();
    setCopyError('');
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('Failed to copy — try selecting the text above and copying manually.');
      setTimeout(() => setCopyError(''), 5000);
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const ext = exportFormat === 'json' ? 'json' : 'md';
    const mime = exportFormat === 'json' ? 'application/json' : 'text/markdown';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess(false);
    if (!importText.trim()) {
      setImportError('Please paste a JSON project export.');
      return;
    }
    const success = store.importProject(importText);
    if (success) {
      setImportSuccess(true);
      setImportText('');
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError('Invalid JSON or missing required fields (id, name).');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Export & Import</h2>
        <p className="text-sm text-slate-400">
          Export your analysis as JSON (for backup/sharing) or Markdown (for reports).
        </p>
      </div>

      {/* Export */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Export Project</h3>

        {/* Format selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setExportFormat('json')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              exportFormat === 'json'
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/30'
                : 'bg-surface-700 text-slate-400 border border-slate-700/50 hover:text-slate-200'
            }`}
          >
            <FileJson size={16} />
            JSON
          </button>
          <button
            onClick={() => setExportFormat('markdown')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              exportFormat === 'markdown'
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/30'
                : 'bg-surface-700 text-slate-400 border border-slate-700/50 hover:text-slate-200'
            }`}
          >
            <FileText size={16} />
            Markdown
          </button>
        </div>

        {/* Preview */}
        <div className="relative">
          <pre className="bg-surface-900 border border-slate-700/50 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
            {getExportContent()}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-secondary text-xs">
            {copied ? (
              <>
                <Check size={14} className="inline mr-1 text-intel-green" /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} className="inline mr-1" /> Copy to Clipboard
              </>
            )}
          </button>
          <button onClick={handleDownload} className="btn-primary text-xs">
            <Download size={14} className="inline mr-1" /> Download File
          </button>
        </div>
        {copyError && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle size={14} />
            {copyError}
          </div>
        )}
      </div>

      {/* Import */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Import Project</h3>
        <p className="text-xs text-slate-500">
          Paste a previously exported JSON project to import it. If a project with the same ID
          exists, it will be replaced.
        </p>
        <textarea
          className="input-field font-mono text-xs resize-none"
          rows={6}
          placeholder='Paste JSON here...'
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        {importError && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle size={14} />
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="flex items-center gap-2 text-xs text-intel-green">
            <Check size={14} />
            Project imported successfully!
          </div>
        )}
        <button onClick={handleImport} className="btn-secondary text-xs">
          <Upload size={14} className="inline mr-1" /> Import
        </button>
      </div>
    </div>
  );
}
