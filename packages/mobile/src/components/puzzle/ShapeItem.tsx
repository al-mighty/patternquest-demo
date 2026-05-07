import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Polygon, Path } from 'react-native-svg';
import type { Shape } from '@logiclike/shared';

interface Props {
  shape: Shape;
  index: number;
  size?: number;
}

function ShapeSvg({ type, color, size }: { type: string; color: string; size: number }) {
  const half = size / 2;
  const pad = 2;
  const r = half - pad;

  switch (type) {
    case 'circle':
      return (
        <Svg width={size} height={size}>
          <Circle cx={half} cy={half} r={r} fill={color} opacity={0.9} />
          <Circle cx={half} cy={half} r={r} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
        </Svg>
      );
    case 'square':
      return (
        <Svg width={size} height={size}>
          <Rect x={pad} y={pad} width={size - pad * 2} height={size - pad * 2} rx={4} fill={color} opacity={0.9} />
        </Svg>
      );
    case 'triangle':
      return (
        <Svg width={size} height={size}>
          <Polygon points={`${half},${pad} ${size - pad},${size - pad} ${pad},${size - pad}`} fill={color} opacity={0.9} />
        </Svg>
      );
    case 'star': {
      const cx = half, cy = half;
      const outerR = r, innerR = r * 0.4;
      const points = [];
      for (let i = 0; i < 5; i++) {
        const outerAngle = (Math.PI / 2) + (i * 2 * Math.PI / 5);
        const innerAngle = outerAngle + Math.PI / 5;
        points.push(`${cx + outerR * Math.cos(outerAngle)},${cy - outerR * Math.sin(outerAngle)}`);
        points.push(`${cx + innerR * Math.cos(innerAngle)},${cy - innerR * Math.sin(innerAngle)}`);
      }
      return (
        <Svg width={size} height={size}>
          <Polygon points={points.join(' ')} fill={color} opacity={0.9} />
        </Svg>
      );
    }
    case 'hexagon': {
      const cx = half, cy = half;
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 6) + (i * Math.PI / 3);
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <Svg width={size} height={size}>
          <Polygon points={points.join(' ')} fill={color} opacity={0.9} />
        </Svg>
      );
    }
    default:
      return (
        <Svg width={size} height={size}>
          <Rect x={pad} y={pad} width={size - pad * 2} height={size - pad * 2} fill={color} />
        </Svg>
      );
  }
}

function ShapeItemInner({ shape, index, size = 50 }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0);
    Animated.spring(scale, {
      toValue: 1,
      delay: index * 80,
      useNativeDriver: true,
      damping: 12,
      mass: 1,
      stiffness: 150,
    } as any).start();
  }, [shape.type, shape.color]);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <ShapeSvg type={shape.type} color={shape.color} size={size} />
    </Animated.View>
  );
}

export const ShapeItem = memo(ShapeItemInner, (prev, next) =>
  prev.shape.type === next.shape.type &&
  prev.shape.color === next.shape.color &&
  prev.shape.size === next.shape.size &&
  prev.shape.rotation === next.shape.rotation,
);

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', margin: 6 },
});