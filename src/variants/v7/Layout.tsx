import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Signal, TimerReset } from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { GuidedTour, TakeTourButton } from '../../components/GuidedTour';
import { APP_ROUTES, getNavRoutes } from '../../routes';
import { themeVariableStyle } from '../variantStyle';

const THEME: ThemeColors = {
  bg: '#071013',
  surface: '#0d1b21',
  accent: '#2ee9b6',
  accentSecondary: '#f8b84e',
  text: '#e6f4ef',
  textMuted: '#78a49a',
  border: 'rgba(46,233,182,0.18)',
  fontHeading: '"IBM Plex Sans Condensed", Oswald, sans-serif',
  fontBody: 'Sora, "IBM Plex Sans Condensed", sans-serif',
  variantName: 'ops-floor',
};

function clockLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function OpsFloorLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavRoutes('v7', '/v7');
  const [time, setTime] = useState(new Date());
  const incident = useMemo(() => `IW-${Math.floor(1000 + Math.random() * 8999)}`, []);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={THEME}>
      <div className="ops-floor flex h-screen overflow-hidden" style={themeVariableStyle(THEME)}>
        <GuidedTour />
        <style>{`
          .ops-floor {
            background:
              radial-gradient(circle at 76% 18%, rgba(46,233,182,0.15), transparent 22rem),
              radial-gradient(circle at 12% 84%, rgba(248,184,78,0.12), transparent 18rem),
              linear-gradient(120deg, rgba(255,255,255,0.03) 0 12%, transparent 12% 100%),
              ${THEME.bg};
          }
          .ops-floor .card {
            background: rgba(13,27,33,0.86) !important;
            border: 1px solid ${THEME.border} !important;
            box-shadow: 0 24px 70px rgba(0,0,0,0.34) !important;
          }
          .ops-floor .input-field {
            background: rgba(7,16,19,0.88) !important;
            border-color: ${THEME.border} !important;
            color: ${THEME.text} !important;
          }
          .ops-floor .btn-primary {
            background: linear-gradient(135deg, ${THEME.accent}, #169f82) !important;
            color: #04100d !important;
            font-weight: 800;
          }
          .ops-floor .btn-secondary {
            background: rgba(255,255,255,0.05) !important;
            border-color: ${THEME.border} !important;
            color: ${THEME.text} !important;
          }
          .ops-floor .btn-ghost {
            color: ${THEME.textMuted} !important;
          }
          .ops-grid {
            background-image:
              linear-gradient(rgba(46,233,182,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(46,233,182,0.06) 1px, transparent 1px);
            background-size: 52px 52px;
          }
        `}</style>

        <aside className="w-20 shrink-0 p-3 flex flex-col items-center gap-3" style={{ borderRight: `1px solid ${THEME.border}` }}>
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: THEME.accent, color: '#04100d' }}>
            <Radio size={25} />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 pt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === 'home'
                  ? location.pathname === '/v7' || location.pathname === '/v7/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  title={item.label}
                  className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(46,233,182,0.16)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? THEME.accent : THEME.textMuted,
                    border: `1px solid ${isActive ? 'rgba(46,233,182,0.44)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? '0 0 24px rgba(46,233,182,0.16)' : undefined,
                  }}
                  {...(item.tourId
                    ? { 'data-tour': item.tourId }
                    : item.id === 'ioc'
                      ? { 'data-tour': 'ioc-nav' }
                      : item.id === 'diamond'
                        ? { 'data-tour': 'diamond-nav' }
                        : {})}
                >
                  <Icon size={19} />
                </NavLink>
              );
            })}
          </div>
          <button
            onClick={() => navigate('/')}
            className="h-12 w-12 rounded-2xl flex items-center justify-center transition hover:scale-105"
            style={{ background: 'rgba(248,184,78,0.1)', color: THEME.accentSecondary, border: '1px solid rgba(248,184,78,0.22)' }}
            title="Back to variants"
            data-tour="variant-picker"
          >
            <ArrowLeft size={18} />
          </button>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 ops-grid">
          <header className="min-h-24 px-6 py-4 flex items-center justify-between gap-6" style={{ borderBottom: `1px solid ${THEME.border}`, background: 'rgba(7,16,19,0.72)' }}>
            <div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]" style={{ color: THEME.textMuted }}>
                <Signal size={14} style={{ color: THEME.accent }} />
                <span>Operations Floor</span>
                <span style={{ color: THEME.accentSecondary }}>Live analytic cell</span>
              </div>
              <h1 className="text-4xl uppercase tracking-tight mt-1" style={{ fontFamily: THEME.fontHeading, color: THEME.text }}>
                Intel Workbench
              </h1>
            </div>

            <div className="hidden lg:grid grid-cols-3 gap-3 min-w-[470px]">
              <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}` }}>
                <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: THEME.textMuted }}>Case</p>
                <p className="text-lg font-bold" style={{ color: THEME.accent }}>{incident}</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}` }}>
                <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: THEME.textMuted }}>Clock</p>
                <p className="text-lg font-bold tabular-nums">{clockLabel(time)}</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: 'rgba(248,184,78,0.08)', border: '1px solid rgba(248,184,78,0.22)' }}>
                <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: THEME.textMuted }}>Status</p>
                <p className="text-lg font-bold" style={{ color: THEME.accentSecondary }}>Active</p>
              </div>
            </div>
          </header>

          <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto" style={{ borderBottom: `1px solid ${THEME.border}`, background: 'rgba(13,27,33,0.52)' }}>
            {navItems.map((item) => {
              const isActive =
                item.id === 'home'
                  ? location.pathname === '/v7' || location.pathname === '/v7/'
                  : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition"
                  style={{
                    background: isActive ? THEME.accent : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#04100d' : THEME.textMuted,
                    border: `1px solid ${isActive ? THEME.accent : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <div className="ml-auto flex items-center gap-3 pl-6">
              <TakeTourButton />
              {activeProject && (
                <span className="text-xs whitespace-nowrap" style={{ color: THEME.textMuted }}>
                  <TimerReset size={14} className="inline mr-1" />
                  {activeProject.name}
                </span>
              )}
            </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
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
