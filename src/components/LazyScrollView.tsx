import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';

interface Props
  extends Omit<
    React.ComponentProps<typeof Animated.ScrollView>,
    'onLayout' | 'onScroll' | 'ref' | 'scrollEventThrottle'
  > {
  offset?: number;
}

/**
 * @param offset - optional - How far above or below the bottom of the ScrollView the threshold trigger is. Negative is above, postive it below. Defaults to 0 (bottom of ScrollView).
 * @param ...rest - optional - All other props are passed to the underlying ScrollView. onLayout, onScroll, ref, and scrollEventThrottle are all handled internally.
 * @returns ScrollView to wrap you components in.  Components wrapped in LazyChild will trigger their onThresholdPass callback when their top position passes the LazyScrollView's offset
 */

export function LazyScrollView({
  children,
  offset: injectedOffset,
  ...rest
}: Props) {
  const _scrollRef = useAnimatedRef<Animated.ScrollView>();
  const _offset = useSharedValue(injectedOffset || 0);
  const _transY = useSharedValue(0);
  const _containerHeight = useSharedValue(0);
  const _contentHeight = useSharedValue(0);
  const _distanceFromEnd = useDerivedValue(
    () => _contentHeight.value - _transY.value - _containerHeight.value
  );

  const hasReachedEnd = useSharedValue(false);
  const triggerValue = useDerivedValue(
    () => _transY.value + _containerHeight.value + _offset.value
  );

  useAnimatedReaction(
    () => {
      return _contentHeight.value > 0 && _distanceFromEnd.value <= 1;
    },
    (reachedEnd) => {
      if (reachedEnd && !hasReachedEnd.value) {
        hasReachedEnd.value = true;
      }
    }
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      _transY.value = event.contentOffset.y;
      _contentHeight.value = event.contentSize.height;
    },
  });

  const onLayout = (e: LayoutChangeEvent) => {
    _containerHeight.value = e.nativeEvent.layout.height;
  };

  return (
    <Animated.ScrollView
      {...rest}
      onLayout={onLayout}
      onScroll={scrollHandler}
      ref={_scrollRef}
      scrollEventThrottle={16}
    >
      <AnimatedContext.Provider
        value={{
          hasReachedEnd,
          triggerValue,
        }}
      >
        {children}
      </AnimatedContext.Provider>
    </Animated.ScrollView>
  );
}
