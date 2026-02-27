import { type DiamondEvent, type VertexKey, getVertexFillStatus } from '../../store/useDiamondStore';

interface DiamondVisualizationProps {
  event: DiamondEvent;
  onVertexClick: (vertex: VertexKey) => void;
  activeVertex: VertexKey | null;
}

const VERTEX_LABELS: Record<VertexKey, string> = {
  adversary: 'Adversary',
  capability: 'Capability',
  victim: 'Victim',
  infrastructure: 'Infrastructure',
};

const VERTEX_POSITIONS: Record<VertexKey, { cx: number; cy: number; labelY: number; labelAnchor: string }> = {
  adversary: { cx: 200, cy: 40, labelY: -12, labelAnchor: 'middle' },
  capability: { cx: 360, cy: 160, labelY: 4, labelAnchor: 'start' },
  victim: { cx: 200, cy: 280, labelY: 28, labelAnchor: 'middle' },
  infrastructure: { cx: 40, cy: 160, labelY: 4, labelAnchor: 'end' },
};

const EDGES: [VertexKey, VertexKey][] = [
  ['adversary', 'capability'],
  ['capability', 'victim'],
  ['victim', 'infrastructure'],
  ['infrastructure', 'adversary'],
  ['adversary', 'victim'],
  ['infrastructure', 'capability'],
];

export function DiamondVisualization({ event, onVertexClick, activeVertex }: DiamondVisualizationProps) {
  const fillStatus = getVertexFillStatus(event);

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 400 320" className="w-full max-w-md" style={{ overflow: 'visible' }}>
        {/* Edges */}
        {EDGES.map(([from, to]) => {
          const fromPos = VERTEX_POSITIONS[from];
          const toPos = VERTEX_POSITIONS[to];
          const isDiagonal = (from === 'adversary' && to === 'victim') || (from === 'infrastructure' && to === 'capability');
          return (
            <line
              key={`${from}-${to}`}
              x1={fromPos.cx}
              y1={fromPos.cy}
              x2={toPos.cx}
              y2={toPos.cy}
              stroke={isDiagonal ? 'var(--iw-border)' : 'var(--iw-accent)'}
              strokeWidth={isDiagonal ? 1 : 2}
              strokeOpacity={isDiagonal ? 0.4 : 0.5}
              strokeDasharray={isDiagonal ? '4 4' : undefined}
            />
          );
        })}

        {/* Vertices */}
        {(Object.keys(VERTEX_POSITIONS) as VertexKey[]).map((key) => {
          const pos = VERTEX_POSITIONS[key];
          const filled = fillStatus[key];
          const isActive = activeVertex === key;

          return (
            <g
              key={key}
              onClick={() => onVertexClick(key)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onVertexClick(key); }}
            >
              {/* Glow effect for active */}
              {isActive && (
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={30}
                  fill="none"
                  stroke="var(--iw-accent)"
                  strokeWidth={2}
                  opacity={0.4}
                >
                  <animate
                    attributeName="r"
                    values="28;34;28"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.15;0.4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Main circle */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={24}
                fill={
                  isActive
                    ? 'color-mix(in srgb, var(--iw-accent) 25%, var(--iw-surface))'
                    : filled
                    ? 'color-mix(in srgb, var(--iw-accent) 12%, var(--iw-surface))'
                    : 'var(--iw-surface)'
                }
                stroke={isActive ? 'var(--iw-accent)' : filled ? 'var(--iw-accent)' : 'var(--iw-border)'}
                strokeWidth={isActive ? 2.5 : filled ? 1.5 : 1}
              />

              {/* Fill indicator dot */}
              {filled && !isActive && (
                <circle
                  cx={pos.cx + 16}
                  cy={pos.cy - 16}
                  r={4}
                  fill="var(--iw-accent)"
                />
              )}

              {/* Label */}
              <text
                x={pos.cx}
                y={pos.cy + pos.labelY}
                textAnchor="middle"
                className="text-xs font-medium select-none pointer-events-none"
                fill={isActive ? 'var(--iw-accent)' : 'var(--iw-text)'}
              >
                {VERTEX_LABELS[key]}
              </text>

              {/* Primary value preview (inside circle) */}
              <text
                x={pos.cx}
                y={pos.cy + 5}
                textAnchor="middle"
                className="text-xxs font-mono select-none pointer-events-none"
                fill="var(--iw-text-muted)"
              >
                {getVertexPreview(event, key)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function getVertexPreview(event: DiamondEvent, key: VertexKey): string {
  const vertex = event[key];
  const firstValue = Object.values(vertex).find((v) => typeof v === 'string' && v.trim() !== '');
  if (!firstValue) return '';
  const str = String(firstValue);
  return str.length > 12 ? str.slice(0, 11) + '...' : str;
}
