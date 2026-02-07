import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Brain,
  Diamond,
  Download,
  Shield,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useBasePath } from '../../utils/useBasePath';
import { GuidedTour, TakeTourButton } from '../GuidedTour';

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
      to: '#',
      icon: <Diamond size={18} />,
      label: 'Diamond Model',
      disabled: true,
      badge: 'Phase 3',
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
    <div className="flex h-screen overflow-hidden">
      {/* Guided tour (auto-starts on first visit) */}
      <GuidedTour />

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface-800 border-r border-slate-700/50 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-700/50">
          <Shield size={22} className="text-accent-500" />
          <div>
            <h1 className="text-sm font-semibold text-slate-100 tracking-tight">
              Intel Workbench
            </h1>
            <p className="text-xxs text-slate-500 font-mono">
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
                    <span className="ml-auto text-xxs px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-500 font-mono">
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
        <div className="px-4 py-3 border-t border-slate-700/50" data-tour="variant-picker">
          <p className="text-xxs text-slate-600 font-mono">
            v2.0.0 — Phase 2
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-700/50 bg-surface-800/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Intel Workbench</span>
            {activeProject && (
              <>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="text-slate-200 font-medium">
                  {activeProject.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <TakeTourButton />
            {activeProject && (
              <span className="text-xxs font-mono text-slate-500">
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
