import React, { useCallback } from 'react';
import { Dimensions, type LayoutChangeEvent } from 'react-native';
import Animated, {
  measure,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../../../context/AnimatedContext';
import { useEnteringCallbacks } from '../hooks/useEnteringCallbacks';
import { useVisibilityCallbacks } from '../hooks/useVisibilityCallbacks';
import { LazyChildProps } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function FullLazyChild({
  children,
  onEnterThresholdPass,
  onExitThresholdPass,
  percentVisibleThreshold = 1,
  onVisibilityEnter,
  onVisibilityExit,
}: LazyChildProps) {
  const {
    startTrigger,
    endTrigger,
    scrollValue,
    containerStart,
    containerEnd,
    horizontal,
  } = useAnimatedContext();

  /**
   * If onLayout returns a height or width value greater than 0.
   */
  const _isJsLayoutComplete = useSharedValue(false);
  /**
   * LazyChild view ref.
   */
  const _viewRef = useAnimatedRef<Animated.View>();
  /**
   * Latest valid measure return or null.
   */
  const _measurement = useSharedValue<ReturnType<typeof measure>>(null);

  const _shouldFireThresholdEnter = useSharedValue(
    typeof onEnterThresholdPass === 'function'
  );
  const _shouldFireThresholdExit = useSharedValue(
    typeof onExitThresholdPass === 'function'
  );
  const _shouldMeasurePercentVisible = useSharedValue(
    typeof onVisibilityEnter === 'function'
  );
  const _shouldFireVisibilityExit = useSharedValue(
    typeof onVisibilityExit === 'function'
  );

  const _hasValidCallback = useDerivedValue(
    () =>
      _shouldFireThresholdEnter.value ||
      _shouldFireThresholdExit.value ||
      _shouldMeasurePercentVisible.value ||
      _shouldFireVisibilityExit.value
  );

  function measureView() {
    'worklet';
    const measurement = measure(_viewRef);

    if (measurement && (measurement?.height || measurement?.width)) {
      _measurement.value = measurement;
    }
  }

  useAnimatedReaction(
    () => {
      // Track scollValue to make reaction fire.  SCREEN_HEIGHT negative is to generously allow for overscroll.
      return (
        _isJsLayoutComplete.value &&
        _hasValidCallback.value &&
        scrollValue.value > -SCREEN_HEIGHT
      );
    },
    (shouldMeasure) => {
      if (shouldMeasure) {
        measureView();
      }
    }
  );

  useEnteringCallbacks({
    onEnterThresholdPass,
    onExitThresholdPass,
    _measurement,
    _shouldFireThresholdEnter,
    _shouldFireThresholdExit,
    startTrigger,
    endTrigger,
    horizontal,
  });

  useVisibilityCallbacks({
    percentVisibleThreshold,
    onVisibilityEnter,
    onVisibilityExit,
    _shouldMeasurePercentVisible,
    _shouldFireVisibilityExit,
    _measurement,
    containerStart,
    containerEnd,
    horizontal,
  });

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    // Don't measure until we know we have something.
    if (nativeEvent.layout.height > 0 || nativeEvent.layout.width > 0) {
      // onLayout runs when RN finishes render, but native layout may not be fully settled until the next frame.
      requestAnimationFrame(() => {
        runOnUI(() => {
          'worklet';
          _isJsLayoutComplete.value = true;
        })();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, []);

  return (
    <Animated.View ref={_viewRef} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
}
