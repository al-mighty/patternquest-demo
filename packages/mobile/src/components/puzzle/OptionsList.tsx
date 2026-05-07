import React, { useCallback, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Shape } from '../../shared';
import { ShapeItem } from './ShapeItem';
import { theme } from '../../theme';

interface Props {
  options: Shape[];
  onSelect: (index: number) => void;
  disabled: boolean;
}

function OptionCard({ shape, index, onSelect, disabled }: { shape: Shape; index: number; onSelect: (i: number) => void; disabled: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(index);
  }, [index, disabled, onSelect]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={handlePress} style={[styles.option, disabled && styles.disabled]}>
        <ShapeItem shape={shape} index={0} size={40} />
        <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function OptionsList({ options, onSelect, disabled }: Props) {
  return (
    <View style={styles.grid}>
      {options.map((opt, i) => (
        <OptionCard key={i} shape={opt} index={i} onSelect={onSelect} disabled={disabled} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: theme.spacing.md },
  option: {
    width: 80, height: 90, backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  optionLabel: { color: theme.colors.textDim, fontSize: 11, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});