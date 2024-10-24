import React, { useCallback, useMemo } from 'react';
import { StatusBar, type LayoutChangeEvent } from 'react-native';
import Animated, {
  AnimatedRef,
  measure,
  runOnJS,
  runOnUI,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { logger } from '../utils/logger';
import { LazyScrollViewProps } from './LazyScrollView';

const log = (...args: Parameters<typeof console.log>) => {
  logger.log('<LazyScrollView>', ...args);
};

type Props = Omit<LazyScrollViewProps, 'ref'> &
  Pick<React.ComponentProps<typeof Animated.ScrollView>, 'horizontal'> & {
    ref: AnimatedRef<Animated.ScrollView>;
  };

/**
 * ScrollView to wrap Lazy Children in.
 */
export const useLazyContextValues = ({
  offset: injectedOffset,
  debug = false,
  horizontal,
  ref,
}: Props) => {
  const _offset = useSharedValue(injectedOffset || 0);
  const _containerDimensions = useSharedValue({ width: 0, height: 0 });
  const _containerCoordinates = useSharedValue({ x: 0, y: 0 });
  const _statusBarHeight = useSharedValue(StatusBar.currentHeight || 0);
  const _debug = useSharedValue(debug);
  const _horizontal = useSharedValue(!!horizontal);

  /**
   * Starts at 0 and increases as the user scrolls down
   */
  const scrollValue = useScrollViewOffset(ref);

  const containerStart = useDerivedValue(() =>
    _horizontal.value
      ? _containerCoordinates.value.x
      : _containerCoordinates.value.y
  );
  const containerEnd = useDerivedValue(
    () =>
      (_horizontal.value
        ? _containerDimensions.value.width
        : _containerDimensions.value.height) + containerStart.value
  );

  const startTrigger = useDerivedValue(
    () => containerStart.value - _offset.value
  );
  const endTrigger = useDerivedValue(() => containerEnd.value + _offset.value);

  const measureScroller = useCallback(
    (e: LayoutChangeEvent) => {
      _containerDimensions.value = {
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width,
      };

      if (debug) {
        log('dimensions:', {
          height: _containerDimensions.value.height,
          width: _containerDimensions.value.width,
        });
      }

      // onLayout runs when RN finishes render, but native layout may not be fully settled until the next frame.
      requestAnimationFrame(() => {
        runOnUI(() => {
          'worklet';
          const measurement = measure(ref);

          if (measurement) {
            const coordinates = {
              x: measurement.pageX,
              y: measurement.pageY + _statusBarHeight.value,
            };

            if (_debug.value) {
              runOnJS(log)('coordinates:', coordinates);
            }

            _containerCoordinates.value = coordinates;
          }
        })();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
    []
  );

  const value = useMemo(
    () => ({
      _hasProvider: true,
      scrollValue,
      containerStart,
      containerEnd,
      startTrigger,
      endTrigger,
      horizontal: _horizontal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
    []
  );

  return { value, measureScroller };
};
