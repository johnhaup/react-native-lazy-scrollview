import React, {
  MutableRefObject,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';
import { logger } from '../utils/logger';

const log = (...args: Parameters<typeof console.log>) => {
  logger.log('<LazyScrollView>', ...args);
};

export interface LazyScrollViewMethods {
  scrollTo: typeof ScrollView.prototype.scrollTo;
  scrollToStart: typeof ScrollView.prototype.scrollToEnd;
  scrollToEnd: typeof ScrollView.prototype.scrollToEnd;
}

export interface LazyScrollViewProps {
  /**
   * How far above or below the bottom of the ScrollView the threshold trigger is. Negative is above, postive it below. Accepts [ScrollView props](https://reactnative.dev/docs/scrollview).
   * @defaultValue 0 (bottom of ScrollView)
   */
  offset?: number;
  /**
   * Ref to the LazyScrollView.  Exposes scrollTo, scrollToStart, and scrollToEnd methods.
   */
  ref?: MutableRefObject<LazyScrollViewMethods>;
  /**
   * When true, console.logs scrollview measurements.  Even if true, will not call console.log in production.
   */
  debug?: boolean;
}

type Props = LazyScrollViewProps &
  Omit<
    React.ComponentProps<typeof Animated.ScrollView>,
    'onLayout' | 'onScroll' | 'ref'
  >;

/**
 * ScrollView to wrap Lazy Children in.
 */
const LazyScrollView = forwardRef<LazyScrollViewMethods, Props>(
  ({ children, offset: injectedOffset, debug = false, ...rest }, ref) => {
    const _scrollRef = useAnimatedRef<Animated.ScrollView>();
    const _wrapperRef = useRef<View>(null);
    const _offset = useSharedValue(injectedOffset || 0);
    const _containerDimensions = useSharedValue({ width: 0, height: 0 });
    const _containerCoordinates = useSharedValue({ x: 0, y: 0 });
    const _contentDimensions = useSharedValue({ width: 0, height: 0 });
    const _statusBarHeight = useSharedValue(StatusBar.currentHeight || 0);
    const _debug = useSharedValue(debug);
    const horizontal = useSharedValue(!!rest.horizontal);

    useImperativeHandle(ref, () => ({
      scrollTo: (options) => {
        _scrollRef.current?.scrollTo(options);
      },
      scrollToStart: (options) => {
        _scrollRef.current?.scrollTo({
          x: 0,
          y: 0,
          animated: options?.animated,
        });
      },
      scrollToEnd: (options) => {
        _scrollRef.current?.scrollToEnd(options);
      },
    }));

    /**
     * Starts at 0 and increases as the user scrolls down
     */
    const scrollValue = useScrollViewOffset(_scrollRef);

    const containerStart = useDerivedValue(() =>
      horizontal.value
        ? _containerCoordinates.value.x
        : _containerCoordinates.value.y
    );
    const containerEnd = useDerivedValue(
      () =>
        (horizontal.value
          ? _containerDimensions.value.width
          : _containerDimensions.value.height) + containerStart.value
    );

    const startTrigger = useDerivedValue(
      () => containerStart.value - _offset.value
    );
    const endTrigger = useDerivedValue(
      () => containerEnd.value + _offset.value
    );

    const measureScrollView = useCallback(
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
            const measurement = measure(_scrollRef);

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

    const measureContent = useCallback(
      (e: LayoutChangeEvent) => {
        const dimensions = {
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        };

        if (debug) {
          log('content dimensions:', dimensions);
        }

        _contentDimensions.value = dimensions;
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
        horizontal,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
      []
    );

    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        {...rest}
        ref={_scrollRef}
        onLayout={measureScrollView}
      >
        <AnimatedContext.Provider value={value}>
          <View ref={_wrapperRef} onLayout={measureContent}>
            {children}
          </View>
        </AnimatedContext.Provider>
      </Animated.ScrollView>
    );
  }
);

export { LazyScrollView };
