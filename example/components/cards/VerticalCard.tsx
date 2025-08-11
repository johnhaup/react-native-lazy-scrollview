import React, { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { VERTICAL } from '../../constants';
import { Card } from './Card';

export function VerticalCard() {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginRight: 16,
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [-20, 20]) },
      ],
    };
  });

  return <Card scrollView={VERTICAL} animatedStyle={animatedStyle} />;
}
