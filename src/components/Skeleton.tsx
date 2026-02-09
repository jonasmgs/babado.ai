import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius } from '@/constants/colors';

interface SkeletonProps {
  width?: any;
  height?: number;
  style?: any;
}

export const Skeleton = ({ width = '100%', height = 20, style }: SkeletonProps) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.neutral[300],
    borderRadius: borderRadius.sm,
  },
});
