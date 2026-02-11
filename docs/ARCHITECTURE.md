# Architecture

## System Overview

Intel Workbench is a single-page React application with no backend dependencies. All intelligence analysis is performed client-side using Zustand state management and localStorage persistence.

## Tech Stack

### Frontend Only
- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast development and optimized production builds
- **Tailwind CSS** for styling with 5 theme variants
- **Zustand** with `persist` middleware for localStorage persistence
- **React Router v6** for client-side navigation
- **driver.js** (CDN) for interactive guided tours
- **Lucide React** for consistent icon set
- Runs on **port 5182**

No backend server required. All data is stored locally and fully portable via JSON export.

## Data Flow

```
Load Projects from localStorage
    |
    v
Render Project Selector or ACH Workspace
    |
    v
User Adds Evidence/Hypotheses
    |
    v
Calculate ACH Scores in Real-Time
    |
    v
Update Zustand Store -> localStorage
    |
    v
Display Score Bars and Bias Checklist
    |
    v
User Exports JSON/Markdown or Continues Analysis
```

## State Management (Zustand)

The main store structure:

```typescript
interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  viewMode: 'acch' | 'bias' | 'export' | 'docs';
  
  // Actions
  createProject: (name: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // ACH-specific
  addEvidence: (projectId: string, evidence: Evidence) => void;
  updateEvidenceRating: (projectId: string, evidenceId: string, hypothesisId: string, rating: Rating) => void;
  addHypothesis: (projectId: string, hypothesis: Hypothesis) => void;
  updateBias: (projectId: string, biasId: string, notes: string) => void;
}

// Persisted to localStorage under key: intel-workbench-projects
```

## Project Model

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  
  // ACH specific
  hypotheses: Hypothesis[];
  evidence: Evidence[];
  biasNotes: Map<BiasId, string>;
  
  // Metadata
  status: 'draft' | 'active' | 'completed';
}

interface Hypothesis {
  id: string;
  name: string;
  description?: string;
  preferredRank?: number;  // Lower = more supported (after scoring)
}

interface Evidence {
  id: string;
  text: string;
  source?: string;
  credibility: 'High' | 'Medium' | 'Low';
  relevance: 'High' | 'Medium' | 'Low';
  
  // Ratings per hypothesis: Consistent (C), Inconsistent (I), Neutral (N), Not Applicable (NA)
  ratings: Map<HypothesisId, Rating>;
}

type Rating = 'C' | 'I' | 'N' | 'NA';
```

## ACH Scoring Engine

The scoring algorithm implements Richards J. Heuer Jr.'s ACH methodology:

```javascript
function scoreHypothesis(hypothesis, evidence) {
  let inconsistencyScore = 0;
  
  for (const item of evidence) {
    const rating = item.ratings[hypothesis.id];
    const weight = getWeight(item.credibility, item.relevance);
    
    if (rating === 'I') {
      // Inconsistent ratings are penalized
      inconsistencyScore += weight * 2;
    } else if (rating === 'C') {
      // Consistent ratings reduce the score
      inconsistencyScore -= weight * 1;
    }
    // Neutral (N) and Not Applicable (NA) contribute 0
  }
  
  return inconsistencyScore;
}

function getWeight(credibility, relevance) {
  const credMultiplier = {
    'High': 1.5,
    'Medium': 1.0,
    'Low': 0.5,
  };
  const relevMultiplier = {
    'High': 1.5,
    'Medium': 1.0,
    'Low': 0.5,
  };
  return credMultiplier[credibility] * relevMultiplier[relevance];
}

