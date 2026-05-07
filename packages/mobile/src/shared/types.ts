export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';

export interface Shape {
  type: ShapeType;
  color: string;
  size: number;
  rotation?: number;
}

export interface Puzzle {
  id: string;
  sequence: Shape[];
  options: Shape[];
  correctIndex: number;
  difficulty: number;
}

export interface GameSession {
  sessionId: string;
  nickname: string;
  score: number;
  streak: number;
  currentPuzzle: Puzzle;
  startedAt: string;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  timestamp: string;
}

export const DIFFICULTY = {
  COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  SHAPES: ['circle', 'square', 'triangle', 'star', 'hexagon'] as ShapeType[],
  TIME_PER_ROUND_MS: 10000,
  POINTS_BASE: 100,
  STREAK_MULTIPLIER: 1.5,
} as const;
