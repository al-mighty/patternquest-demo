import { type Puzzle, type Shape, type ShapeType, DIFFICULTY } from './types';

let counter = 0;
function uid() { return `local-${++counter}-${Date.now()}`; }

export function generatePuzzle(difficulty: number): Puzzle {
  const colors = DIFFICULTY.COLORS;
  const shapes = DIFFICULTY.SHAPES;
  const seqLen = Math.min(3 + Math.floor(difficulty / 3), 6);
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
      const distractor = { ...correctAnswer };
      const prop = Math.floor(Math.random() * 2);
      if (prop === 0) {
        let newType: ShapeType = shapes[Math.floor(Math.random() * shapes.length)];
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

  return { id: uid(), sequence, options, correctIndex, difficulty };
}
