import { Injectable } from '@nestjs/common';
import {
  type Puzzle, type GameSession, type LeaderboardEntry, type Shape,
  DIFFICULTY,
} from '@logiclike/shared';

@Injectable()
export class GameService {
  private sessions = new Map<string, GameSession>();
  private leaderboard: LeaderboardEntry[] = [];
  // Adaptive difficulty tracking per session
  private difficultyState = new Map<string, { level: number; correctRun: number; wrongRun: number; totalAnswers: number; totalCorrect: number; totalTimeMs: number }>();

  startGame(nickname: string): GameSession {
    const sessionId = crypto.randomUUID();
    const puzzle = this.generatePuzzle(1);
    const session: GameSession = {
      sessionId,
      nickname,
      score: 0,
      streak: 0,
      currentPuzzle: puzzle,
      startedAt: new Date().toISOString(),
    };
    this.sessions.set(sessionId, session);
    this.difficultyState.set(sessionId, { level: 1, correctRun: 0, wrongRun: 0, totalAnswers: 0, totalCorrect: 0, totalTimeMs: 0 });
    return session;
  }

  submitAnswer(sessionId: string, answerIndex: number): { correct: boolean; session: GameSession } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const correct = answerIndex === session.currentPuzzle.correctIndex;

    const ds = this.difficultyState.get(sessionId)!;
    ds.totalAnswers++;

    if (correct) {
      session.streak++;
      ds.correctRun++;
      ds.wrongRun = 0;
      ds.totalCorrect++;
      const multiplier = 1 + (session.streak - 1) * (DIFFICULTY.STREAK_MULTIPLIER - 1);
      session.score += Math.round(DIFFICULTY.POINTS_BASE * multiplier);

      // Adaptive: 3 correct in a row → harder
      if (ds.correctRun >= 3) {
        ds.level = Math.min(ds.level + 1, 10);
        ds.correctRun = 0;
      }
    } else {
      session.streak = 0;
      ds.wrongRun++;
      ds.correctRun = 0;

      // Adaptive: 2 wrong in a row → easier
      if (ds.wrongRun >= 2) {
        ds.level = Math.max(ds.level - 1, 1);
        ds.wrongRun = 0;
      }
    }

    session.currentPuzzle = this.generatePuzzle(ds.level);

    this.updateLeaderboard(session.nickname, session.score);
    return { correct, session };
  }

  getStats(sessionId: string) {
    const ds = this.difficultyState.get(sessionId);
    const session = this.sessions.get(sessionId);
    if (!ds || !session) return null;
    return {
      totalAnswers: ds.totalAnswers,
      totalCorrect: ds.totalCorrect,
      accuracy: ds.totalAnswers > 0 ? Math.round((ds.totalCorrect / ds.totalAnswers) * 100) : 0,
      maxStreak: session.streak,
      finalLevel: ds.level,
      score: session.score,
    };
  }

  getLeaderboard(): LeaderboardEntry[] {
    return this.leaderboard.slice(0, 10);
  }

  private updateLeaderboard(nickname: string, score: number) {
    const existing = this.leaderboard.find(e => e.nickname === nickname);
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.timestamp = new Date().toISOString();
      }
    } else {
      this.leaderboard.push({ nickname, score, timestamp: new Date().toISOString() });
    }
    this.leaderboard.sort((a, b) => b.score - a.score);
    if (this.leaderboard.length > 50) this.leaderboard.length = 50;
  }

  private generatePuzzle(difficulty: number): Puzzle {
    const colors = DIFFICULTY.COLORS;
    const shapes = DIFFICULTY.SHAPES;
    const seqLen = Math.min(3 + Math.floor(difficulty / 3), 6);

    // Build a repeating pattern
    const patternLen = difficulty <= 3 ? 2 : difficulty <= 6 ? 3 : 4;
    const pattern: Shape[] = [];
    for (let i = 0; i < patternLen; i++) {
      pattern.push({
        type: shapes[i % shapes.length],
        color: colors[i % colors.length],
        size: difficulty >= 7 ? [30, 50, 70][i % 3] : 50,
        rotation: difficulty >= 9 ? i * 45 : 0,
      });
    }

    const sequence: Shape[] = [];
    for (let i = 0; i < seqLen; i++) {
      sequence.push({ ...pattern[i % patternLen] });
    }

    const correctAnswer: Shape = { ...pattern[seqLen % patternLen] };
    const correctIndex = Math.floor(Math.random() * 4);

    const options: Shape[] = [];
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(correctAnswer);
      } else {
        // Distractor: perturb one property
        const distractor = { ...correctAnswer };
        const prop = Math.floor(Math.random() * 2);
        if (prop === 0) {
          let newType = shapes[Math.floor(Math.random() * shapes.length)];
          while (newType === correctAnswer.type) newType = shapes[Math.floor(Math.random() * shapes.length)];
          distractor.type = newType;
        } else {
          let newColor = colors[Math.floor(Math.random() * colors.length)];
          while (newColor === correctAnswer.color) newColor = colors[Math.floor(Math.random() * colors.length)];
          distractor.color = newColor;
        }
        options.push(distractor);
      }
    }

    return {
      id: crypto.randomUUID(),
      sequence,
      options,
      correctIndex,
      difficulty,
    };
  }
}