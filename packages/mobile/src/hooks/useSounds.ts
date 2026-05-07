import { useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

// Generate simple beep sounds programmatically is not possible with expo-av,
// so we use a lightweight approach: play short system-like sounds via Audio API.
// In production, these would be .mp3/.wav assets.

const SOUNDS = {
  correct: { uri: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3' },
  wrong: { uri: 'https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3' },
  gameOver: { uri: 'https://cdn.freesound.org/previews/277/277403_4486188-lq.mp3' },
  tap: { uri: 'https://cdn.freesound.org/previews/399/399934_7562768-lq.mp3' },
};

export function useSounds() {
  const soundsRef = useRef<Record<string, Audio.Sound>>({});
  const loaded = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        for (const [key, source] of Object.entries(SOUNDS)) {
          const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
          if (mounted) soundsRef.current[key] = sound;
        }
        if (mounted) loaded.current = true;
      } catch (e) {
        // Sounds are non-critical, fail silently
        console.log('[Sounds] Failed to load:', e);
      }
    }

    load();

    return () => {
      mounted = false;
      Object.values(soundsRef.current).forEach(s => s.unloadAsync().catch(() => {}));
    };
  }, []);

  const play = useCallback(async (name: keyof typeof SOUNDS) => {
    try {
      const sound = soundsRef.current[name];
      if (!sound) return;
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {
      // Non-critical
    }
  }, []);

  return { play };
}