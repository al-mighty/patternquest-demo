import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { api } from '../services/api';
import { theme } from '../theme';
import { t } from '../i18n';

interface Props {
  score: number;
  sessionId: string;
  onPlayAgain: () => void;
  onHome: () => void;
  onLeaderboard: () => void;
}

interface Stats {
  totalAnswers: number;
  totalCorrect: number;
  accuracy: number;
  maxStreak: number;
  finalLevel: number;
}

export function GameOverScreen({ score, sessionId, onPlayAgain, onHome, onLeaderboard }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 10, useNativeDriver: true }),
    ]).start();

    api.getStats(sessionId).then(setStats).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.title}>{t.gameOver}</Text>
        <Text style={styles.scoreLabel}>{t.finalScore}</Text>
        <Text style={styles.score}>{score}</Text>

        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalCorrect}/{stats.totalAnswers}</Text>
              <Text style={styles.statLabel}>{t.correctLabel}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>{t.accuracy}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.maxStreak}</Text>
              <Text style={styles.statLabel}>{t.bestStreak}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Lv.{stats.finalLevel}</Text>
              <Text style={styles.statLabel}>{t.level}</Text>
            </View>
          </View>
        )}

        <Pressable style={styles.primaryBtn} onPress={onPlayAgain}>
          <Text style={styles.primaryText}>{t.playAgain}</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={onLeaderboard}>
          <Text style={styles.secondaryText}>{t.leaderboardIcon}</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={onHome}>
          <Text style={styles.secondaryText}>{t.home}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  card: { alignItems: 'center', width: '100%', maxWidth: 320 },
  title: { fontSize: 36, fontWeight: '300', color: theme.colors.danger, marginBottom: theme.spacing.lg },
  scoreLabel: { fontSize: 11, color: theme.colors.textDim, letterSpacing: 3 },
  score: { fontSize: 72, fontWeight: '700', color: theme.colors.accent, marginBottom: theme.spacing.lg, fontVariant: ['tabular-nums'] },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: theme.spacing.xl, width: '100%' },
  statItem: { alignItems: 'center', minWidth: 70 },
  statValue: { color: theme.colors.text, fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'] },
  statLabel: { color: theme.colors.textDim, fontSize: 9, letterSpacing: 2, marginTop: 4 },
  primaryBtn: {
    backgroundColor: theme.colors.accent, borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl,
    width: '100%', alignItems: 'center', marginBottom: theme.spacing.md,
  },
  primaryText: { color: theme.colors.bg, fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  secondaryBtn: { paddingVertical: theme.spacing.sm },
  secondaryText: { color: theme.colors.textDim, fontSize: 14 },
});