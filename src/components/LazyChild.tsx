import React, { useCallback } from 'react';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../context/AnimatedContext';
import { Platform } from 'react-native';

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
  /**
   * Protects against firing callback on measurement with zero value.  Default is true.  Good to set to false if you know the LazyChild is the first item in the LazyScrollview.
   */
  ignoreZeroMeasurement?: boolean;
}

/**
 * Components wrapped in LazyChild will trigger their onThresholdPass callback when their top position passes the LazyScrollView's offset
 */
export function LazyChild({
  children,
  onThresholdPass,
  percentVisibleThreshold = 1,
  onPercentVisibleThresholdPass,
  ignoreZeroMeasurement = true,
}: Props) {
  const { triggerValue, hasReachedEnd, scrollValue, bottomYValue } =
    useAnimatedContext();

  const _viewRef = useAnimatedRef<Animated.View>();
  const _hasFiredScrollViewThresholdTrigger = useSharedValue(false);
  const _ignoreZeroMeasurement = useSharedValue(ignoreZeroMeasurement);
  const _isAndroid = useSharedValue(Platform.OS === 'android');
  const _canMeasure = useDerivedValue(
    // https://github.com/software-mansion/react-native-reanimated/issues/5006#issuecomment-1826495797
    // Running same check on iOS sometimes causes the view to not be measured
    () => !_isAndroid.value || (_viewRef.current && _isAndroid.value)
  );

  const handleScrollViewThresholdPass = useCallback(() => {
    if (!_hasFiredScrollViewThresholdTrigger.value) {
      _hasFiredScrollViewThresholdTrigger.value = true;
      onThresholdPass();
    }
  }, [_hasFiredScrollViewThresholdTrigger, onThresholdPass]);

  useAnimatedReaction(
    () => {
      if (_hasFiredScrollViewThresholdTrigger.value) {
        return false;
      }

      if (hasReachedEnd.value) {
        return true;
      }

      if (!_canMeasure) {
        return false;
      }

      const measurement = measure(_viewRef);

      // Track scollValue to make reaction fire
      if (measurement !== null && scrollValue.value > -1) {
        if (_ignoreZeroMeasurement.value && measurement.pageY === 0) {
          return false;
        }

        return (
          measurement.pageY < triggerValue.value &&
          !_hasFiredScrollViewThresholdTrigger.value
        );
      }

      return false;
    },
    (shouldFireScrollViewTrigger) => {
      if (shouldFireScrollViewTrigger) {
        runOnJS(handleScrollViewThresholdPass)();
      }
    }
  );

  const _shouldMeasurePercentVisible = useSharedValue(
    typeof onPercentVisibleThresholdPass === 'function'
  );
  const _percentVisibleTrigger = useSharedValue(percentVisibleThreshold);
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

      if (!_canMeasure) {
        return false;
      }

      const measurement = measure(_viewRef);

      // Track scollValue to make reaction fire
      if (measurement !== null && scrollValue.value > -1) {
        if (_ignoreZeroMeasurement.value && measurement.pageY === 0) {
          return false;
        }

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
    (shouldFirePercentTrigger) => {
      if (shouldFirePercentTrigger) {
        runOnJS(handlePercentTrigger)();
      }
    }
  );

  return <Animated.View ref={_viewRef}>{children}</Animated.View>;
}
