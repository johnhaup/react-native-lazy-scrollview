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
  _enteringBailoutConfig,
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
  _enteringBailoutConfig: Animated.SharedValue<{
    onEnterThresholdPass: boolean;
    onExitThresholdPass: boolean;
  }>;
}) => {
  const _hasFiredThresholdEntered = useSharedValue(false);
  const _hasFiredThresholdExited = useSharedValue(false);

  const handleThresholdEntered = useCallback(() => {
    if (onEnterThresholdPass && !_hasFiredThresholdEntered.value) {
      _hasFiredThresholdEntered.value = true;
      _hasFiredThresholdExited.value = false;

      if (_enteringBailoutConfig.value.onEnterThresholdPass) {
        _shouldFireThresholdEnter.value = false;
      }

      onEnterThresholdPass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, [onEnterThresholdPass]);

  const handleOnThresholdExited = useCallback(() => {
    if (
      onExitThresholdPass &&
      _hasFiredThresholdEntered.value &&
      !_hasFiredThresholdExited.value
    ) {
      _hasFiredThresholdEntered.value = false;
      _hasFiredThresholdExited.value = true;

      if (_enteringBailoutConfig.value.onExitThresholdPass) {
        _shouldFireThresholdExit.value = false;
      }

      onExitThresholdPass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, [onExitThresholdPass]);

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
