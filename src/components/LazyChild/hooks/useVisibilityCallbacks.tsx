import { useCallback } from 'react';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface Props {
  percentVisibleThreshold: number;
  onVisibilityEnter?: () => void;
  onVisibilityExit?: () => void;
  _shouldMeasurePercentVisible: Animated.SharedValue<boolean>;
  _shouldFireVisibilityExit: Animated.SharedValue<boolean>;
  _measurement: Animated.SharedValue<ReturnType<typeof measure>>;
  _ignoreZeroMeasurement: Animated.SharedValue<boolean>;
  _shouldFireEnterOnMount: Animated.SharedValue<boolean>;
  topYValue: Animated.SharedValue<number>;
  bottomYValue: Animated.SharedValue<number>;
}

export const useVisibilityCallbacks = ({
  percentVisibleThreshold,
  onVisibilityEnter,
  onVisibilityExit,
  _shouldMeasurePercentVisible,
  _shouldFireVisibilityExit,
  _measurement,
  _ignoreZeroMeasurement,
  _shouldFireEnterOnMount,
  topYValue,
  bottomYValue,
}: Props) => {
  const _percentVisibleTrigger = useSharedValue(percentVisibleThreshold);
  const _hasFiredOnVisibilityEntered = useSharedValue(false);
  const _hasFiredOnVisibilityExited = useSharedValue(false);

  const handleOnVisibilityEntered = useCallback(
    () => {
      if (onVisibilityEnter && !_hasFiredOnVisibilityEntered.value) {
        _hasFiredOnVisibilityEntered.value = true;
        _hasFiredOnVisibilityExited.value = false;

        if (!_shouldFireVisibilityExit.value) {
          _shouldMeasurePercentVisible.value = false;
        }

        onVisibilityEnter();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
    [onVisibilityEnter]
  );

  const handleOnVisibilityExited = useCallback(
    () => {
      if (
        onVisibilityExit &&
        _hasFiredOnVisibilityEntered.value &&
        !_hasFiredOnVisibilityExited.value
      ) {
        _hasFiredOnVisibilityEntered.value = false;
        _hasFiredOnVisibilityExited.value = true;

        onVisibilityExit();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
    [onVisibilityExit]
  );

  const isVisible = useDerivedValue(() => {
    if (_WORKLET) {
      if (_measurement.value !== null) {
        const topOfView = _measurement.value.pageY;
        const bottomOfView =
          _measurement.value.pageY + _measurement.value.height;

        if (_ignoreZeroMeasurement.value && topOfView === 0) {
          return false;
        }

        const visibilityHeight =
          _measurement.value.height * _percentVisibleTrigger.value;
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
    () => isVisible.value || _shouldFireEnterOnMount.value,
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
};
