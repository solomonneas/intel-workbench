import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, CircleDot } from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { GuidedTour, TakeTourButton } from '../../components/GuidedTour';
import { APP_ROUTES, getNavRoutes } from '../../routes';
import { themeVariableStyle } from '../variantStyle';

const THEME: ThemeColors = {
  bg: '#f2eadb',
  surface: '#fbf6eb',
  accent: '#9f2d20',
  accentSecondary: '#24406f',
  text: '#211b16',
  textMuted: '#756a5d',
  border: 'rgba(62,48,35,0.18)',
  fontHeading: 'Fraunces, "Playfair Display", Georgia, serif',
  fontBody: '"Source Serif 4", Georgia, serif',
  variantName: 'casefile-atlas',
};

export default function CasefileAtlasLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavRoutes('v6', '/v6');

  return (
    <ThemeProvider theme={THEME}>
      <div className="casefile-atlas min-h-screen overflow-hidden" style={themeVariableStyle(THEME)}>
        <GuidedTour />
        <style>{`
          .casefile-atlas {
            background:
              radial-gradient(circle at 18% 18%, rgba(159,45,32,0.12), transparent 26rem),
              linear-gradient(90deg, rgba(36,64,111,0.06) 1px, transparent 1px),
              linear-gradient(rgba(36,64,111,0.05) 1px, transparent 1px),
              ${THEME.bg};
            background-size: auto, 44px 44px, 44px 44px, auto;
          }
          .casefile-atlas .card {
            background: rgba(251,246,235,0.92) !important;
            border: 1px solid ${THEME.border} !important;
            box-shadow: 0 22px 50px rgba(69,52,33,0.12), inset 0 1px rgba(255,255,255,0.55) !important;
          }
          .casefile-atlas .input-field {
            background: #fffaf0 !important;
            border-color: rgba(62,48,35,0.24) !important;
            color: ${THEME.text} !important;
          }
          .casefile-atlas .btn-primary {
            background: ${THEME.accent} !important;
            color: #fff7ed !important;
            box-shadow: 0 10px 22px rgba(159,45,32,0.22);
          }
          .casefile-atlas .btn-secondary {
            background: #fffaf0 !important;
            color: ${THEME.text} !important;
            border-color: rgba(62,48,35,0.24) !important;
          }
          .casefile-atlas .btn-ghost {
            color: ${THEME.textMuted} !important;
          }
          .casefile-thread {
            background-image: linear-gradient(135deg, transparent 0 47%, rgba(159,45,32,0.38) 48% 52%, transparent 53% 100%);
          }
        `}</style>

        <div className="flex h-screen p-4 gap-4">
          <aside
            className="w-72 shrink-0 rounded-[2rem] overflow-hidden flex flex-col relative"
            style={{
              background: 'rgba(251,246,235,0.86)',
              border: `1px solid ${THEME.border}`,
              boxShadow: '0 28px 80px rgba(69,52,33,0.18)',
            }}
          >
            <div className="casefile-thread absolute inset-x-0 top-28 h-24 opacity-60 pointer-events-none" />
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center rotate-[-4deg]"
                  style={{ background: THEME.accent, color: '#fff7ed' }}
                >
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: THEME.textMuted }}>
                    Evidence Atlas
                  </p>
                  <h1 className="text-2xl leading-none" style={{ fontFamily: THEME.fontHeading }}>
                    Casefile
                  </h1>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed" style={{ color: THEME.textMuted }}>
                A tactile analyst desk for ACH, bias checks, IOCs, and Diamond Model work.
              </p>
            </div>

            <nav className="px-4 py-3 space-y-2 overflow-y-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  item.id === 'home'
                    ? location.pathname === '/v6' || location.pathname === '/v6/'
                    : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(159,45,32,0.1)' : 'rgba(255,250,240,0.52)',
                      color: isActive ? THEME.accent : THEME.text,
                      border: `1px solid ${isActive ? 'rgba(159,45,32,0.26)' : 'rgba(62,48,35,0.12)'}`,
                      transform: isActive ? 'translateX(6px)' : undefined,
                    }}
                    {...(item.tourId
                      ? { 'data-tour': item.tourId }
                      : item.id === 'ioc'
                        ? { 'data-tour': 'ioc-nav' }
                        : item.id === 'diamond'
                          ? { 'data-tour': 'diamond-nav' }
                          : {})}
                  >
                    <span className="text-xs tabular-nums" style={{ color: THEME.textMuted }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon size={17} />
                    <span className="font-semibold">{item.label}</span>
                    {isActive && <CircleDot size={14} className="ml-auto" />}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto p-4 space-y-3" data-tour="variant-picker">
              {activeProject && (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(36,64,111,0.08)', color: THEME.text }}>
                  <p className="text-[10px] uppercase tracking-[0.24em] mb-1" style={{ color: THEME.textMuted }}>
                    Active Dossier
                  </p>
                  <p className="text-sm font-semibold">{activeProject.name}</p>
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition hover:translate-x-1"
                style={{ background: '#211b16', color: '#fff7ed' }}
              >
                <span>Back to variants</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </aside>

          <section className="flex-1 min-w-0 overflow-hidden rounded-[2rem]" style={{ border: `1px solid ${THEME.border}`, background: 'rgba(251,246,235,0.58)' }}>
            <header className="h-20 px-8 flex items-center justify-between" style={{ borderBottom: `1px solid ${THEME.border}` }}>
              <div className="flex items-center gap-3 text-sm" style={{ color: THEME.textMuted }}>
                <span>Casefile Atlas</span>
                {activeProject && (
                  <>
                    <ChevronRight size={15} />
                    <span className="font-semibold" style={{ color: THEME.text }}>{activeProject.name}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <TakeTourButton />
                <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]" style={{ background: 'rgba(159,45,32,0.1)', color: THEME.accent }}>
                  Source Review
                </span>
              </div>
            </header>
            <main className="h-[calc(100vh-7rem)] overflow-y-auto p-8">
              <Routes>
                {APP_ROUTES.map((route) => (
                  <Route key={route.id} index={route.index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </main>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
