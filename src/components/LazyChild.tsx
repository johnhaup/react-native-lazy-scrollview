import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../context/AnimatedContext';

/**
 * @param onThresholdPass - callback to fire when the LazyChild's top position passes the LazyScrollView's offset
 * @returns Wrapper component to wrap your components in.  Components wrapped in LazyChild will trigger their onThresholdPass callback when their top position passes the LazyScrollView's offset
 */

export function LazyChild({
  children,
  onThresholdPass,
}: {
  children: React.ReactNode;
  onThresholdPass: () => void;
}) {
  const threshold = useAnimatedContext();
  const animatedY = useSharedValue(0);
  const hasFiredTrigger = useSharedValue(false);

  const handleTrigger = () => {
    if (!hasFiredTrigger.value) {
      hasFiredTrigger.value = true;
      onThresholdPass();
    }
  };

  useAnimatedReaction(
    () => {
      return threshold.value > animatedY.value;
    },
    (hasPassedThreshold) => {
      if (hasPassedThreshold) {
        runOnJS(handleTrigger)();
      }
    }
  );

  const onLayout = (e: LayoutChangeEvent) => {
    if (animatedY.value !== e.nativeEvent.layout.y) {
      animatedY.value = e.nativeEvent.layout.y;
    }
  };

  return <Animated.View onLayout={onLayout}>{children}</Animated.View>;
}
