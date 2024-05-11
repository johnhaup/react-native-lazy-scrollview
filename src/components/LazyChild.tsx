import React, { useCallback } from 'react';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
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
  const { triggerValue, hasReachedEnd, scrollValue } = useAnimatedContext();
  const _viewRef = useAnimatedRef<Animated.View>();
  const hasFiredTrigger = useSharedValue(false);

  const handleTrigger = useCallback(() => {
    if (!hasFiredTrigger.value) {
      hasFiredTrigger.value = true;
      onThresholdPass();
    }
  }, [hasFiredTrigger, onThresholdPass]);

  useAnimatedReaction(
    () => {
      const measurement = measure(_viewRef);

      if (hasReachedEnd.value) {
        return true;
      }

      // scrollValue only here to make the reactoin fire
      if (measurement !== null && scrollValue.value > -1) {
        return measurement.pageY < triggerValue.value && !hasFiredTrigger.value;
      }

      return false;
    },
    (hasPassedThreshold) => {
      if (hasPassedThreshold) {
        runOnJS(handleTrigger)();
      }
    }
  );

  return <Animated.View ref={_viewRef}>{children}</Animated.View>;
}
