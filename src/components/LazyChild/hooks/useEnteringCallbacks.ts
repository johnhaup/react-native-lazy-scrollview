import { useCallback } from 'react';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

export const useEnteringCallbacks = ({
  onEnterThresholdPass,
  onExitThresholdPass,
  _measurement,
  _ignoreZeroMeasurement,
  _shouldFireThresholdEnter,
  _shouldFireThresholdExit,
  _shouldFireEnterOnMount,
  topTriggerValue,
  bottomTriggerValue,
}: {
  onEnterThresholdPass?: () => void;
  onExitThresholdPass?: () => void;
  _measurement: Animated.SharedValue<ReturnType<typeof measure>>;
  _ignoreZeroMeasurement: Animated.SharedValue<boolean>;
  _shouldFireThresholdEnter: Animated.SharedValue<boolean>;
  _shouldFireThresholdExit: Animated.SharedValue<boolean>;
  _shouldFireEnterOnMount: Animated.SharedValue<boolean>;
  topTriggerValue: Animated.SharedValue<number>;
  bottomTriggerValue: Animated.SharedValue<number>;
}) => {
  const _hasFiredThresholdEntered = useSharedValue(false);
  const _hasFiredThresholdExited = useSharedValue(false);

  const handleThresholdEntered = useCallback(() => {
    if (onEnterThresholdPass && !_hasFiredThresholdEntered.value) {
      _hasFiredThresholdEntered.value = true;
      _hasFiredThresholdExited.value = false;
      onEnterThresholdPass();
    }
  }, [
    _hasFiredThresholdEntered,
    _hasFiredThresholdExited,
    onEnterThresholdPass,
  ]);

  const handleOnThresholdExited = useCallback(() => {
    if (
      onExitThresholdPass &&
      _hasFiredThresholdEntered.value &&
      !_hasFiredThresholdExited.value
    ) {
      _hasFiredThresholdEntered.value = false;
      _hasFiredThresholdExited.value = true;
      onExitThresholdPass();
    }
  }, [
    _hasFiredThresholdEntered,
    _hasFiredThresholdExited,
    onExitThresholdPass,
  ]);

  const isEntering = useDerivedValue(() => {
    if (_WORKLET) {
      if (_measurement.value !== null) {
        const topOfView = _measurement.value.pageY;
        const bottomOfView =
          _measurement.value.pageY + _measurement.value.height;

        if (_ignoreZeroMeasurement.value && topOfView === 0) {
          return false;
        }

        const result =
          topOfView < bottomTriggerValue.value &&
          bottomOfView > topTriggerValue.value;

        return result;
      }
    }

    return false;
  });

  useAnimatedReaction(
    () => isEntering.value || _shouldFireEnterOnMount.value,
    (hasLazyChildEntered) => {
      if (hasLazyChildEntered) {
        if (_shouldFireThresholdEnter.value) {
          runOnJS(handleThresholdEntered)();
        }
      } else {
        if (_shouldFireThresholdExit.value) {
          runOnJS(handleOnThresholdExited)();
        }
      }
    }
  );
};
