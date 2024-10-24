import React, { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { FLATLIST } from '../../constants';
import { Card } from './Card';

export function FlatListCard() {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginRight: 16,
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [-20, 20]) },
      ],
    };
  });

  return <Card scrollView={FLATLIST} animatedStyle={animatedStyle} />;
}
