import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ThemeProvider, DEFAULT_THEME } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { ACHPage } from './pages/ACHPage';
import { BiasPage } from './pages/BiasPage';
import { ExportPage } from './pages/ExportPage';
import { DocsPage } from './pages/DocsPage';
import { VariantPicker } from './pages/VariantPicker';
import KeyboardHints from './components/KeyboardHints';
import VariantSettings from './components/VariantSettings';
import { useDefaultVariant } from './hooks/useDefaultVariant';

// Lazy-load variant layouts for code splitting
const V1Layout = lazy(() => import('./variants/v1/Layout'));
const V2Layout = lazy(() => import('./variants/v2/Layout'));
const V3Layout = lazy(() => import('./variants/v3/Layout'));
const V4Layout = lazy(() => import('./variants/v4/Layout'));
const V5Layout = lazy(() => import('./variants/v5/Layout'));

const APP_ID = 'intel-workbench';
const VARIANT_NAMES = [
  'Dark Ops',
  'Blueprint',
  'Field Notes',
  'Cyber Terminal',
  'Cyber Noir',
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-surface-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-mono">Loading variant...</p>
      </div>
    </div>
  );
}

function DefaultLayout() {
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <AppShell>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="ach" element={<ACHPage />} />
          <Route path="ach/:matrixId" element={<ACHPage />} />
          <Route path="bias" element={<BiasPage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="docs" element={<DocsPage />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}

function VariantKeyboardNav() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement ||
          (e.target instanceof HTMLElement && e.target.isContentEditable)) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) navigate(`/v${num}`);
      else if (e.key === 'Escape' || e.key === '0') navigate('/');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);
  return null;
}

function DefaultVariantRedirect({ defaultVariant }: { defaultVariant: number | null }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && defaultVariant) {
      navigate(`/v${defaultVariant}`, { replace: true });
    }
  }, [location.pathname, defaultVariant, navigate]);

  return null;
}

function GitHubFooter() {
  return (
    <a
      href="https://github.com/solomonneas/intel-workbench"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: 8, right: 12, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: '#888', textDecoration: 'none',
        opacity: 0.4, transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
    >
      <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      Solomon Neas
    </a>
  );
}

function App() {
  const location = useLocation();
  const { defaultVariant, setDefaultVariant } = useDefaultVariant(APP_ID);
  const variantMatch = location.pathname.match(/^\/v([1-5])/);
  const currentVariant = variantMatch ? parseInt(variantMatch[1], 10) : null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VariantKeyboardNav />
      <DefaultVariantRedirect defaultVariant={defaultVariant} />
      <KeyboardHints />
      <VariantSettings
        currentVariant={currentVariant}
        defaultVariant={defaultVariant}
        onSetDefault={setDefaultVariant}
        variantNames={VARIANT_NAMES}
      />
      <Routes>
        {/* Variant picker landing */}
        <Route path="/" element={<VariantPicker />} />

        {/* Default layout (original Phase 1) */}
        <Route path="/default/*" element={<DefaultLayout />} />

        {/* Themed variants */}
        <Route path="/v1/*" element={<V1Layout />} />
        <Route path="/v2/*" element={<V2Layout />} />
        <Route path="/v3/*" element={<V3Layout />} />
        <Route path="/v4/*" element={<V4Layout />} />
        <Route path="/v5/*" element={<V5Layout />} />
      </Routes>
      <GitHubFooter />
    </Suspense>
  );
}

export default App;
