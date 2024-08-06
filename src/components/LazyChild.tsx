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
  onVisibilityEnter?: () => void;
  /**
   * Callback to fire when the LazyChild's viewable area goes under the percentVisibleThreshold after being above it.
   */
  onVisibilityExit?: () => void;
  /**
   * Protects against firing callback on measurement with zero value.  Default is true.  Good to set to false if you know the LazyChild is the first item in the LazyScrollview.
   */
  // TODO Is there a way to use height here?  I know this is re: 0 as a Y measurement and the issue is with the views all starting at 0.  Need a more reliable way to check if the view is at the top of the scrollview or hasn't rendered properly yet.
  ignoreZeroMeasurement?: boolean;
}

/**
 * Components wrapped in LazyChild will trigger their onThresholdPass callback when their top position passes the LazyScrollView's offset
 */
export function LazyChild({
  children,
  onThresholdPass,
  percentVisibleThreshold = 1,
  ignoreZeroMeasurement = true,
  onVisibilityEnter,
  onVisibilityExit,
}: Props) {
  const { triggerValue, hasReachedEnd, scrollValue, topYValue, bottomYValue } =
    useAnimatedContext();

  const _viewRef = useAnimatedRef<Animated.View>();
  const _hasFiredScrollViewThresholdTrigger = useSharedValue(false);
  const _ignoreZeroMeasurement = useSharedValue(ignoreZeroMeasurement);

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
    typeof onVisibilityEnter === 'function'
  );
  const _shouldFireVisibilityExit = useSharedValue(
    typeof onVisibilityExit === 'function'
  );
  const _percentVisibleTrigger = useSharedValue(percentVisibleThreshold);
  const _hasFiredOnVisibilityEntered = useSharedValue(false);
  const _hasFiredOnVisibilityExited = useSharedValue(false);

  const handleOnVisibilityEntered = useCallback(() => {
    if (onVisibilityEnter && !_hasFiredOnVisibilityEntered.value) {
      _hasFiredOnVisibilityEntered.value = true;
      _hasFiredOnVisibilityExited.value = false;
      onVisibilityEnter();
    }
  }, [
    _hasFiredOnVisibilityEntered,
    _hasFiredOnVisibilityExited,
    onVisibilityEnter,
  ]);

  const handleOnVisibilityExited = useCallback(() => {
    if (
      onVisibilityExit &&
      _hasFiredOnVisibilityEntered.value &&
      !_hasFiredOnVisibilityExited.value
    ) {
      _hasFiredOnVisibilityEntered.value = false;
      _hasFiredOnVisibilityExited.value = true;
      onVisibilityExit();
    }
  }, [
    _hasFiredOnVisibilityEntered,
    _hasFiredOnVisibilityExited,
    onVisibilityExit,
  ]);

  const isVisible = useDerivedValue(() => {
    if (_WORKLET) {
      const measurement = measure(_viewRef);

      // Track scollValue to make reaction fire
      if (measurement !== null && scrollValue.value > -1) {
        const topOfView = measurement.pageY;
        const bottomOfView = measurement.pageY + measurement.height;

        if (_ignoreZeroMeasurement.value && topOfView === 0) {
          return false;
        }

        const visibilityHeight =
          measurement.height * _percentVisibleTrigger.value;
        const visibleEnterTrigger = bottomYValue.value - visibilityHeight;
        const visibleExitTrigger = topYValue.value + visibilityHeight;

        if (visibleEnterTrigger <= 0) {
          return false;
        }

        return (
          topOfView < visibleEnterTrigger && bottomOfView > visibleExitTrigger
        );
      }
    }

    return false;
  });

  useAnimatedReaction(
    () => isVisible.value,
    (isLazyChildVisible) => {
      if (isLazyChildVisible) {
        if (_shouldMeasurePercentVisible.value) {
          runOnJS(handleOnVisibilityEntered)();
        }
      } else {
        if (_shouldFireVisibilityExit.value) {
          runOnJS(handleOnVisibilityExited)();
        }
      }
    }
  );

  return (
    // https://github.com/software-mansion/react-native-reanimated/blob/d8ef9c27c31dd2c32d4c3a2111326a448bf19ec9/packages/react-native-reanimated/src/platformFunctions/measure.ts#L56
    <Animated.View ref={_viewRef} collapsable={false}>
      {children}
    </Animated.View>
  );
}
