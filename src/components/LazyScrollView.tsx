import React, { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';

export function LazyScrollView({
  children,
  offset: injectedOffset,
}: {
  children: ReactNode | ReactNode[];
  offset?: number;
}) {
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
      ref={scrollRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onLayout={onLayout}
    >
      <AnimatedContext.Provider value={triggerValue}>
        {children}
      </AnimatedContext.Provider>
    </Animated.ScrollView>
  );
}
