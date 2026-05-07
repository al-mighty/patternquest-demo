import { z } from 'zod';

export const ShapeTypeEnum = z.enum(['circle', 'square', 'triangle', 'star', 'hexagon']);
export type ShapeType = z.infer<typeof ShapeTypeEnum>;

export const ShapeSchema = z.object({
  type: ShapeTypeEnum,
  color: z.string(),
  size: z.number().min(20).max(80),
  rotation: z.number().optional(),
});
export type Shape = z.infer<typeof ShapeSchema>;

export const PuzzleSchema = z.object({
  id: z.string(),
  sequence: z.array(ShapeSchema),
  options: z.array(ShapeSchema),
  correctIndex: z.number(),
  difficulty: z.number(),
});
export type Puzzle = z.infer<typeof PuzzleSchema>;

export const GameSessionSchema = z.object({
  sessionId: z.string(),
  nickname: z.string(),
  score: z.number(),
  streak: z.number(),
  currentPuzzle: PuzzleSchema,
  startedAt: z.string(),
});
export type GameSession = z.infer<typeof GameSessionSchema>;

export const LeaderboardEntrySchema = z.object({
  nickname: z.string(),
  score: z.number(),
  timestamp: z.string(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const StartGameDto = z.object({
  nickname: z.string().min(1).max(20),
});

export const SubmitAnswerDto = z.object({
  sessionId: z.string(),
  answerIndex: z.number().min(0).max(3),
});

// WebSocket events
export type WsEvent =
  | { type: 'leaderboard:update'; data: LeaderboardEntry[] }
  | { type: 'game:tick'; data: { timeLeft: number } };

// Difficulty constants
export const DIFFICULTY = {
  COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  SHAPES: ['circle', 'square', 'triangle', 'star', 'hexagon'] as ShapeType[],
  TIME_PER_ROUND_MS: 10000,
  POINTS_BASE: 100,
  STREAK_MULTIPLIER: 1.5,
} as const;