import React, {
  ForwardedRef,
  MutableRefObject,
  RefAttributes,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { FlatList } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';
import { useLazyContextValues } from './useLazyContextValues';

export interface LazyFlatListMethods {
  scrollToStart: typeof FlatList.prototype.scrollToEnd;
  scrollToEnd: typeof FlatList.prototype.scrollToEnd;
  scrollToIndex: typeof FlatList.prototype.scrollToIndex;
  scrollToOffset: typeof FlatList.prototype.scrollToOffset;
  scrollToItem: typeof FlatList.prototype.scrollToItem;
}

export interface LazyFlatListProps {
  /**
   * How far above or below the bottom of the FlatList the threshold trigger is. Negative is above, postive it below. Accepts [FlatList props](https://reactnative.dev/docs/FlatList).
   * @defaultValue 0 (bottom of Fl)
   */
  offset?: number;
  /**
   * Ref to the LazyFlatList.  Exposes scrollTo, scrollToStart, and scrollToEnd methods.
   */
  ref?: MutableRefObject<LazyFlatListMethods | null>;
  /**
   * When true, console.logs FlatList measurements.  Even if true, will not call console.log in production.
   */
  debug?: boolean;
}

type Props<T> = LazyFlatListProps &
  Omit<
    React.ComponentProps<typeof FlatList<T>>,
    'onLayout' | 'onScroll' | 'ref' | 'CellRendererComponent'
  >;

/**
 * LazyFlatList to wrap Lazy Children in.
 */
const UnwrappedLazyFlatList = <T,>(
  { offset: injectedOffset, debug = false, ...rest }: Props<T>,
  ref: ForwardedRef<LazyFlatListMethods>
) => {
  const _flatListRef = useAnimatedRef<Animated.FlatList<T>>();

  useImperativeHandle(ref, () => ({
    scrollToStart: (options) => {
      _flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: options?.animated,
      });
    },
    scrollToEnd: (options) => {
      _flatListRef.current?.scrollToEnd(options);
    },
    scrollToIndex: (options) => {
      _flatListRef.current?.scrollToIndex(options);
    },
    scrollToOffset: (options) => {
      _flatListRef.current?.scrollToOffset(options);
    },
    scrollToItem: (options) => {
      _flatListRef.current?.scrollToItem(options);
    },
  }));

  const { value, measureScroller } = useLazyContextValues({
    offset: injectedOffset,
    debug,
    horizontal: rest.horizontal,
    // @ts-ignore
    ref: _flatListRef,
  });

  return (
    <AnimatedContext.Provider value={value}>
      <Animated.FlatList
        scrollEventThrottle={16}
        {...rest}
        ref={_flatListRef}
        onLayout={measureScroller}
      />
    </AnimatedContext.Provider>
  );
};

const LazyFlatList = forwardRef(UnwrappedLazyFlatList) as <T>(
  props: Props<T> & RefAttributes<LazyFlatListMethods>
) => React.ReactElement;

export { LazyFlatList };
