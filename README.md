<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-4-FFD43B?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

# 🛡️ Solomon's Intel Workbench

**Structured analytic techniques for cyber threat intelligence — built for the modern analyst.**

Intel Workbench is an interactive Analysis of Competing Hypotheses (ACH) tool that brings rigorous intelligence methodology to the browser. Score evidence against hypotheses, identify cognitive biases, and export structured assessments — all with zero backend, full offline capability, and five distinct visual themes.

![Intel Workbench](docs/screenshots/dashboard.png)

---

## ✨ Features

- **ACH Matrix** — Interactive evidence-vs-hypothesis grid with consistency ratings (C/I/N/NA), weighted scoring, and automatic preferred-hypothesis identification
- **Cognitive Bias Checklist** — Heuer & Pherson taxonomy with 12 biases across Cognitive, Analytical, and Social categories; track mitigation notes per bias
- **Score Visualization** — Real-time normalized score bars showing hypothesis support levels with color-coded confidence indicators
- **Evidence Weighting** — Credibility and relevance ratings (High/Medium/Low) that feed into weighted inconsistency scores
- **Export & Import** — Full JSON export/import for backup and sharing; Markdown export for report generation
- **5 Visual Themes** — Langley (classified intel), Terminal (hacker/OSINT), Analyst's Desk (clean professional), Stratcom (military command), Cyber Noir (cyberpunk)
- **In-App Guided Tour** — First-visit walkthrough powered by driver.js highlighting every major feature
- **Built-In Documentation** — Comprehensive help page covering ACH methodology, scoring, bias awareness, and keyboard shortcuts
- **Offline-First** — All data persisted in localStorage; works without any server
- **Keyboard Accessible** — Full keyboard navigation across the matrix grid

---

## 🏗️ Architecture

Intel Workbench is a **single-page React application** with no backend dependencies:

```
Browser
  └─ React 18 (SPA, React Router v6)
       ├─ Zustand Store ← persist middleware → localStorage
       ├─ ThemeContext (per-variant color tokens)
       ├─ Pages: Home / ACH / Bias / Export / Docs
       └─ 5 Variant Layouts (lazy-loaded)
```

- **State Management:** Zustand with `persist` middleware writes to `localStorage` under the key `intel-workbench-projects`
- **Routing:** React Router v6 with nested variant routes (`/v1/*`, `/v2/*`, …, `/default/*`) and a variant picker at `/`
- **Theming:** `ThemeContext` provides color tokens per variant; components read them via `useTheme()`
- **Code Splitting:** Variant layouts are `React.lazy()` loaded to keep the initial bundle small

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/intel-workbench.git
cd intel-workbench
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | Component UI |
| **Language** | TypeScript 5 | Type safety |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **State** | Zustand 4 | Global state + persistence |
| **Routing** | React Router 6 | Client-side navigation |
| **Icons** | Lucide React | Consistent icon set |
| **Bundler** | Vite 5 | Dev server + build |
| **Tour** | driver.js 1.3 (CDN) | Guided onboarding |

---

## 📁 Project Structure

```text
intel-workbench/
├── index.html                 # Entry point + CDN links
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx               # React root
    ├── App.tsx                # Router + variant routes
    ├── index.css              # Tailwind layers + component classes
    ├── components/
    │   ├── ach/
    │   │   ├── ACHMatrix.tsx  # Interactive hypothesis matrix
    │   │   └── ACHScoreBar.tsx
    │   ├── bias/
    │   │   └── BiasChecklist.tsx
    │   ├── layout/
    │   │   └── AppShell.tsx   # Default sidebar layout
    │   └── GuidedTour.tsx     # driver.js onboarding tour
    ├── contexts/
    │   └── ThemeContext.tsx    # Theme color provider
    ├── data/
    │   ├── biasData.ts        # Cognitive bias catalog
    │   └── sampleProject.ts   # Sandworm sample data
    ├── pages/
    │   ├── HomePage.tsx       # Project list & creation
    │   ├── ACHPage.tsx        # Matrix workspace
    │   ├── BiasPage.tsx       # Bias review
    │   ├── ExportPage.tsx     # JSON/Markdown export
    │   ├── DocsPage.tsx       # In-app help & documentation
    │   └── VariantPicker.tsx  # Theme selector landing
    ├── store/
    │   └── useProjectStore.ts # Zustand store (persisted)
    ├── types/
    │   └── index.ts           # TypeScript interfaces
    ├── utils/
    │   ├── achScoring.ts      # Scoring algorithms
    │   ├── id.ts              # ID generator
    │   └── useBasePath.ts     # Variant-aware navigation
    └── variants/
        ├── v1/Layout.tsx      # Langley (intel agency)
        ├── v2/Layout.tsx      # Terminal (hacker)
        ├── v3/Layout.tsx      # Analyst's Desk (clean)
        ├── v4/Layout.tsx      # Stratcom (military)
        └── v5/Layout.tsx      # Cyber Noir (cyberpunk)
```

---

## 🎨 5 Variants

Each variant wraps the same core pages in a unique visual identity:

| Variant | Theme | Aesthetic |
|---------|-------|-----------|
| **v1 — Langley** | Intelligence Agency | Dark navy, gold accents, serif type, classified stamps |
| **v2 — Terminal** | Hacker / OSINT | Pure black, matrix green, scanline overlay, monospace |
| **v3 — Analyst's Desk** | Clean Professional | Light backgrounds, blue accents, content-first layout |
| **v4 — Stratcom** | Military Command | OD green, amber accents, grid patterns, military time |
| **v5 — Cyber Noir** | Cyberpunk | Neon cyan + magenta, glow effects, glass-morphism |

All variants share the same Zustand store and page components. Switching themes is instant — just navigate back to the variant picker at `/`.

---

## 📊 ACH Methodology

**Analysis of Competing Hypotheses** (ACH) is a structured analytic technique developed by Richards J. Heuer Jr. at the CIA. Instead of seeking evidence to *confirm* a preferred hypothesis, ACH forces analysts to:

1. **Enumerate all reasonable hypotheses**
2. **List all significant evidence and arguments**
3. **Rate each evidence item against each hypothesis** as Consistent (C), Inconsistent (I), Neutral (N), or Not Applicable (NA)
4. **Score inconsistencies** — the hypothesis with the *fewest* weighted inconsistencies is the most supported
5. **Identify and mitigate cognitive biases** that might distort the analysis

The key insight: **disprove rather than prove.** A single strong inconsistency can eliminate a hypothesis, while consistent evidence alone cannot confirm one.

### Scoring Formula

```text
Score = Σ (weight × rating_value)

where:
  rating_value: I = +2, N = 0, C = −1
  weight:       credibility_multiplier × relevance_multiplier
  multipliers:  High = 1.5, Medium = 1.0, Low = 0.5
```

Lower (more negative) scores indicate stronger support. The hypothesis with the lowest score is flagged as **preferred**.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
