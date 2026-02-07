import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ThemeProvider, DEFAULT_THEME } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { ACHPage } from './pages/ACHPage';
import { BiasPage } from './pages/BiasPage';
import { ExportPage } from './pages/ExportPage';
import { VariantPicker } from './pages/VariantPicker';

// Lazy-load variant layouts for code splitting
const V1Layout = lazy(() => import('./variants/v1/Layout'));
const V2Layout = lazy(() => import('./variants/v2/Layout'));
const V3Layout = lazy(() => import('./variants/v3/Layout'));
const V4Layout = lazy(() => import('./variants/v4/Layout'));
const V5Layout = lazy(() => import('./variants/v5/Layout'));

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
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
}

export default App;
