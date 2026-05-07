import type { GameSession, LeaderboardEntry } from '@logiclike/shared';

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const api = {
  startGame: (nickname: string) =>
    json<GameSession>('/game/start', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    }),

  submitAnswer: (sessionId: string, answerIndex: number) =>
    json<{ correct: boolean; session: GameSession }>('/game/answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answerIndex }),
    }),

  getScores: () => json<LeaderboardEntry[]>('/game/scores'),

  getStats: (sessionId: string) =>
    json<{ totalAnswers: number; totalCorrect: number; accuracy: number; maxStreak: number; finalLevel: number; score: number }>(`/game/stats/${sessionId}`),
};