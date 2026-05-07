import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { Puzzle } from '@logiclike/shared';
import { ShapeItem } from './ShapeItem';
import { theme } from '../../theme';

interface Props {
  puzzle: Puzzle;
}

export function PuzzleBoard({ puzzle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>What comes next?</Text>
      <View style={styles.sequence}>
        {puzzle.sequence.map((shape, i) => (
          <ShapeItem key={`${puzzle.id}-${i}`} shape={shape} index={i} size={44} />
        ))}
        <View style={styles.questionMark}>
          <Text style={styles.questionText}>?</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: theme.spacing.lg },
  label: { color: theme.colors.textDim, fontSize: theme.font.small, letterSpacing: 2, textTransform: 'uppercase', marginBottom: theme.spacing.md },
  sequence: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
  questionMark: {
    width: 44, height: 44, borderRadius: 8,
    borderWidth: 2, borderColor: theme.colors.accent, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', margin: 6,
  },
  questionText: { color: theme.colors.accent, fontSize: 24, fontWeight: '700' },
});