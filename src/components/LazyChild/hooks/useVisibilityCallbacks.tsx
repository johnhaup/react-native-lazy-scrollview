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
  shouldMeasurePercentVisible: SharedValue<boolean>;
  shouldFireVisibilityExit: SharedValue<boolean>;
  _measurement: SharedValue<ReturnType<typeof measure>>;
  containerStart: Pick<SharedValue<number>, 'value'>;
  containerEnd: Pick<SharedValue<number>, 'value'>;
  horizontal: Pick<SharedValue<boolean>, 'value'>;
}

export const useVisibilityCallbacks = ({
  percentVisibleThreshold,
  onVisibilityEnter,
  onVisibilityExit,
  shouldMeasurePercentVisible,
  shouldFireVisibilityExit,
  _measurement,
  containerStart,
  containerEnd,
  horizontal,
}: Props) => {
  const _percentVisibleTrigger = useSharedValue(percentVisibleThreshold);
  const _hasFiredOnVisibilityEntered = useSharedValue(false);
  const _hasFiredOnVisibilityExited = useSharedValue(false);

  const handleOnVisibilityEntered = useCallback(() => {
    if (onVisibilityEnter && !_hasFiredOnVisibilityEntered.value) {
      _hasFiredOnVisibilityEntered.value = true;
      _hasFiredOnVisibilityExited.value = false;

      if (!shouldFireVisibilityExit.value) {
        // Enter callback has fired and there is no exit callback, so it cannot refire.  Set shouldFire to false to prevent unnecessary measures.
        shouldMeasurePercentVisible.value = false;
      }

      onVisibilityEnter();
    }
  }, [
    _hasFiredOnVisibilityEntered,
    _hasFiredOnVisibilityExited,
    onVisibilityEnter,
    shouldFireVisibilityExit,
    shouldMeasurePercentVisible,
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

  const _isVisible = useDerivedValue(() => {
    if (_measurement.value !== null) {
      const { pageX, pageY, width, height } = _measurement.value;
      const startOfView = horizontal.value ? pageX : pageY;
      const endOfView = startOfView + (horizontal.value ? width : height);

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
    () => _isVisible.value,
    (isLazyChildVisible) => {
      if (isLazyChildVisible) {
        if (shouldMeasurePercentVisible.value) {
          runOnJS(handleOnVisibilityEntered)();
        }
      } else {
        if (shouldFireVisibilityExit.value) {
          runOnJS(handleOnVisibilityExited)();
        }
      }
    }
  );
};
