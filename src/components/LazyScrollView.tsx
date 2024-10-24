import React, {
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';
import { useLazyContextValues } from './useLazyContextValues';

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

    const { value, measureScroller } = useLazyContextValues({
      offset: injectedOffset,
      debug,
      horizontal: rest.horizontal,
      ref: _scrollRef,
    });

    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        {...rest}
        ref={_scrollRef}
        onLayout={measureScroller}
      >
        <AnimatedContext.Provider value={value}>
          {children}
        </AnimatedContext.Provider>
      </Animated.ScrollView>
    );
  }
);

export { LazyScrollView };
