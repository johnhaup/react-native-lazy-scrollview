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
  runOnUI,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';

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
  ({ children, offset: injectedOffset, ...rest }, ref) => {
    const _scrollRef = useAnimatedRef<Animated.ScrollView>();
    const _wrapperRef = useRef<View>(null);
    const _offset = useSharedValue(injectedOffset || 0);
    const _containerHeight = useSharedValue(0);
    const _contentHeight = useSharedValue(0);
    const _statusBarHeight = useSharedValue(StatusBar.currentHeight || 0);

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

    const containerStart = useSharedValue(StatusBar.currentHeight || 0);
    const containerEnd = useDerivedValue(
      () => _containerHeight.value + containerStart.value
    );

    const startTrigger = useDerivedValue(
      () => containerStart.value - _offset.value
    );
    const endTrigger = useDerivedValue(
      () => containerEnd.value + _offset.value
    );

    const measureScrollView = useCallback(
      (e: LayoutChangeEvent) => {
        _containerHeight.value = e.nativeEvent.layout.height;
        try {
          // @ts-ignore measureInWindow is available on the direct ref
          // Add failure fallback because incorrect typings scare me
          _scrollRef.current?.measureInWindow((_: number, y: number) => {
            containerStart.value = y + _statusBarHeight.value;
          });
        } catch (err) {
          setTimeout(() => {
            runOnUI(() => {
              const measurement = measure(_scrollRef);
              if (measurement) {
                containerStart.value =
                  measurement.pageY + _statusBarHeight.value;
              }
            })();
          }, 25);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
      []
    );

    const measureContent = useCallback(
      (e: LayoutChangeEvent) => {
        _contentHeight.value = e.nativeEvent.layout.height;
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
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
      []
    );

    return (
      <Animated.ScrollView
        horizontal={false}
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
