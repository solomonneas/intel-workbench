import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ThemeProvider, ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { ACHPage } from './pages/ACHPage';
import { BiasPage } from './pages/BiasPage';
import { ExportPage } from './pages/ExportPage';
import { DocsPage } from './pages/DocsPage';

// Lazy-load variant layouts for code splitting
const V1Layout = lazy(() => import('./variants/v1/Layout'));
const V2Layout = lazy(() => import('./variants/v2/Layout'));
const V3Layout = lazy(() => import('./variants/v3/Layout'));
const V4Layout = lazy(() => import('./variants/v4/Layout'));
const V5Layout = lazy(() => import('./variants/v5/Layout'));

function LoadingFallback() {
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: 'var(--iw-bg)' }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor: 'var(--iw-accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-mono" style={{ color: 'var(--iw-text-muted)' }}>
          Loading variant...
        </p>
      </div>
    </div>
  );
}

function DefaultLayoutContent() {
  const { theme } = useThemeMode();
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="ach" element={<ACHPage />} />
          <Route path="ach/:matrixId" element={<ACHPage />} />
          <Route path="bias" element={<BiasPage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}

function DefaultLayout() {
  return (
    <ThemeModeProvider>
      <DefaultLayoutContent />
    </ThemeModeProvider>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Themed variants */}
        <Route path="/v1/*" element={<V1Layout />} />
        <Route path="/v2/*" element={<V2Layout />} />
        <Route path="/v3/*" element={<V3Layout />} />
        <Route path="/v4/*" element={<V4Layout />} />
        <Route path="/v5/*" element={<V5Layout />} />

        {/* Default layout at root */}
        <Route path="/*" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  );
}

export default App;
