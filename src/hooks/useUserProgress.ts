import { useState, useCallback } from 'react';
import type { Difficulty } from '@/data/quizData';
import { getLevelForScore } from '@/data/leaderboardData';

export interface QuizResult {
  id: string;
  difficulty: Difficulty;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface ScenarioResult {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface IncidentResult {
  id: string;
  incidentId: string;
  incidentTitle: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface SocAlertResult {
  id: string;
  socAlertId: string;
  socAlertTitle: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface UserProgress {
  username: string;
  totalScore: number;
  quizHistory: QuizResult[];
  scenarioHistory: ScenarioResult[];
  incidentHistory: IncidentResult[];
  socAlertHistory: SocAlertResult[];
}

const STORAGE_KEY = 'cda_user_progress';

const DEFAULT_PROGRESS: UserProgress = {
  username: 'Operator',
  totalScore: 0,
  quizHistory: [],
  scenarioHistory: [],
  incidentHistory: [],
  socAlertHistory: [],
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...DEFAULT_PROGRESS };
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const update = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const updateUsername = useCallback((name: string) => {
    update((p) => ({ ...p, username: name }));
  }, [update]);

  const addQuizResult = useCallback((result: Omit<QuizResult, 'id'>) => {
    update((p) => {
      const newResult: QuizResult = { ...result, id: `quiz-${Date.now()}` };
      return {
        ...p,
        totalScore: p.totalScore + result.score,
        quizHistory: [newResult, ...p.quizHistory],
      };
    });
  }, [update]);

  const addScenarioResult = useCallback((result: Omit<ScenarioResult, 'id'>) => {
    update((p) => {
      const newResult: ScenarioResult = { ...result, id: `scenario-${Date.now()}` };
      return {
        ...p,
        totalScore: p.totalScore + result.score,
        scenarioHistory: [newResult, ...p.scenarioHistory],
      };
    });
  }, [update]);

  const addIncidentResult = useCallback((result: Omit<IncidentResult, 'id'>) => {
    update((p) => {
      const newResult: IncidentResult = { ...result, id: `incident-${Date.now()}` };
      return {
        ...p,
        totalScore: p.totalScore + result.score,
        incidentHistory: [newResult, ...(p.incidentHistory ?? [])],
      };
    });
  }, [update]);

  const resetProgress = useCallback(() => {
    const fresh = { ...DEFAULT_PROGRESS };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  const level = getLevelForScore(progress.totalScore);

  const getCompletedDifficulties = (): Difficulty[] => {
    const diffs = new Set<Difficulty>();
    progress.quizHistory.forEach((r) => diffs.add(r.difficulty));
    return Array.from(diffs);
  };

  const getCompletedScenarioIds = (): string[] => {
    return [...new Set(progress.scenarioHistory.map((r) => r.scenarioId))];
  };

  const getCompletedIncidentIds = (): string[] => {
    return [...new Set((progress.incidentHistory ?? []).map((r) => r.incidentId))];
  };

  const getBestScoreForDifficulty = (difficulty: Difficulty): number => {
    const results = progress.quizHistory.filter((r) => r.difficulty === difficulty);
    if (!results.length) return 0;
    return Math.max(...results.map((r) => r.score));
  };

  const getBestScoreForScenario = (scenarioId: string): number => {
    const results = progress.scenarioHistory.filter((r) => r.scenarioId === scenarioId);
    if (!results.length) return 0;
    return Math.max(...results.map((r) => r.score));
  };

  const getBestScoreForIncident = (incidentId: string): number => {
    const results = (progress.incidentHistory ?? []).filter((r) => r.incidentId === incidentId);
    if (!results.length) return 0;
    return Math.max(...results.map((r) => r.score));
  };

  return {
    progress,
    level,
    updateUsername,
    addQuizResult,
    addScenarioResult,
    addIncidentResult,
    resetProgress,
    getCompletedDifficulties,
    getCompletedScenarioIds,
    getCompletedIncidentIds,
    getBestScoreForDifficulty,
    getBestScoreForScenario,
    getBestScoreForIncident,
  };
}
