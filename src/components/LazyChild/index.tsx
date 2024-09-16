import React, { useCallback } from 'react';
import { Dimensions, type LayoutChangeEvent } from 'react-native';
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useAnimatedContext } from '../../context/AnimatedContext';
import { useEnteringCallbacks } from './hooks/useEnteringCallbacks';
import { useVisibilityCallbacks } from './hooks/useVisibilityCallbacks';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  children: React.ReactNode;
  /**
   * Callback to fire when the LazyChild passes the LazyScrollView's offset after being offscreen
   */
  onEnterThresholdPass?: () => void;
  /**
   * Callback to fire when the LazyChild passes the LazyScrollView's offset after being onscreen
   */
  onExitThresholdPass?: () => void;
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
  // TODO Add way to disable measuring if consumer only wants to use onThresholdPass (for example)
  // disableAfterThresholdPass?: boolean;
}

export function LazyChild({
  children,
  onEnterThresholdPass,
  onExitThresholdPass,
  percentVisibleThreshold = 1,
  ignoreZeroMeasurement = true,
  onVisibilityEnter,
  onVisibilityExit,
}: Props) {
  const {
    topTriggerValue,
    bottomTriggerValue,
    scrollValue,
    topYValue,
    bottomYValue,
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
   * Ignore zero measurement.  Set by consumer.
   */
  const _ignoreZeroMeasurement = useSharedValue(ignoreZeroMeasurement);
  /**
   * Latest measure return.
   */
  const _measurement = useSharedValue<ReturnType<typeof measure>>(null);

  const _shouldFireThresholdEnter = useSharedValue(
    typeof onVisibilityEnter === 'function'
  );
  const _shouldFireThresholdExit = useSharedValue(
    typeof onVisibilityExit === 'function'
  );
  const _shouldMeasurePercentVisible = useSharedValue(
    typeof onVisibilityEnter === 'function'
  );
  const _shouldFireVisibilityExit = useSharedValue(
    typeof onVisibilityExit === 'function'
  );

  /**
   * At least one callback is a function.
   */
  const _shouldMeasure = useDerivedValue(
    () =>
      typeof onEnterThresholdPass === 'function' ||
      typeof onExitThresholdPass === 'function' ||
      typeof onVisibilityEnter === 'function' ||
      typeof onVisibilityExit === 'function'
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
      _measurement.value = measured;
    }
  );

  useEnteringCallbacks({
    onEnterThresholdPass,
    onExitThresholdPass,
    _measurement,
    _ignoreZeroMeasurement,
    _shouldFireThresholdEnter,
    _shouldFireThresholdExit,
    topTriggerValue,
    bottomTriggerValue,
  });

  useVisibilityCallbacks({
    percentVisibleThreshold,
    onVisibilityEnter,
    onVisibilityExit,
    _shouldMeasurePercentVisible,
    _shouldFireVisibilityExit,
    _measurement,
    _ignoreZeroMeasurement,
    topYValue,
    bottomYValue,
  });

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    // Don't measure until we know we have something.  This prevents those pesky Android measurement warnings.
    // https://github.com/software-mansion/react-native-reanimated/blob/d8ef9c27c31dd2c32d4c3a2111326a448bf19ec9/packages/react-native-reanimated/src/platformFunctions/measure.ts#L95
    _canMeasure.value = nativeEvent.layout.height > 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, []);

  return (
    <Animated.View ref={_viewRef} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
}