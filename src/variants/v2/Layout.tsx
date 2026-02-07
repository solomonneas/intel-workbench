import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, Brain, Download, ArrowLeft, BookOpen } from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { HomePage } from '../../pages/HomePage';
import { ACHPage } from '../../pages/ACHPage';
import { BiasPage } from '../../pages/BiasPage';
import { ExportPage } from '../../pages/ExportPage';
import { DocsPage } from '../../pages/DocsPage';
import { GuidedTour, TakeTourButton } from '../../components/GuidedTour';

const THEME: ThemeColors = {
  bg: '#000000',
  surface: '#0a0a0a',
  accent: '#00ff41',
  text: '#00ff41',
  textMuted: '#00aa2a',
  border: 'rgba(0,255,65,0.15)',
  fontHeading: '"JetBrains Mono", "Fira Code", monospace',
  fontBody: '"JetBrains Mono", "Fira Code", monospace',
  variantName: 'terminal',
};

const navItems = [
  { to: '', icon: Home, label: 'projects' },
  { to: 'ach', icon: Grid3X3, label: 'ach_matrix' },
  { to: 'bias', icon: Brain, label: 'bias_check', tourId: 'bias-nav' },
  { to: 'export', icon: Download, label: 'export', tourId: 'export-nav' },
  { to: 'docs', icon: BookOpen, label: 'docs', tourId: 'docs-nav' },
];

export default function TerminalLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={THEME}>
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{
          backgroundColor: THEME.bg,
          color: THEME.text,
          fontFamily: THEME.fontBody,
        }}
      >
        {/* Guided tour */}
        <GuidedTour />

        <style>{`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .terminal-scanline {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(0,255,65,0.03);
            z-index: 50;
            pointer-events: none;
            animation: scanline 8s linear infinite;
          }
          .terminal-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 40;
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent 3px
            );
          }
          .terminal-cursor {
            display: inline-block;
            width: 8px;
            height: 14px;
            background: #00ff41;
            animation: blink 1s step-end infinite;
            margin-left: 4px;
            vertical-align: middle;
          }
          .terminal-tab-active {
            background: rgba(0,255,65,0.1);
            border-bottom: 2px solid #00ff41;
            color: #00ff41;
          }
          .terminal-tab-inactive {
            color: #00aa2a;
            border-bottom: 2px solid transparent;
          }
          .terminal-tab-inactive:hover {
            color: #00ff41;
            background: rgba(0,255,65,0.05);
          }
        `}</style>

        {/* Scanline effects */}
        <div className="terminal-scanline" />
        <div className="terminal-overlay" />

        {/* Top navigation bar */}
        <header
          className="flex items-center px-4 h-12 flex-shrink-0 z-30 relative"
          style={{
            backgroundColor: THEME.surface,
            borderBottom: `1px solid ${THEME.border}`,
          }}
        >
          {/* System prompt */}
          <div className="flex items-center gap-2 mr-6">
            <span className="text-xs" style={{ color: THEME.accent }}>
              root@intel-workbench:~$
            </span>
            <span className="terminal-cursor" />
          </div>

          {/* Tab nav */}
          <nav className="flex items-center gap-0">
            {navItems.map((item) => {
              const fullPath = `/v2/${item.to}`;
              const isActive =
                item.to === ''
                  ? location.pathname === '/v2' || location.pathname === '/v2/'
                  : location.pathname.startsWith(fullPath);

              return (
                <NavLink
                  key={item.to}
                  to={fullPath}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono transition-all duration-150 ${
                    isActive ? 'terminal-tab-active' : 'terminal-tab-inactive'
                  }`}
                  {...(item.tourId ? { 'data-tour': item.tourId } : {})}
                >
                  <span>&gt;_</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right side info */}
          <div className="ml-auto flex items-center gap-4">
            <TakeTourButton />
            {activeProject && (
              <span className="text-[10px]" style={{ color: THEME.textMuted }}>
                [{activeProject.name}]
              </span>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-[10px] transition-colors hover:opacity-80"
              style={{ color: THEME.textMuted }}
              data-tour="variant-picker"
            >
              <ArrowLeft size={12} />
              exit
            </button>
          </div>
        </header>

        {/* Status bar */}
        <div
          className="h-6 flex items-center px-4 text-[10px] z-30 relative"
          style={{
            backgroundColor: 'rgba(0,255,65,0.05)',
            borderBottom: `1px solid ${THEME.border}`,
            color: THEME.textMuted,
          }}
        >
          <span>SYS_STATUS: ONLINE</span>
          <span className="mx-3">|</span>
          <span>UPTIME: {Math.floor(Date.now() / 1000)}s</span>
          <span className="mx-3">|</span>
          <span>ENCRYPTION: AES-256-GCM</span>
          <span className="mx-3">|</span>
          <span>SESSION: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 z-30 relative">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="ach" element={<ACHPage />} />
            <Route path="ach/:matrixId" element={<ACHPage />} />
            <Route path="bias" element={<BiasPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="docs" element={<DocsPage />} />
          </Routes>
        </main>

        {/* Bottom status */}
        <footer
          className="h-6 flex items-center px-4 text-[10px] z-30 relative"
          style={{
            backgroundColor: THEME.surface,
            borderTop: `1px solid ${THEME.border}`,
            color: THEME.textMuted,
          }}
        >
          <span>TERMINAL v2.0</span>
          <span className="mx-3">|</span>
          <span>{"INTEL-WORKBENCH // OSINT TOOLKIT"}</span>
          <span className="ml-auto">{new Date().toISOString()}</span>
        </footer>
      </div>
    </ThemeProvider>
  );
}
