import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import type { GameSession } from '../shared';
import { PuzzleBoard } from '../components/puzzle/PuzzleBoard';
import { OptionsList } from '../components/puzzle/OptionsList';
import { ProgressBar } from '../components/puzzle/ProgressBar';
import { theme } from '../theme';
import { t } from '../i18n';

interface Props {
  session: GameSession;
  lastResult: boolean | null;
  lives: number;
  loading: boolean;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
  onQuit: () => void;
}

export function GameScreen({ session, lastResult, lives, loading, onAnswer, onTimeout, onQuit }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [session.currentPuzzle.id]);

  const handleAnswer = useCallback((index: number) => {
    onAnswer(index);
  }, [onAnswer]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onQuit} style={styles.quit}>
          <Text style={styles.quitText}>✕</Text>
        </Pressable>
        <View style={styles.stats}>
          <Text style={styles.score}>{session.score}</Text>
          <Text style={styles.scoreLabel}>{t.score}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.streak}>{session.streak}🔥</Text>
          <Text style={styles.scoreLabel}>{t.streak}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.lives}>{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</Text>
          <Text style={styles.scoreLabel}>{t.lives}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.difficulty}>Lv.{session.currentPuzzle.difficulty}</Text>
          <Text style={styles.scoreLabel}>{t.level}</Text>
        </View>
      </View>

      <ProgressBar running={!loading} onTimeout={onTimeout} />

      {lastResult !== null && (
        <View style={[styles.result, lastResult ? styles.resultCorrect : styles.resultWrong]}>
          <Text style={styles.resultText}>{lastResult ? `✓ ${t.correct}` : `✗ ${t.wrong}`}</Text>
        </View>
      )}

      <Animated.View style={{ opacity: fadeAnim }}>
        <PuzzleBoard puzzle={session.currentPuzzle} />
      </Animated.View>

      <OptionsList
        options={session.currentPuzzle.options}
        onSelect={handleAnswer}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, paddingTop: 50, paddingHorizontal: theme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  quit: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  quitText: { color: theme.colors.textDim, fontSize: 16 },
  stats: { alignItems: 'center' },
  score: { color: theme.colors.accent, fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
  streak: { color: theme.colors.danger, fontSize: 20, fontWeight: '700' },
  difficulty: { color: theme.colors.success, fontSize: 18, fontWeight: '600' },
  lives: { fontSize: 16 },
  scoreLabel: { color: theme.colors.textDim, fontSize: 9, letterSpacing: 2, marginTop: 2 },
  result: { paddingVertical: 6, borderRadius: theme.radius.sm, alignItems: 'center', marginBottom: theme.spacing.sm },
  resultCorrect: { backgroundColor: 'rgba(78, 205, 196, 0.15)' },
  resultWrong: { backgroundColor: 'rgba(255, 107, 107, 0.15)' },
  resultText: { color: theme.colors.text, fontSize: theme.font.mono, fontWeight: '600' },
});