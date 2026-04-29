import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Diamond, Fingerprint } from 'lucide-react';
import { ThemeProvider, type ThemeColors } from '../../contexts/ThemeContext';
import { useProjectStore } from '../../store/useProjectStore';
import { GuidedTour, TakeTourButton } from '../../components/GuidedTour';
import { APP_ROUTES, getNavRoutes } from '../../routes';
import { themeVariableStyle } from '../variantStyle';

const THEME: ThemeColors = {
  bg: '#050505',
  surface: '#111111',
  accent: '#d7ff2f',
  accentSecondary: '#f3f0e8',
  text: '#f3f0e8',
  textMuted: '#8a877f',
  border: 'rgba(243,240,232,0.18)',
  fontHeading: '"Archivo Black", Impact, sans-serif',
  fontBody: 'Sora, "IBM Plex Sans Condensed", sans-serif',
  variantName: 'blacksite-minimal',
};

export default function BlacksiteMinimalLayout() {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavRoutes('v8', '/v8');

  return (
    <ThemeProvider theme={THEME}>
      <div className="blacksite-minimal h-screen overflow-hidden" style={themeVariableStyle(THEME)}>
        <GuidedTour />
        <style>{`
          .blacksite-minimal {
            background:
              linear-gradient(90deg, rgba(243,240,232,0.055) 1px, transparent 1px),
              linear-gradient(rgba(243,240,232,0.045) 1px, transparent 1px),
              ${THEME.bg};
            background-size: 72px 72px;
          }
          .blacksite-minimal .card {
            background: #111111 !important;
            border: 1px solid rgba(243,240,232,0.22) !important;
            border-radius: 0 !important;
            box-shadow: 12px 12px 0 rgba(215,255,47,0.08) !important;
          }
          .blacksite-minimal .input-field {
            background: #050505 !important;
            border-color: rgba(243,240,232,0.24) !important;
            border-radius: 0 !important;
            color: ${THEME.text} !important;
          }
          .blacksite-minimal .btn-primary {
            background: ${THEME.accent} !important;
            color: #050505 !important;
            border-radius: 0 !important;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .blacksite-minimal .btn-secondary {
            background: #050505 !important;
            color: ${THEME.text} !important;
            border-color: rgba(243,240,232,0.24) !important;
            border-radius: 0 !important;
          }
          .blacksite-minimal .btn-ghost {
            color: ${THEME.textMuted} !important;
          }
          .blacksite-cut {
            clip-path: polygon(0 0, 100% 0, calc(100% - 26px) 100%, 0 100%);
          }
        `}</style>

        <div className="grid h-full grid-rows-[auto_1fr]">
          <header className="border-b" style={{ borderColor: THEME.border }}>
            <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[420px_1fr_auto]">
              <div className="blacksite-cut px-6 py-5" style={{ background: THEME.accent, color: '#050505' }}>
                <div className="flex items-center gap-3">
                  <Diamond size={26} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.34em]">Variant v8</p>
                    <h1 className="text-3xl uppercase leading-none" style={{ fontFamily: THEME.fontHeading }}>
                      Blacksite
                    </h1>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center px-8 gap-5">
                <p className="max-w-2xl text-sm leading-relaxed" style={{ color: THEME.textMuted }}>
                  A brutalist, high-contrast workbench for analysts who want the interface to get out of the way and hit hard when evidence changes direction.
                </p>
                {activeProject && (
                  <span className="ml-auto border px-4 py-2 text-xs uppercase tracking-[0.18em]" style={{ borderColor: THEME.border, color: THEME.text }}>
                    {activeProject.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 px-4">
                <TakeTourButton />
                <button
                  onClick={() => navigate('/')}
                  className="border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:-translate-y-0.5"
                  style={{ borderColor: THEME.border, color: THEME.text }}
                  data-tour="variant-picker"
                >
                  <ArrowLeft size={14} className="inline mr-2" />
                  Variants
                </button>
              </div>
            </div>

            <nav className="flex gap-px overflow-x-auto" style={{ background: THEME.border }}>
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  item.id === 'home'
                    ? location.pathname === '/v8' || location.pathname === '/v8/'
                    : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    className="min-w-[150px] flex items-center gap-3 px-5 py-4 text-xs uppercase tracking-[0.16em] transition"
                    style={{
                      background: isActive ? THEME.accent : THEME.surface,
                      color: isActive ? THEME.bg : THEME.textMuted,
                      fontWeight: 900,
                    }}
                    {...(item.tourId
                      ? { 'data-tour': item.tourId }
                      : item.id === 'ioc'
                        ? { 'data-tour': 'ioc-nav' }
                        : item.id === 'diamond'
                          ? { 'data-tour': 'diamond-nav' }
                          : {})}
                  >
                    <span className="tabular-nums">{index + 1}</span>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </header>

          <div className="min-h-0 grid lg:grid-cols-[1fr_280px]">
            <main className="overflow-y-auto p-5 lg:p-8">
              <Routes>
                {APP_ROUTES.map((route) => (
                  <Route key={route.id} index={route.index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </main>

            <aside className="hidden lg:flex flex-col border-l" style={{ borderColor: THEME.border, background: 'rgba(17,17,17,0.78)' }}>
              <div className="p-5 border-b" style={{ borderColor: THEME.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint size={22} style={{ color: THEME.accent }} />
                  <span className="text-xs uppercase tracking-[0.24em]" style={{ color: THEME.textMuted }}>Control strip</span>
                </div>
                <p className="text-5xl leading-none" style={{ fontFamily: THEME.fontHeading, color: THEME.text }}>
                  ACH
                </p>
                <p className="mt-2 text-sm" style={{ color: THEME.textMuted }}>
                  Hypotheses first. Bias visible. Evidence scored.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: THEME.border }}>
                {['Offline', 'Local', 'JSON', 'MITRE'].map((label) => (
                  <div key={label} className="p-4" style={{ background: THEME.surface }}>
                    <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: THEME.textMuted }}>{label}</p>
                    <p className="mt-2 h-2 w-10" style={{ background: THEME.accent }} />
                  </div>
                ))}
              </div>
              <div className="mt-auto p-5 border-t" style={{ borderColor: THEME.border }}>
                <p className="text-[10px] uppercase tracking-[0.24em] mb-2" style={{ color: THEME.textMuted }}>Design note</p>
                <p className="text-sm leading-relaxed" style={{ color: THEME.text }}>
                  Monochrome, rectangular, and intentionally severe. This one says serious tool, not dashboard toy.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
