import React, { useContext } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedContext = React.createContext({ value: 0 });

export function LazyChild({
  children,
  onThresholdPass,
}: {
  children: React.ReactNode;
  onThresholdPass: () => void;
}) {
  const threshold = useContext(AnimatedContext);
  const animatedY = useSharedValue(0);
  const hasFiredTrigger = useSharedValue(false);

  const handleTrigger = () => {
    if (!hasFiredTrigger.value) {
      hasFiredTrigger.value = true;
      onThresholdPass();
    }
  };

  useAnimatedReaction(
    () => {
      return threshold.value > animatedY.value;
    },
    (hasPassedThreshold) => {
      if (hasPassedThreshold) {
        runOnJS(handleTrigger)();
      }
    }
  );

  const onLayout = (e: LayoutChangeEvent) => {
    if (animatedY.value !== e.nativeEvent.layout.y) {
      animatedY.value = e.nativeEvent.layout.y;
    }
  };

  return <Animated.View onLayout={onLayout}>{children}</Animated.View>;
}

export function LazyScrollView({
  children,
  offset: injectedOffset,
}: {
  children: React.ReactNode[];
  offset?: number;
}) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const transY = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const offset = useSharedValue(injectedOffset || 0);

  const scrollValue = useDerivedValue(
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
      showsHorizontalScrollIndicator={false}
    >
      <AnimatedContext.Provider value={scrollValue}>
        {children}
      </AnimatedContext.Provider>
    </Animated.ScrollView>
  );
}
