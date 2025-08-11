import React, { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { HORIZONTAL } from '../../constants';
import { Card } from './Card';

export function HorizontalCard() {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: 16,
      transform: [
        { translateX: interpolate(animation.value, [0, 1], [-50, 50]) },
      ],
    };
  });

  return (
    <Card scrollView={HORIZONTAL} animatedStyle={animatedStyle} imageOnBottom />
  );
}
