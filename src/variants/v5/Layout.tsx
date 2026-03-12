import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, ChevronRight } from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { GuidedTour, TakeTourButton } from '../../components/GuidedTour';
import { APP_ROUTES, getNavRoutes } from '../../routes';

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

export default function CyberNoirLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavRoutes('v5', '/v5');

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
        <GuidedTour />

        <style>{`
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
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

        <aside
          className="w-64 flex-shrink-0 flex flex-col m-3 rounded-2xl overflow-hidden cyber-glow-border"
          style={{
            backgroundColor: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(6,182,212,0.15)`,
          }}
        >
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

          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === 'home'
                  ? location.pathname === '/v5' || location.pathname === '/v5/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={`cyber-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive ? 'cyber-nav-active' : ''
                  }`}
                  style={{
                    color: isActive ? THEME.accent : THEME.textMuted,
                    border: isActive ? undefined : '1px solid transparent',
                    letterSpacing: '1px',
                  }}
                  {...(item.tourId
                    ? { 'data-tour': item.tourId }
                    : item.id === 'ioc'
                      ? { 'data-tour': 'ioc-nav' }
                      : item.id === 'diamond'
                        ? { 'data-tour': 'diamond-nav' }
                        : {})}
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

          <div className="px-4 py-3" style={{ borderTop: `1px solid rgba(6,182,212,0.1)` }} data-tour="variant-picker">
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

        <div className="flex-1 flex flex-col overflow-hidden cyber-grid-bg">
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
              <TakeTourButton />
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

          <div
            className="h-px mx-3"
            style={{
              background: `linear-gradient(90deg, transparent, ${THEME.accent}, ${THEME.accentSecondary}, transparent)`,
              opacity: 0.3,
            }}
          />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              {APP_ROUTES.map((route) => (
                <Route key={route.id} index={route.index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
