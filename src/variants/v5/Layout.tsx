import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Brain,
  Download,
  Zap,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { HomePage } from '../../pages/HomePage';
import { ACHPage } from '../../pages/ACHPage';
import { BiasPage } from '../../pages/BiasPage';
import { ExportPage } from '../../pages/ExportPage';

const THEME: ThemeColors = {
  bg: '#0d0d0d',
  surface: '#141414',
  accent: '#06b6d4',
  accentSecondary: '#d946ef',
  text: '#e0e0e0',
  textMuted: '#666666',
  border: 'rgba(6,182,212,0.15)',
  fontHeading: 'Orbitron, "Share Tech", sans-serif',
  fontBody: '"Share Tech Mono", "JetBrains Mono", monospace',
  variantName: 'cyber-noir',
};

const navItems = [
  { to: '', icon: Home, label: 'NEXUS' },
  { to: 'ach', icon: Grid3X3, label: 'ACH//GRID' },
  { to: 'bias', icon: Brain, label: 'BIAS//SCAN' },
  { to: 'export', icon: Download, label: 'EXTRACT' },
];

export default function CyberNoirLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={THEME}>
      <div
        className="flex h-screen overflow-hidden relative"
        style={{
          backgroundColor: THEME.bg,
          color: THEME.text,
          fontFamily: THEME.fontBody,
        }}
      >
        <style>{`
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .cyber-grid-bg {
            background-image:
              linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px);
            background-size: 30px 30px;
          }
          .cyber-glow-border {
            box-shadow:
              0 0 15px rgba(6,182,212,0.1),
              inset 0 0 15px rgba(6,182,212,0.05);
          }
          .cyber-gradient-text {
            background: linear-gradient(135deg, #06b6d4, #d946ef);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .cyber-nav-active {
            background: rgba(6,182,212,0.1);
            border: 1px solid rgba(6,182,212,0.3);
            box-shadow: 0 0 10px rgba(6,182,212,0.15);
          }
          .cyber-nav-item:hover {
            background: rgba(6,182,212,0.05);
            border-color: rgba(6,182,212,0.2);
          }
        `}</style>

        {/* Floating sidebar with glass-morphism */}
        <aside
          className="w-64 flex-shrink-0 flex flex-col m-3 rounded-2xl overflow-hidden cyber-glow-border"
          style={{
            backgroundColor: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(6,182,212,0.15)`,
          }}
        >
          {/* Logo */}
          <div
            className="h-16 flex items-center gap-3 px-4"
            style={{ borderBottom: `1px solid rgba(6,182,212,0.1)` }}
          >
            <div className="relative">
              <Zap size={22} style={{ color: THEME.accent }} />
              <div
                className="absolute inset-0 blur-md"
                style={{
                  background: `radial-gradient(circle, ${THEME.accent}40 0%, transparent 70%)`,
                }}
              />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[3px] uppercase cyber-gradient-text">
                CYBER NOIR
              </h1>
              <p className="text-[9px] tracking-[1px]" style={{ color: THEME.textMuted }}>
                Intelligence Analysis // v2.0
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const fullPath = `/v5/${item.to}`;
              const isActive =
                item.to === ''
                  ? location.pathname === '/v5' || location.pathname === '/v5/'
                  : location.pathname.startsWith(fullPath);

              return (
                <NavLink
                  key={item.to}
                  to={fullPath}
                  className={`cyber-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive ? 'cyber-nav-active' : ''
                  }`}
                  style={{
                    color: isActive ? THEME.accent : THEME.textMuted,
                    border: isActive ? undefined : '1px solid transparent',
                    letterSpacing: '1px',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: THEME.accent,
                        boxShadow: `0 0 6px ${THEME.accent}`,
                        animation: 'glow-pulse 2s ease-in-out infinite',
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3" style={{ borderTop: `1px solid rgba(6,182,212,0.1)` }}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs transition-all duration-200 hover:opacity-80"
              style={{ color: THEME.textMuted }}
            >
              <ArrowLeft size={14} />
              <span>DISCONNECT</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden cyber-grid-bg">
          {/* Top bar */}
          <header
            className="h-12 flex items-center justify-between px-6 flex-shrink-0 m-3 mb-0 rounded-xl"
            style={{
              backgroundColor: 'rgba(20,20,20,0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(6,182,212,0.1)`,
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: THEME.textMuted }}>
                INTEL//WORKBENCH
              </span>
              {activeProject && (
                <>
                  <ChevronRight size={14} style={{ color: THEME.textMuted }} />
                  <span className="cyber-gradient-text font-semibold">
                    {activeProject.name}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: THEME.accent,
                  boxShadow: `0 0 8px ${THEME.accent}`,
                  animation: 'glow-pulse 2s ease-in-out infinite',
                }}
              />
              <span className="text-[10px]" style={{ color: THEME.textMuted }}>
                CONNECTED
              </span>
            </div>
          </header>

          {/* Gradient accent line */}
          <div
            className="h-px mx-3"
            style={{
              background: `linear-gradient(90deg, transparent, ${THEME.accent}, ${THEME.accentSecondary}, transparent)`,
              opacity: 0.3,
            }}
          />

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
