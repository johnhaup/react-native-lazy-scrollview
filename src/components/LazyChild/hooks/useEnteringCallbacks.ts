import { useCallback } from 'react';
import {
  SharedValue,
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
  _shouldFireThresholdEnter,
  _shouldFireThresholdExit,
  startTrigger,
  endTrigger,
  horizontal,
}: {
  onEnterThresholdPass?: () => void;
  onExitThresholdPass?: () => void;
  _measurement: SharedValue<ReturnType<typeof measure>>;
  _shouldFireThresholdEnter: SharedValue<boolean>;
  _shouldFireThresholdExit: SharedValue<boolean>;
  startTrigger: Pick<SharedValue<number>, 'value'>;
  endTrigger: Pick<SharedValue<number>, 'value'>;
  horizontal: Pick<SharedValue<boolean>, 'value'>;
}) => {
  const _hasFiredThresholdEntered = useSharedValue(false);
  const _hasFiredThresholdExited = useSharedValue(false);

  const handleThresholdEntered = useCallback(() => {
    if (onEnterThresholdPass && !_hasFiredThresholdEntered.value) {
      _hasFiredThresholdEntered.value = true;
      _hasFiredThresholdExited.value = false;

      if (!_shouldFireThresholdExit.value) {
        // Enter callback has fired and there is no exit callback, so it cannot refire.  Set shouldFire to false to prevent unnecessary measures.
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

      onExitThresholdPass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
  }, [onExitThresholdPass]);

  const _hasEntered = useDerivedValue(() => {
    if (_measurement.value !== null) {
      const { pageX, pageY, width, height } = _measurement.value;
      const startOfView = horizontal.value ? pageX : pageY;
      const endOfView = startOfView + (horizontal.value ? width : height);

      const result =
        startOfView < endTrigger.value && endOfView > startTrigger.value;

      return result;
    }

    return false;
  });

  useAnimatedReaction(
    () => _hasEntered.value,
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
