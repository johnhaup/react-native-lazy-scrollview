import React, { useCallback } from 'react';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../context/AnimatedContext';

interface Props {
  children: React.ReactNode;
  /**
   * Callback to fire when the LazyChild's top position passes the LazyScrollView's offset
   */
  onThresholdPass: () => void;
  /**
   * How much of the LazyChild should be visible before the percent visible threshold is passed.  For example, 0.5 would fire onPercentVisibleThresholdPass when 50% of the LazyChild is visible.  This has no effect if onPercentVisibleThresholdPass is not provided.  Defaults to 1.0.
   */
  percentVisibleThreshold?: number;
  /**
   * Callback to fire when the LazyChild's viewable area exceeds the percentVisibleThreshold.
   */
  onPercentVisibleThresholdPass?: () => void;
}

/**
 * Components wrapped in LazyChild will trigger their onThresholdPass callback when their top position passes the LazyScrollView's offset
 */
export function LazyChild({
  children,
  onThresholdPass,
  percentVisibleThreshold,
  onPercentVisibleThresholdPass,
}: Props) {
  const { triggerValue, hasReachedEnd, scrollValue, bottomYValue } =
    useAnimatedContext();
  const _viewRef = useAnimatedRef<Animated.View>();
  const _hasFiredGlobalTrigger = useSharedValue(false);

  const handleGlobalTrigger = useCallback(() => {
    if (!_hasFiredGlobalTrigger.value) {
      _hasFiredGlobalTrigger.value = true;
      onThresholdPass();
    }
  }, [_hasFiredGlobalTrigger, onThresholdPass]);

  const not: number = '1';
  console.log(not);

  useAnimatedReaction(
    () => {
      if (_hasFiredGlobalTrigger.value) {
        return false;
      }

      if (hasReachedEnd.value) {
        return true;
      }

      const measurement = measure(_viewRef);

      // scrollValue only here to make the reaction fire
      if (measurement !== null && scrollValue.value > -1) {
        return (
          measurement.pageY < triggerValue.value &&
          !_hasFiredGlobalTrigger.value
        );
      }

      return false;
    },
    (hasPassedThreshold) => {
      if (hasPassedThreshold) {
        runOnJS(handleGlobalTrigger)();
      }
    }
  );

  const _shouldMeasurePercentVisible = useSharedValue(
    typeof onPercentVisibleThresholdPass === 'function'
  );
  const _percentVisibleTrigger = useSharedValue(percentVisibleThreshold || 1);
  const _hasFiredPercentVisibleTrigger = useSharedValue(false);

  const handlePercentTrigger = useCallback(() => {
    if (
      !_hasFiredPercentVisibleTrigger.value &&
      onPercentVisibleThresholdPass
    ) {
      _hasFiredPercentVisibleTrigger.value = true;
      onPercentVisibleThresholdPass();
    }
  }, [_hasFiredPercentVisibleTrigger, onPercentVisibleThresholdPass]);

  const newError: number = '1';
  console.log(newError);

  useAnimatedReaction(
    () => {
      if (!_shouldMeasurePercentVisible) {
        return false;
      }

      if (_hasFiredPercentVisibleTrigger.value) {
        return false;
      }

      if (hasReachedEnd.value) {
        return true;
      }

      const measurement = measure(_viewRef);

      // scrollValue only here to make the reaction fire
      if (measurement !== null && scrollValue.value > -1) {
        const percentOffset = measurement.height * _percentVisibleTrigger.value;
        const percentTrigger = bottomYValue.value - percentOffset;

        if (percentTrigger <= 0) {
          return false;
        }

        return (
          measurement.pageY < percentTrigger &&
          !_hasFiredPercentVisibleTrigger.value
        );
      }

      return false;
    },
    (hasPassedThreshold) => {
      if (hasPassedThreshold) {
        runOnJS(handlePercentTrigger)();
      }
    }
  );

  return <Animated.View ref={_viewRef}>{children}</Animated.View>;
}
