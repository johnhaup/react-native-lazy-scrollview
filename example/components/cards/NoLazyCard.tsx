import { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { NO_LAZY } from '../../constants';
import { Card } from './Card';

export function NoLazyCard() {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 2000 }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginRight: 16,
      transform: [
        { rotate: `${interpolate(animation.value, [0, 1], [0, 360])}deg` },
      ],
    };
  });

  return <Card scrollView={NO_LAZY} animatedStyle={animatedStyle} />;
}
