import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Brain,
  Download,
  Shield,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { HomePage } from '../../pages/HomePage';
import { ACHPage } from '../../pages/ACHPage';
import { BiasPage } from '../../pages/BiasPage';
import { ExportPage } from '../../pages/ExportPage';

const THEME: ThemeColors = {
  bg: '#0a1628',
  surface: '#0f1d33',
  accent: '#c9a84c',
  text: '#d4d0c8',
  textMuted: '#8b8575',
  border: 'rgba(201,168,76,0.2)',
  fontHeading: 'Georgia, "Playfair Display", serif',
  fontBody: '"JetBrains Mono", "Fira Code", monospace',
  variantName: 'langley',
};

const navItems = [
  { to: '', icon: Home, label: 'Projects' },
  { to: 'ach', icon: Grid3X3, label: 'ACH Matrix' },
  { to: 'bias', icon: Brain, label: 'Bias Checklist' },
  { to: 'export', icon: Download, label: 'Export' },
];

export default function LangleyLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();

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
        {/* TOP SECRET Banner */}
        <style>{`
          .langley-stamp {
            position: absolute;
            font-family: Georgia, serif;
            font-size: 10px;
            color: rgba(201,168,76,0.15);
            text-transform: uppercase;
            letter-spacing: 4px;
            transform: rotate(-25deg);
            pointer-events: none;
            user-select: none;
          }
        `}</style>

        {/* Sidebar */}
        <aside
          className="w-64 flex-shrink-0 flex flex-col"
          style={{
            backgroundColor: THEME.surface,
            borderRight: `1px solid ${THEME.border}`,
          }}
        >
          {/* Agency seal area */}
          <div
            className="h-16 flex items-center gap-3 px-4"
            style={{ borderBottom: `1px solid ${THEME.border}` }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${THEME.accent}`,
                backgroundColor: 'rgba(201,168,76,0.1)',
              }}
            >
              <Shield size={20} style={{ color: THEME.accent }} />
            </div>
            <div>
              <h1
                className="text-sm font-bold tracking-wide"
                style={{ fontFamily: THEME.fontHeading, color: THEME.accent }}
              >
                INTEL WORKBENCH
              </h1>
              <p className="text-[10px] tracking-[3px] uppercase" style={{ color: THEME.textMuted }}>
                CLASSIFIED
              </p>
            </div>
          </div>

          {/* Classification banner */}
          <div
            className="px-4 py-1.5 text-center text-[10px] tracking-[4px] uppercase font-bold"
            style={{
              backgroundColor: 'rgba(201,168,76,0.15)',
              color: THEME.accent,
              borderBottom: `1px solid ${THEME.border}`,
            }}
          >
            TS // EYES ONLY
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const fullPath = `/v1/${item.to}`;
              const isActive =
                item.to === ''
                  ? location.pathname === '/v1' || location.pathname === '/v1/'
                  : location.pathname.startsWith(fullPath);

              return (
                <NavLink
                  key={item.to}
                  to={fullPath}
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: isActive ? THEME.accent : THEME.textMuted,
                    borderLeft: isActive ? `2px solid ${THEME.accent}` : '2px solid transparent',
                    fontFamily: THEME.fontHeading,
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3" style={{ borderTop: `1px solid ${THEME.border}` }}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs transition-colors hover:opacity-80"
              style={{ color: THEME.textMuted }}
            >
              <ArrowLeft size={14} />
              <span>Change Theme</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Decorative stamps */}
          <div className="langley-stamp" style={{ top: '20%', right: '10%' }}>
            TOP SECRET
          </div>
          <div className="langley-stamp" style={{ bottom: '30%', left: '5%' }}>
            NOFORN
          </div>

          {/* Top bar */}
          <header
            className="h-14 flex items-center justify-between px-6 flex-shrink-0"
            style={{
              backgroundColor: 'rgba(15,29,51,0.8)',
              backdropFilter: 'blur(8px)',
              borderBottom: `1px solid ${THEME.border}`,
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: THEME.textMuted, fontFamily: THEME.fontHeading }}>
                Intelligence Analysis Workbench
              </span>
              {activeProject && (
                <>
                  <ChevronRight size={14} style={{ color: THEME.textMuted }} />
                  <span style={{ color: THEME.accent, fontFamily: THEME.fontHeading, fontWeight: 600 }}>
                    {activeProject.name}
                  </span>
                </>
              )}
            </div>
            <div
              className="text-[10px] tracking-[2px] uppercase px-3 py-1 rounded"
              style={{
                backgroundColor: 'rgba(201,168,76,0.1)',
                color: THEME.accent,
                border: `1px solid ${THEME.border}`,
              }}
            >
              DOCUMENT CLASSIFICATION: TOP SECRET
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
