import React, { useCallback, useEffect } from 'react';
import { Dimensions, type LayoutChangeEvent } from 'react-native';
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../../../context/AnimatedContext';
import { logger } from '../../../utils/logger';
import { useEnteringCallbacks } from '../hooks/useEnteringCallbacks';
import { useVisibilityCallbacks } from '../hooks/useVisibilityCallbacks';
import { LazyChildProps } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const log = (...args: Parameters<typeof console.log>) => {
  logger.log('<LazyChild>', ...args);
};

export function FullLazyChild({
  children,
  onEnterThresholdPass,
  onExitThresholdPass,
  percentVisibleThreshold = 1,
  onVisibilityEnter,
  onVisibilityExit,
  minimumVisibilityMs,
  debug = false,
}: LazyChildProps) {
  const {
    startTrigger,
    endTrigger,
    scrollValue,
    containerStart,
    containerEnd,
    horizontal,
    isScrollUnmounted,
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

  const _debug = useSharedValue(debug);

  const hasOnEnter = typeof onEnterThresholdPass === 'function';
  const hasOnExit = typeof onExitThresholdPass === 'function';
  const hasOnVisibilityEnter = typeof onVisibilityEnter === 'function';
  const hasOnVisibilityExit = typeof onVisibilityExit === 'function';

  const _hasOnEnterCallback = useSharedValue(hasOnEnter);
  const _hasOnExitCallback = useSharedValue(hasOnExit);
  const _hasOnVisibilityEnterCallback = useSharedValue(hasOnVisibilityEnter);
  const _hasOnVisibilityExitCallback = useSharedValue(hasOnVisibilityExit);

  useEffect(() => {
    _debug.value = debug;
  }, [_debug, debug]);

  // Keyed on presence, not identity: inline callbacks would otherwise reset these every render.
  useEffect(() => {
    _hasOnEnterCallback.value = hasOnEnter;
    _hasOnExitCallback.value = hasOnExit;
    _hasOnVisibilityEnterCallback.value = hasOnVisibilityEnter;
    _hasOnVisibilityExitCallback.value = hasOnVisibilityExit;
  }, [
    _hasOnEnterCallback,
    _hasOnExitCallback,
    _hasOnVisibilityEnterCallback,
    _hasOnVisibilityExitCallback,
    hasOnEnter,
    hasOnExit,
    hasOnVisibilityEnter,
    hasOnVisibilityExit,
  ]);

  const shouldFireThresholdEnter = useDerivedValue(() => {
    return _hasOnEnterCallback.value && !isScrollUnmounted.value;
  });
  const shouldFireThresholdExit = useDerivedValue(() => {
    return _hasOnExitCallback.value && !isScrollUnmounted.value;
  });
  const shouldMeasurePercentVisible = useDerivedValue(() => {
    return _hasOnVisibilityEnterCallback.value && !isScrollUnmounted.value;
  });
  const shouldFireVisibilityExit = useDerivedValue(() => {
    return _hasOnVisibilityExitCallback.value && !isScrollUnmounted.value;
  });

  const _hasValidCallback = useDerivedValue(
    () =>
      shouldFireThresholdEnter.value ||
      shouldFireThresholdExit.value ||
      shouldMeasurePercentVisible.value ||
      shouldFireVisibilityExit.value
  );

  function measureView() {
    'worklet';

    const measurement = measure(_viewRef);

    if (_debug.value) {
      runOnJS(log)('measurement:', measurement);
    }

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
      if (_debug.value) {
        runOnJS(log)('shouldMeasure:', shouldMeasure);
      }

      if (shouldMeasure) {
        measureView();
      }
    }
  );

  useEnteringCallbacks({
    onEnterThresholdPass,
    onExitThresholdPass,
    _measurement,
    shouldFireThresholdEnter,
    shouldFireThresholdExit,
    startTrigger,
    endTrigger,
    horizontal,
  });

  useVisibilityCallbacks({
    percentVisibleThreshold,
    onVisibilityEnter,
    onVisibilityExit,
    shouldMeasurePercentVisible,
    shouldFireVisibilityExit,
    _measurement,
    containerStart,
    containerEnd,
    horizontal,
    minimumVisibilityMs,
  });

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      if (
        _isJsLayoutComplete.value &&
        (!nativeEvent.layout.height || !nativeEvent.layout.width)
      ) {
        _isJsLayoutComplete.value = false;
      }

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
    },
    [_isJsLayoutComplete]
  );

  return (
    <Animated.View ref={_viewRef} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
}
