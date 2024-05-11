import React, { useCallback, useRef } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
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
  const _wrapperRef = useRef<View>(null);

  const _offset = useSharedValue(injectedOffset || 0);
  const _containerHeight = useSharedValue(0);
  const _contentHeight = useSharedValue(0);
  const _scrollViewTopY = useSharedValue(0);
  /**
   * Starts at 0 and increases as the user scrolls down
   */
  const scrollValue = useScrollViewOffset(_scrollRef);
  const hasReachedEnd = useDerivedValue(() => {
    if (!_contentHeight.value || !_containerHeight.value) {
      return false;
    }

    return scrollValue.value >= _contentHeight.value - _containerHeight.value;
  });
  const triggerValue = useDerivedValue(
    () => _containerHeight.value + _offset.value
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      _containerHeight.value = e.nativeEvent.layout.height;
      _wrapperRef.current?.measureInWindow(
        (_: number, y: number, _2: number, height: number) => {
          _scrollViewTopY.value = y;
          _contentHeight.value = height;
        }
      );
    },
    [_containerHeight, _contentHeight, _scrollViewTopY]
  );

  const onContentContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      _contentHeight.value = e.nativeEvent.layout.height;
    },
    [_contentHeight]
  );

  return (
    <Animated.ScrollView
      {...rest}
      ref={_scrollRef}
      scrollEventThrottle={16}
      onLayout={onLayout}
    >
      <AnimatedContext.Provider
        value={{
          hasReachedEnd,
          triggerValue,
          scrollValue,
        }}
      >
        <View ref={_wrapperRef} onLayout={onContentContainerLayout}>
          {children}
        </View>
      </AnimatedContext.Provider>
    </Animated.ScrollView>
  );
}
