import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
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
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const transY = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const offset = useSharedValue(injectedOffset || 0);

  const triggerValue = useDerivedValue(
    () => transY.value + containerHeight.value + offset.value
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      transY.value = event.contentOffset.y;
    },
  });

  const onLayout = (e: LayoutChangeEvent) => {
    if (containerHeight.value !== e.nativeEvent.layout.height) {
      containerHeight.value = e.nativeEvent.layout.height;
    }
  };

  return (
    <Animated.ScrollView
      {...rest}
      onLayout={onLayout}
      onScroll={scrollHandler}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <AnimatedContext.Provider value={triggerValue}>
        {children}
      </AnimatedContext.Provider>
    </Animated.ScrollView>
  );
}
