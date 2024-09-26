import React, { useCallback, useRef } from 'react';
import { StatusBar, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimatedContext } from '../context/AnimatedContext';

export interface LazyScrollViewProps {
  /**
   * How far above or below the bottom of the ScrollView the threshold trigger is. Negative is above, postive it below. Accepts [ScrollView props](https://reactnative.dev/docs/scrollview).
   * @defaultValue 0 (bottom of ScrollView)
   */
  offset?: number;
}

type Props = LazyScrollViewProps &
  Omit<
    React.ComponentProps<typeof Animated.ScrollView>,
    'onLayout' | 'onScroll' | 'ref' | 'scrollEventThrottle'
  >;

/**
 * ScrollView to wrap Lazy Children in.
 */
export function LazyScrollView({
  children,
  offset: injectedOffset,
  ...rest
}: Props) {
  const _scrollRef = useAnimatedRef<Animated.ScrollView>();
  const _wrapperRef = useRef<View>(null);
  const _offset = useSharedValue(injectedOffset || 0);
  const _containerHeight = useSharedValue(0);
  const _contentHeight = useSharedValue(0);

  /**
   * Starts at 0 and increases as the user scrolls down
   */
  const scrollValue = useScrollViewOffset(_scrollRef);

  const topYValue = useSharedValue(0);
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
      _wrapperRef.current?.measureInWindow(
        (_: number, y: number, _2: number, height: number) => {
          topYValue.value = y + (StatusBar.currentHeight || 0);
          _contentHeight.value = height;
        }
      );
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
      {...rest}
      ref={_scrollRef}
      scrollEventThrottle={16}
      onLayout={onLayout}
      horizontal={false}
    >
      <AnimatedContext.Provider
        value={{
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
