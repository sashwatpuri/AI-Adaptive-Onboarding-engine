import { create } from 'zustand'

export const useAppStore = create((set) => ({
  sessionId: null,
  resumeText: "",
  jdText: "",
  resumeSkills: [],
  jdSkills: [],
  gapMap: null,
  roadmap: [],
  overallReadinessPct: 0,
  currentMonth: 1,
  testData: null,
  testResults: null,
  reasoningTrace: [],
  isLoading: false,
  loadingMessage: "",
  activeScreen: "landing",

  setSession: (id) => set({ sessionId: id }),
  setTexts: (resume, jd) => set({ resumeText: resume, jdText: jd }),
  setSkills: (resume, jd) => set({ resumeSkills: resume, jdSkills: jd }),
  setRoadmap: (gapMap, roadmap, pct) => set({ gapMap, roadmap, overallReadinessPct: pct }),
  setTestData: (data) => set({ testData: data }),
  setTestResults: (results) => set({ testResults: results }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
  addTraceEntries: (entries) => set((state) => ({ reasoningTrace: [...state.reasoningTrace, ...entries] })),
  setLoading: (bool, message = "") => set({ isLoading: bool, loadingMessage: message }),
  setScreen: (name) => set({ activeScreen: name }),
  reset: () => set({
    sessionId: null, resumeText: "", jdText: "", resumeSkills: [], jdSkills: [],
    gapMap: null, roadmap: [], overallReadinessPct: 0, currentMonth: 1,
    testData: null, testResults: null, reasoningTrace: [], isLoading: false,
    loadingMessage: "", activeScreen: "landing"
  }),
  loadDemoPersona: (persona) => set({
    resumeSkills: persona.resumeSkills,
    jdSkills: persona.jdSkills,
    gapMap: persona.gapMap,
    roadmap: persona.roadmap,
    reasoningTrace: persona.reasoningTrace,
    overallReadinessPct: persona.gapMap.overall_readiness_pct,
    activeScreen: "extract"
  })
}))