// Final scores are normalized to a 0-100 scale for display
// Lower scores indicate stronger support (fewer weighted inconsistencies)
// The hypothesis with the lowest score is flagged as "preferred"
```

## Bias Checklist

Tracks 12 cognitive biases from Heuer & Pherson taxonomy:

**Cognitive Biases:**
- Anchoring bias - Over-reliance on initial data
- Availability bias - Overweighting recent information
- Mirror imaging - Assuming others think like us

**Analytical Biases:**
- Groupthink - Pressure toward consensus
- Hypothesis testing bias - Seeking confirmatory evidence
- Premature closure - Stopping analysis too early

**Social Biases:**
- Organizational pressure - Conforming to organizational view
- Status quo bias - Preferring existing beliefs
- Power of first conclusion - Early conclusions persist

Each bias has a text field for mitigation notes. Store in project under `biasNotes: Map<BiasId, string>`.

## Component Architecture

```
┌─────────────────────────────────────────────┐
│         React Router Root                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  VariantPicker (Variant Selector)   │   │
│  │  Routes: / → /v1/*, /v2/*, etc.    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  VariantLayout (v1-v5)              │   │
│  │  ├─ Sidebar                         │   │
│  │  │  ├─ Project List                 │   │
│  │  │  └─ Navigation                   │   │
│  │  └─ Main Content                    │   │
│  │     ├─ HomePage                     │   │
│  │     ├─ ACHPage                      │   │
│  │     ├─ BiasPage                     │   │
│  │     ├─ ExportPage                   │   │
│  │     └─ DocsPage                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ThemeContext                       │   │
│  │  Provides color tokens per variant  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Zustand Store                      │   │
│  │  (persist middleware → localStorage)│   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Pages

### Home (Project List)
- Create new project
- Load existing project
- Delete project
- See creation/update dates

### ACH Matrix
- Evidence vs. Hypothesis grid
- Inline rating editor (C/I/N/NA)
- Credibility & relevance dropdowns
- Real-time score calculation
- Preferred hypothesis highlight
- Keyboard navigation across cells

### Bias Checklist
- 12 bias categories
- Text input for mitigation notes
- Visual confirmation of completion
- Export bias analysis to report

### Export
- JSON export (full backup)
- Markdown export (formatted report)
- Plain text summary
- Share URL (via localStorage export in URL hash)

### Documentation
- ACH methodology explanation
- Scoring formula breakdown
- Bias taxonomy reference
- Keyboard shortcuts

## 5 Variants

Each variant wraps the same core pages in unique theming:

| Variant | Theme | Aesthetic |
|---------|-------|-----------|
| **v1 (Langley)** | Dark navy, gold accents, serif type, classified stamps | Intelligence agency briefing room |
| **v2 (Terminal)** | Pure black, matrix green, scanline overlay, monospace | Hacker / OSINT workspace |
| **v3 (Analyst's Desk)** | Light backgrounds, blue accents, content-first | Clean professional analysis |
| **v4 (Stratcom)** | OD green, amber accents, grid patterns, military time | Military command center |
| **v5 (Cyber Noir)** | Neon cyan/magenta, glow effects, glass-morphism | Cyberpunk aesthetic |

All variants:
- Share the same Zustand store and scoring engine
- Load color tokens from ThemeContext
- Support full offline operation
- Persist analysis independently (one localStorage key per variant choice)

Switching themes is instant. All analysis data transfers seamlessly.

## Offline-First Architecture

100% offline capability:
1. Load projects from localStorage on startup
2. Create/edit projects entirely in-browser
3. Export to JSON for backup
4. Import from JSON to restore
5. Share via URL-embedded JSON (localStorage hash)

No internet connection required. No server calls. No registration. Complete privacy.

## localStorage Schema

```
intel-workbench-projects: {
  "version": 1,
  "projects": [
    {
      "id": "uuid",
      "name": "APT41 Attribution",
      "description": "...",
      "hypotheses": [...],
      "evidence": [...],
      "biasNotes": {...},
      "created_at": "2026-02-09T10:00:00Z"
    }
  ]
}
```

Max size: ~5MB (depends on browser). Good for 100-200 projects with hundreds of evidence items each.

## Performance Characteristics

- **Projects:** 1-500 (instant)
- **Hypotheses per project:** 3-20 (instant)
- **Evidence items:** 10-500 (instant scoring, real-time updates)
- **Export:** <100ms for JSON, <500ms for Markdown

Scoring is O(H * E) where H = hypotheses, E = evidence. Even large analyses complete in milliseconds.
