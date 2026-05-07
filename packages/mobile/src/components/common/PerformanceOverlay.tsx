import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../../theme';

export function PerformanceOverlay() {
  const [visible, setVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    if (!visible) return;
    let raf: number;
    const tick = () => {
      frames.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        lastTime.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <>
      <Pressable style={styles.toggle} onPress={() => setVisible(v => !v)}>
        <Text style={styles.toggleText}>FPS</Text>
      </Pressable>
      {visible && (
        <View style={styles.overlay}>
          <Text style={[styles.fps, fps < 30 && styles.fpsLow]}>
            {fps} FPS
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute', top: 50, right: 12, zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4,
  },
  toggleText: { color: theme.colors.accent, fontSize: 10, fontWeight: '700' },
  overlay: {
    position: 'absolute', top: 50, right: 50, zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
  },
  fps: { color: '#4ECDC4', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  fpsLow: { color: '#FF6B6B' },
});