import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import type { LeaderboardEntry } from '../shared';
import { connectWs, disconnectWs } from '../services/ws';
import { api } from '../services/api';
import { theme } from '../theme';

interface Props {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.getScores().then(setEntries).catch(() => {});
    connectWs(setEntries);
    return () => disconnectWs();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={entries}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={[styles.rank, index < 3 && styles.topRank]}>#{index + 1}</Text>
            <Text style={styles.name}>{item.nickname}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No scores yet. Be the first!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, paddingHorizontal: theme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  backBtn: { paddingVertical: theme.spacing.sm, paddingRight: theme.spacing.md },
  backText: { color: theme.colors.accent, fontSize: 14 },
  title: { flex: 1, fontSize: theme.font.h2, color: theme.colors.text, fontWeight: '300' },
  spacer: { width: 60 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  rank: { width: 40, color: theme.colors.textDim, fontSize: theme.font.mono, fontWeight: '600' },
  topRank: { color: theme.colors.accent },
  name: { flex: 1, color: theme.colors.text, fontSize: theme.font.body },
  score: { color: theme.colors.accent, fontSize: theme.font.h3, fontWeight: '700', fontVariant: ['tabular-nums'] },
  empty: { color: theme.colors.textDim, textAlign: 'center', marginTop: theme.spacing.xxl },
});