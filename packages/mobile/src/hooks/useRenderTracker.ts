import { useRef } from 'react';

export function useRenderTracker(name: string) {
  const count = useRef(0);
  count.current++;
  if (__DEV__) {
    console.log(`[Render] ${name}: ${count.current}`);
  }
  return count.current;
}