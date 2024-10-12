import { useCallback } from 'react';
import {
  SharedValue,
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
  _shouldMeasurePercentVisible: SharedValue<boolean>;
  _shouldFireVisibilityExit: SharedValue<boolean>;
  _measurement: SharedValue<ReturnType<typeof measure>>;
  _ignoreZeroMeasurement: SharedValue<boolean>;
  containerStart: Pick<SharedValue<number>, 'value'>;
  containerEnd: Pick<SharedValue<number>, 'value'>;
  horizontal: Pick<SharedValue<boolean>, 'value'>;
}

export const useVisibilityCallbacks = ({
  percentVisibleThreshold,
  onVisibilityEnter,
  onVisibilityExit,
  _shouldMeasurePercentVisible,
  _shouldFireVisibilityExit,
  _measurement,
  _ignoreZeroMeasurement,
  containerStart,
  containerEnd,
  horizontal,
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
    if (_measurement.value !== null) {
      const { pageX, pageY, width, height } = _measurement.value;
      const startOfView = horizontal.value ? pageX : pageY;
      const endOfView = startOfView + (horizontal.value ? width : height);

      if (_ignoreZeroMeasurement.value && startOfView === 0) {
        return false;
      }

      const visibilitySize = height * _percentVisibleTrigger.value;
      const visibleEnterTrigger = containerEnd.value - visibilitySize;
      const visibleExitTrigger = containerStart.value + visibilitySize;

      if (visibleEnterTrigger <= 0) {
        return false;
      }

      return (
        startOfView < visibleEnterTrigger && endOfView > visibleExitTrigger
      );
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
};
