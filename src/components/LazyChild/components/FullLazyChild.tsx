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
import { FRAME_MS } from '../../../constants';

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
   * If onLayout returns a height value greater than 0.
   */
  const _canMeasure = useSharedValue(false);
  /**
   * LazyChild view ref.
   */
  const _viewRef = useAnimatedRef<Animated.View>();
  /**
   * Latest measure return.
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

  const _shouldMeasure = useDerivedValue(
    () =>
      _shouldFireThresholdEnter.value ||
      _shouldFireThresholdExit.value ||
      _shouldMeasurePercentVisible.value ||
      _shouldFireVisibilityExit.value
  );

  useAnimatedReaction(
    () => {
      // Track scollValue to make reaction fire.  SCREEN_HEIGHT negative is to generously allow for overscroll.
      if (
        _canMeasure.value &&
        _shouldMeasure.value &&
        scrollValue.value > -SCREEN_HEIGHT
      ) {
        const measurement = measure(_viewRef);

        return measurement;
      }

      return null;
    },
    (measured) => {
      if (measured?.height || measured?.width) {
        _measurement.value = measured;
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
    // Don't measure until we know we have something.  This prevents those pesky Android measurement warnings.
    // https://github.com/software-mansion/react-native-reanimated/blob/d8ef9c27c31dd2c32d4c3a2111326a448bf19ec9/packages/react-native-reanimated/src/platformFunctions/measure.ts#L95
    if (nativeEvent.layout.height > 0) {
      _canMeasure.value = true;
      // Sometimes native measure runs too quick and return 0 on first paint.
      setTimeout(() => {
        runOnUI(() => {
          const measurement = measure(_viewRef);
          if (measurement) {
            _measurement.value = measurement;
          }
        })();
      }, FRAME_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, []);

  return (
    <Animated.View ref={_viewRef} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
}
