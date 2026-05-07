import { useState, useCallback, useRef } from 'react';
import type { GameSession } from '../shared';
import { generatePuzzle, DIFFICULTY } from '../shared';
import { api } from '../services/api';

const MAX_LIVES = 3;

export function useGameEngine() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [offline, setOffline] = useState(false);
  const streakRef = useRef(0);
  const diffRef = useRef({ level: 1, correctRun: 0, wrongRun: 0 });

  const createOfflineSession = useCallback((nickname: string): GameSession => ({
    sessionId: `offline-${Date.now()}`,
    nickname,
    score: 0,
    streak: 0,
    currentPuzzle: generatePuzzle(1),
    startedAt: new Date().toISOString(),
  }), []);

  const startGame = useCallback(async (nickname: string) => {
    setLoading(true);
    diffRef.current = { level: 1, correctRun: 0, wrongRun: 0 };
    try {
      const s = await api.startGame(nickname);
      setSession(s);
      setOffline(false);
    } catch {
      // Offline fallback
      setSession(createOfflineSession(nickname));
      setOffline(true);
    } finally {
      setLastResult(null);
      setLives(MAX_LIVES);
      setGameOver(false);
      streakRef.current = 0;
      setLoading(false);
    }
  }, [createOfflineSession]);

  const submitAnswer = useCallback(async (answerIndex: number) => {
    if (!session || gameOver) return;
    setLoading(true);

    try {
      if (offline) {
        // Local game logic
        const correct = answerIndex === session.currentPuzzle.correctIndex;
        const ds = diffRef.current;

        let newScore = session.score;
        let newStreak = session.streak;

        if (correct) {
          newStreak++;
          ds.correctRun++;
          ds.wrongRun = 0;
          const multiplier = 1 + (newStreak - 1) * (DIFFICULTY.STREAK_MULTIPLIER - 1);
          newScore += Math.round(DIFFICULTY.POINTS_BASE * multiplier);
          if (ds.correctRun >= 3) { ds.level = Math.min(ds.level + 1, 10); ds.correctRun = 0; }
        } else {
          newStreak = 0;
          ds.wrongRun++;
          ds.correctRun = 0;
          if (ds.wrongRun >= 2) { ds.level = Math.max(ds.level - 1, 1); ds.wrongRun = 0; }
        }

        const updated: GameSession = {
          ...session,
          score: newScore,
          streak: newStreak,
          currentPuzzle: generatePuzzle(ds.level),
        };
        setSession(updated);
        setLastResult(correct);
        streakRef.current = newStreak;

        if (!correct) {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) setGameOver(true);
        }
      } else {
        const { correct, session: updated } = await api.submitAnswer(session.sessionId, answerIndex);
        setSession(updated);
        setLastResult(correct);
        streakRef.current = updated.streak;

        if (!correct) {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) setGameOver(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [session, lives, gameOver, offline]);

  const reset = useCallback(() => {
    setSession(null);
    setLastResult(null);
    setLives(MAX_LIVES);
    setGameOver(false);
    setOffline(false);
  }, []);

  return { session, loading, lastResult, lives, gameOver, offline, streak: streakRef.current, startGame, submitAnswer, reset };
}