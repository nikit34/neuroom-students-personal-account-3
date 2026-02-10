import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.borderLight,
  height = 8,
}: ProgressBarProps) {
  return (
    <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
