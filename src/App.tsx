import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ACHPage } from './pages/ACHPage';
import { ExportPage } from './pages/ExportPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ach" element={<ACHPage />} />
        <Route path="/ach/:matrixId" element={<ACHPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
