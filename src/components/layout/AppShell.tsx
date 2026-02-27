import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Brain,
  Crosshair,
  Diamond,
  Download,
  Shield,
  ChevronRight,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useBasePath } from '../../utils/useBasePath';
import { GuidedTour, TakeTourButton } from '../GuidedTour';
import { useThemeMode } from '../../contexts/ThemeContext';

interface AppShellProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  badge?: string;
  tourId?: string;
}

export function AppShell({ children }: AppShellProps) {
  const activeProject = useProjectStore((s) => s.getActiveProject());
  const location = useLocation();
  const basePath = useBasePath();
  const { mode, toggleMode } = useThemeMode();

  const navItems: NavItem[] = [
    {
      to: `${basePath}/`,
      icon: <Home size={18} />,
      label: 'Projects',
    },
    {
      to: `${basePath}/ach`,
      icon: <Grid3X3 size={18} />,
      label: 'ACH Matrix',
    },
    {
      to: `${basePath}/bias`,
      icon: <Brain size={18} />,
      label: 'Bias Checklist',
      tourId: 'bias-nav',
    },
    {
      to: `${basePath}/ioc`,
      icon: <Crosshair size={18} />,
      label: 'IOC Extractor',
    },
    {
      to: `${basePath}/diamond`,
      icon: <Diamond size={18} />,
      label: 'Diamond Model',
    },
    {
      to: `${basePath}/export`,
      icon: <Download size={18} />,
      label: 'Export',
      tourId: 'export-nav',
    },
    {
      to: `${basePath}/docs`,
      icon: <BookOpen size={18} />,
      label: 'Docs',
      tourId: 'docs-nav',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-200">
      {/* Guided tour (auto-starts on first visit) */}
      <GuidedTour />

      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{
          backgroundColor: 'var(--iw-surface)',
          borderRight: '1px solid var(--iw-border)',
        }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center gap-3 px-4"
          style={{ borderBottom: '1px solid var(--iw-border)' }}
        >
          <Shield size={22} style={{ color: 'var(--iw-accent)' }} />
          <div>
            <h1
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'var(--iw-text)' }}
            >
              Intel Workbench
            </h1>
            <p
              className="text-xxs font-mono"
              style={{ color: 'var(--iw-text-muted)' }}
            >
              Structured Analysis
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                <div key={item.label} className="sidebar-link-disabled">
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="ml-auto text-xxs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--iw-text-muted) 20%, var(--iw-bg))',
                        color: 'var(--iw-text-muted)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            const isHome = item.to === `${basePath}/`;
            const isActive = isHome
              ? location.pathname === `${basePath}` || location.pathname === `${basePath}/`
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
                {...(item.tourId ? { 'data-tour': item.tourId } : {})}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-3"
          style={{ borderTop: '1px solid var(--iw-border)' }}
        >
          <p
            className="text-xxs font-mono"
            style={{ color: 'var(--iw-text-muted)' }}
          >
            v3.0.0 - Phase 3
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 backdrop-blur-sm flex-shrink-0"
          style={{
            backgroundColor: 'var(--iw-surface)',
            borderBottom: '1px solid var(--iw-border)',
          }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--iw-text-muted)' }}>Intel Workbench</span>
            {activeProject && (
              <>
                <ChevronRight size={14} style={{ color: 'var(--iw-text-muted)' }} />
                <span
                  className="font-medium"
                  style={{ color: 'var(--iw-text)' }}
                >
                  {activeProject.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMode}
              className="p-1.5 rounded-lg transition-colors duration-200 hover:opacity-80"
              style={{ color: 'var(--iw-text-muted)' }}
              title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <TakeTourButton />
            {activeProject && (
              <span
                className="text-xxs font-mono"
                style={{ color: 'var(--iw-text-muted)' }}
              >
                {activeProject.achMatrices.length} matrices •{' '}
                {activeProject.biasChecklists.length} checklists
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
