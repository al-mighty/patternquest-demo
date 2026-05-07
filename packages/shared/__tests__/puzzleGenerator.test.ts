import { generatePuzzle, DIFFICULTY } from '../src';

describe('puzzleGenerator', () => {
  it('returns a puzzle with required fields', () => {
    const puzzle = generatePuzzle(1);
    expect(puzzle.id).toBeDefined();
    expect(puzzle.sequence.length).toBeGreaterThanOrEqual(3);
    expect(puzzle.options).toHaveLength(4);
    expect(puzzle.correctIndex).toBeGreaterThanOrEqual(0);
    expect(puzzle.correctIndex).toBeLessThanOrEqual(3);
    expect(puzzle.difficulty).toBe(1);
  });

  it('correct answer is in options at correctIndex', () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generatePuzzle(3);
      const correct = puzzle.options[puzzle.correctIndex];
      // The correct answer should follow the pattern
      expect(correct.type).toBeDefined();
      expect(correct.color).toBeDefined();
      expect(DIFFICULTY.SHAPES).toContain(correct.type);
      expect(DIFFICULTY.COLORS).toContain(correct.color);
    }
  });

  it('distractors differ from correct answer', () => {
    for (let i = 0; i < 20; i++) {
      const puzzle = generatePuzzle(2);
      const correct = puzzle.options[puzzle.correctIndex];
      puzzle.options.forEach((opt, idx) => {
        if (idx !== puzzle.correctIndex) {
          const differs = opt.type !== correct.type || opt.color !== correct.color;
          expect(differs).toBe(true);
        }
      });
    }
  });

  it('higher difficulty produces longer sequences', () => {
    const easy = generatePuzzle(1);
    const hard = generatePuzzle(9);
    expect(hard.sequence.length).toBeGreaterThanOrEqual(easy.sequence.length);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generatePuzzle(1).id));
    expect(ids.size).toBe(100);
  });
});
