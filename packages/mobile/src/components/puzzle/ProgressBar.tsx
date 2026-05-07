import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { DIFFICULTY } from '@logiclike/shared';

interface Props {
  running: boolean;
  onTimeout: () => void;
}

export function ProgressBar({ running, onTimeout }: Props) {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (running) {
      progress.setValue(1);
      Animated.timing(progress, {
        toValue: 0,
        duration: DIFFICULTY.TIME_PER_ROUND_MS,
        useNativeDriver: false,
      }).start();
      const timer = setTimeout(onTimeout, DIFFICULTY.TIME_PER_ROUND_MS);
      return () => clearTimeout(timer);
    } else {
      progress.setValue(1);
    }
  }, [running]);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const colorInterpolation = progress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [theme.colors.danger, theme.colors.danger, theme.colors.accent],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthInterpolation, backgroundColor: colorInterpolation }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: theme.spacing.md,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});