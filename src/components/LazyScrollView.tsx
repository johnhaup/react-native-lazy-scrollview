import React, {
  MutableRefObject,
  forwardRef,
  useCallback,
  useImperativeHandle,
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
    const _hasProvider = useSharedValue(true);
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

    const topYValue = useSharedValue(StatusBar.currentHeight || 0);
    const bottomYValue = useDerivedValue(
      () => _containerHeight.value + topYValue.value
    );

    const topTriggerValue = useDerivedValue(
      () => topYValue.value - _offset.value
    );
    const bottomTriggerValue = useDerivedValue(
      () => bottomYValue.value + _offset.value
    );

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        _containerHeight.value = e.nativeEvent.layout.height;
        runOnUI(() => {
          const measurement = measure(_scrollRef);
          if (measurement) {
            topYValue.value = measurement.pageY + _statusBarHeight.value;
          }
        })();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
      []
    );

    const onContentContainerLayout = useCallback(
      (e: LayoutChangeEvent) => {
        _contentHeight.value = e.nativeEvent.layout.height;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values do not trigger re-renders
      []
    );

    return (
      <Animated.ScrollView
        horizontal={false}
        scrollEventThrottle={16}
        {...rest}
        ref={_scrollRef}
        onLayout={onLayout}
      >
        <AnimatedContext.Provider
          value={{
            _hasProvider,
            scrollValue,
            topYValue,
            bottomYValue,
            topTriggerValue,
            bottomTriggerValue,
          }}
        >
          <View ref={_wrapperRef} onLayout={onContentContainerLayout}>
            {children}
          </View>
        </AnimatedContext.Provider>
      </Animated.ScrollView>
    );
  }
);

export { LazyScrollView };
