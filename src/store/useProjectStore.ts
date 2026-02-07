import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, ACHMatrix, Evidence, Hypothesis, ConsistencyRating } from '../types';
import { generateId } from '../utils/id';
import { sampleProject } from '../data/sampleProject';

interface ProjectStore {
  // State
  projects: Project[];
  activeProjectId: string | null;

  // Computed
  getActiveProject: () => Project | null;
  getMatrix: (matrixId: string) => ACHMatrix | null;

  // Project CRUD
  createProject: (name: string, description: string) => string;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description'>>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  loadSampleProject: () => void;

  // ACH Matrix CRUD
  createMatrix: (projectId: string, name: string) => string;
  updateMatrix: (projectId: string, matrixId: string, updates: Partial<Pick<ACHMatrix, 'name'>>) => void;
  deleteMatrix: (projectId: string, matrixId: string) => void;

  // Hypothesis CRUD
  addHypothesis: (projectId: string, matrixId: string, name: string, description: string) => void;
  updateHypothesis: (projectId: string, matrixId: string, hypothesisId: string, updates: Partial<Pick<Hypothesis, 'name' | 'description'>>) => void;
  removeHypothesis: (projectId: string, matrixId: string, hypothesisId: string) => void;

  // Evidence CRUD
  addEvidence: (projectId: string, matrixId: string, evidence: Omit<Evidence, 'id'>) => void;
  updateEvidence: (projectId: string, matrixId: string, evidenceId: string, updates: Partial<Omit<Evidence, 'id'>>) => void;
  removeEvidence: (projectId: string, matrixId: string, evidenceId: string) => void;

  // Ratings
  setRating: (projectId: string, matrixId: string, evidenceId: string, hypothesisId: string, rating: ConsistencyRating) => void;

  // Import/Export
  exportProject: (id: string) => string | null;
  importProject: (json: string) => boolean;
}

function updateProjectTimestamp(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() };
}

function updateMatrixTimestamp(matrix: ACHMatrix): ACHMatrix {
  return { ...matrix, updatedAt: new Date().toISOString() };
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      getActiveProject: () => {
        const state = get();
        return state.projects.find((p) => p.id === state.activeProjectId) ?? null;
      },

      getMatrix: (matrixId: string) => {
        const project = get().getActiveProject();
        if (!project) return null;
        return project.achMatrices.find((m) => m.id === matrixId) ?? null;
      },

      createProject: (name, description) => {
        const id = generateId();
        const now = new Date().toISOString();
        const project: Project = {
          id,
          name,
          description,
          achMatrices: [],
          biasChecklists: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [...state.projects, project],
          activeProjectId: id,
        }));
        return id;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? updateProjectTimestamp({ ...p, ...updates }) : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        }));
      },

      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      loadSampleProject: () => {
        const state = get();
        // Don't duplicate if already loaded
        if (state.projects.some((p) => p.id === sampleProject.id)) {
          set({ activeProjectId: sampleProject.id });
          return;
        }
        set((state) => ({
          projects: [...state.projects, { ...sampleProject }],
          activeProjectId: sampleProject.id,
        }));
      },

      createMatrix: (projectId, name) => {
        const id = generateId();
        const now = new Date().toISOString();
        const matrix: ACHMatrix = {
          id,
          name,
          hypotheses: [],
          evidence: [],
          ratings: {},
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({ ...p, achMatrices: [...p.achMatrices, matrix] })
              : p
          ),
        }));
        return id;
      },

      updateMatrix: (projectId, matrixId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId ? updateMatrixTimestamp({ ...m, ...updates }) : m
                  ),
                })
              : p
          ),
        }));
      },

      deleteMatrix: (projectId, matrixId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.filter((m) => m.id !== matrixId),
                })
              : p
          ),
        }));
      },

      addHypothesis: (projectId, matrixId, name, description) => {
        const hypothesis: Hypothesis = { id: generateId(), name, description };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId
                      ? updateMatrixTimestamp({
                          ...m,
                          hypotheses: [...m.hypotheses, hypothesis],
                        })
                      : m
                  ),
                })
              : p
          ),
        }));
      },

      updateHypothesis: (projectId, matrixId, hypothesisId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId
                      ? updateMatrixTimestamp({
                          ...m,
                          hypotheses: m.hypotheses.map((h) =>
                            h.id === hypothesisId ? { ...h, ...updates } : h
                          ),
                        })
                      : m
                  ),
                })
              : p
          ),
        }));
      },

      removeHypothesis: (projectId, matrixId, hypothesisId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) => {
                    if (m.id !== matrixId) return m;
                    // Remove hypothesis and clean up ratings
                    const newRatings = { ...m.ratings };
                    for (const eid of Object.keys(newRatings)) {
                      const { [hypothesisId]: _removed, ...rest } = newRatings[eid];
                      void _removed;
                      newRatings[eid] = rest;
                    }
                    return updateMatrixTimestamp({
                      ...m,
                      hypotheses: m.hypotheses.filter((h) => h.id !== hypothesisId),
                      ratings: newRatings,
                    });
                  }),
                })
              : p
          ),
        }));
      },

      addEvidence: (projectId, matrixId, evidenceData) => {
        const evidence: Evidence = { id: generateId(), ...evidenceData };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId
                      ? updateMatrixTimestamp({
                          ...m,
                          evidence: [...m.evidence, evidence],
                          ratings: { ...m.ratings, [evidence.id]: {} },
                        })
                      : m
                  ),
                })
              : p
          ),
        }));
      },

      updateEvidence: (projectId, matrixId, evidenceId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId
                      ? updateMatrixTimestamp({
                          ...m,
                          evidence: m.evidence.map((e) =>
                            e.id === evidenceId ? { ...e, ...updates } : e
                          ),
                        })
                      : m
                  ),
                })
              : p
          ),
        }));
      },

      removeEvidence: (projectId, matrixId, evidenceId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) => {
                    if (m.id !== matrixId) return m;
                    const { [evidenceId]: _removed, ...newRatings } = m.ratings;
                    void _removed;
                    return updateMatrixTimestamp({
                      ...m,
                      evidence: m.evidence.filter((e) => e.id !== evidenceId),
                      ratings: newRatings,
                    });
                  }),
                })
              : p
          ),
        }));
      },

      setRating: (projectId, matrixId, evidenceId, hypothesisId, rating) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? updateProjectTimestamp({
                  ...p,
                  achMatrices: p.achMatrices.map((m) =>
                    m.id === matrixId
                      ? updateMatrixTimestamp({
                          ...m,
                          ratings: {
                            ...m.ratings,
                            [evidenceId]: {
                              ...m.ratings[evidenceId],
                              [hypothesisId]: rating,
                            },
                          },
                        })
                      : m
                  ),
                })
              : p
          ),
        }));
      },

      exportProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return null;
        return JSON.stringify(project, null, 2);
      },

      importProject: (json) => {
        try {
          const project = JSON.parse(json) as Project;
          if (!project.id || !project.name) return false;
          set((state) => {
            // Replace if exists, otherwise add
            const exists = state.projects.some((p) => p.id === project.id);
            return {
              projects: exists
                ? state.projects.map((p) => (p.id === project.id ? project : p))
                : [...state.projects, project],
              activeProjectId: project.id,
            };
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'intel-workbench-projects',
    }
  )
);
