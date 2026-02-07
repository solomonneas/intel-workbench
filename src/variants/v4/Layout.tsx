import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Brain,
  Download,
  Crosshair,
  ArrowLeft,
  Radio,
} from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { HomePage } from '../../pages/HomePage';
import { ACHPage } from '../../pages/ACHPage';
import { BiasPage } from '../../pages/BiasPage';
import { ExportPage } from '../../pages/ExportPage';

const THEME: ThemeColors = {
  bg: '#1a2e1a',
  surface: '#1f3620',
  accent: '#f59e0b',
  text: '#d4d0c0',
  textMuted: '#8b9a7a',
  border: 'rgba(245,158,11,0.2)',
  fontHeading: 'Oswald, Impact, sans-serif',
  fontBody: '"JetBrains Mono", "Fira Code", monospace',
  variantName: 'stratcom',
};

const navItems = [
  { to: '', icon: Home, label: 'BASE OPS' },
  { to: 'ach', icon: Grid3X3, label: 'ACH MATRIX' },
  { to: 'bias', icon: Brain, label: 'BIAS CHECK' },
  { to: 'export', icon: Download, label: 'EXFIL DATA' },
];

function formatMilTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}Z`;
}

function formatMilDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function StratcomLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={THEME}>
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: THEME.bg,
          color: THEME.text,
          fontFamily: THEME.fontBody,
        }}
      >
        <style>{`
          .stratcom-grid {
            background-image:
              linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `}</style>

        {/* Sidebar */}
        <aside
          className="w-72 flex-shrink-0 flex flex-col"
          style={{
            backgroundColor: THEME.surface,
            borderRight: `1px solid ${THEME.border}`,
          }}
        >
          {/* Header */}
          <div
            className="h-16 flex items-center gap-3 px-4"
            style={{ borderBottom: `1px solid ${THEME.border}` }}
          >
            <Crosshair size={22} style={{ color: THEME.accent }} />
            <div>
              <h1
                className="text-base font-bold tracking-[3px] uppercase"
                style={{ fontFamily: THEME.fontHeading, color: THEME.accent }}
              >
                STRATCOM
              </h1>
              <p className="text-[9px] tracking-[2px] uppercase" style={{ color: THEME.textMuted }}>
                Intelligence Analysis Command
              </p>
            </div>
          </div>

          {/* OPERATIONAL STATUS panel */}
          <div
            className="px-4 py-3"
            style={{
              borderBottom: `1px solid ${THEME.border}`,
              backgroundColor: 'rgba(245,158,11,0.05)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Radio size={12} style={{ color: THEME.accent }} />
              <span
                className="text-[10px] tracking-[2px] uppercase font-bold"
                style={{ fontFamily: THEME.fontHeading, color: THEME.accent }}
              >
                OPERATIONAL STATUS
              </span>
            </div>
            <div className="space-y-1 text-[10px]" style={{ color: THEME.textMuted }}>
              <div className="flex justify-between">
                <span>STATUS</span>
                <span style={{ color: '#22c55e' }}>● ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>DTG</span>
                <span style={{ color: THEME.text }}>{formatMilDate(time)}</span>
              </div>
              <div className="flex justify-between">
                <span>ZULU</span>
                <span style={{ color: THEME.text }}>{formatMilTime(time)}</span>
              </div>
              <div className="flex justify-between">
                <span>GRID REF</span>
                <span style={{ color: THEME.text }}>38S MD 1234 5678</span>
              </div>
              <div className="flex justify-between">
                <span>THREATCON</span>
                <span style={{ color: THEME.accent }}>BRAVO</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const fullPath = `/v4/${item.to}`;
              const isActive =
                item.to === ''
                  ? location.pathname === '/v4' || location.pathname === '/v4/'
                  : location.pathname.startsWith(fullPath);

              return (
                <NavLink
                  key={item.to}
                  to={fullPath}
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                    color: isActive ? THEME.accent : THEME.textMuted,
                    borderLeft: isActive ? `3px solid ${THEME.accent}` : '3px solid transparent',
                    fontFamily: THEME.fontHeading,
                    letterSpacing: '1px',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mission brief */}
          <div className="px-4 py-3" style={{ borderTop: `1px solid ${THEME.border}` }}>
            {activeProject && (
              <div className="mb-2">
                <span
                  className="text-[9px] tracking-[2px] uppercase block mb-1"
                  style={{ color: THEME.textMuted }}
                >
                  ACTIVE MISSION
                </span>
                <span className="text-xs" style={{ color: THEME.text }}>
                  {activeProject.name}
                </span>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs transition-colors hover:opacity-80"
              style={{ color: THEME.textMuted }}
            >
              <ArrowLeft size={14} />
              <span>RTB (Return to Base)</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden stratcom-grid">
          {/* Top bar */}
          <header
            className="h-10 flex items-center justify-between px-6 flex-shrink-0"
            style={{
              backgroundColor: 'rgba(31,54,32,0.9)',
              borderBottom: `1px solid ${THEME.border}`,
            }}
          >
            <div className="flex items-center gap-4 text-[10px]" style={{ color: THEME.textMuted }}>
              <span>CLASSIFICATION: UNCLASSIFIED // FOUO</span>
            </div>
            <div className="flex items-center gap-4 text-[10px]" style={{ color: THEME.textMuted }}>
              <span>{formatMilTime(time)}</span>
              <span>|</span>
              <span>{formatMilDate(time)}</span>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="ach" element={<ACHPage />} />
              <Route path="ach/:matrixId" element={<ACHPage />} />
              <Route path="bias" element={<BiasPage />} />
              <Route path="export" element={<ExportPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
