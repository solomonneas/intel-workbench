import type { ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Home, Grid3X3, Brain, Crosshair, Diamond, Download, BookOpen } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { ACHPage } from './pages/ACHPage';
import { BiasPage } from './pages/BiasPage';
import { IOCPage } from './pages/IOCPage';
import { DiamondPage } from './pages/DiamondPage';
import { ExportPage } from './pages/ExportPage';
import { DocsPage } from './pages/DocsPage';

export type RouteLabelVariant = 'default' | 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8';

export interface AppRouteDefinition {
  id: string;
  path?: string;
  index?: boolean;
  element: ReactElement;
  nav?: {
    icon: LucideIcon;
    labels: Record<RouteLabelVariant, string>;
    tourId?: string;
  };
}

export const APP_ROUTES: AppRouteDefinition[] = [
  {
    id: 'home',
    index: true,
    element: <HomePage />,
    nav: {
      icon: Home,
      labels: {
        default: 'Projects',
        v1: 'Projects',
        v2: 'projects',
        v3: 'Projects',
        v4: 'BASE OPS',
        v5: 'NEXUS',
        v6: 'Dossiers',
        v7: 'Ops Queue',
        v8: 'Worklist',
      },
    },
  },
  {
    id: 'ach',
    path: 'ach',
    element: <ACHPage />,
    nav: {
      icon: Grid3X3,
      labels: {
        default: 'ACH Matrix',
        v1: 'ACH Matrix',
        v2: 'ach_matrix',
        v3: 'ACH Matrix',
        v4: 'ACH MATRIX',
        v5: 'ACH//GRID',
        v6: 'Hypothesis Board',
        v7: 'ACH Board',
        v8: 'Hypotheses',
      },
    },
  },
  {
    id: 'ach-matrix',
    path: 'ach/:matrixId',
    element: <ACHPage />,
  },
  {
    id: 'bias',
    path: 'bias',
    element: <BiasPage />,
    nav: {
      icon: Brain,
      labels: {
        default: 'Bias Checklist',
        v1: 'Bias Checklist',
        v2: 'bias_check',
        v3: 'Bias Checklist',
        v4: 'BIAS CHECK',
        v5: 'BIAS//SCAN',
        v6: 'Bias Review',
        v7: 'Bias Control',
        v8: 'Biases',
      },
      tourId: 'bias-nav',
    },
  },
  {
    id: 'ioc',
    path: 'ioc',
    element: <IOCPage />,
    nav: {
      icon: Crosshair,
      labels: {
        default: 'IOC Extractor',
        v1: 'IOC Extractor',
        v2: 'ioc_extract',
        v3: 'IOC Extractor',
        v4: 'IOC EXTRACT',
        v5: 'IOC//TRACE',
        v6: 'IOC Ledger',
        v7: 'IOC Intake',
        v8: 'IOCs',
      },
    },
  },
  {
    id: 'diamond',
    path: 'diamond',
    element: <DiamondPage />,
    nav: {
      icon: Diamond,
      labels: {
        default: 'Diamond Model',
        v1: 'Diamond Model',
        v2: 'diamond_model',
        v3: 'Diamond Model',
        v4: 'DIAMOND MODEL',
        v5: 'DIAMOND//MAP',
        v6: 'Diamond Notes',
        v7: 'Diamond Map',
        v8: 'Diamond',
      },
    },
  },
  {
    id: 'export',
    path: 'export',
    element: <ExportPage />,
    nav: {
      icon: Download,
      labels: {
        default: 'Export',
        v1: 'Export',
        v2: 'export',
        v3: 'Export',
        v4: 'EXFIL DATA',
        v5: 'EXTRACT',
        v6: 'Export Packet',
        v7: 'Package Out',
        v8: 'Output',
      },
      tourId: 'export-nav',
    },
  },
  {
    id: 'docs',
    path: 'docs',
    element: <DocsPage />,
    nav: {
      icon: BookOpen,
      labels: {
        default: 'Docs',
        v1: 'Docs',
        v2: 'docs',
        v3: 'Docs',
        v4: 'FIELD MANUAL',
        v5: 'CODEX',
        v6: 'Field Notes',
        v7: 'Playbook',
        v8: 'Manual',
      },
      tourId: 'docs-nav',
    },
  },
];

export function getNavRoutes(variant: RouteLabelVariant, basePath = '') {
  return APP_ROUTES.filter((route) => route.nav).map((route) => ({
    id: route.id,
    to: route.index ? `${basePath}/` : `${basePath}/${route.path}`,
    icon: route.nav!.icon,
    label: route.nav!.labels[variant],
    tourId: route.nav!.tourId,
  }));
}
