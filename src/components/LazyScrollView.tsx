import React, {
  cloneElement,
  isValidElement,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { LazyChild } from './LazyChild';

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

  const hydrateChild = useCallback(
    (child: ReactNode): JSX.Element | null => {
      if (isValidElement(child)) {
        const elementChildren = child.props.children
          ? Array.isArray(child.props.children)
            ? child.props.children.map(hydrateChild)
            : hydrateChild(child.props.children)
          : undefined;

        console.log({ elementChildren });
        if (child.type === LazyChild) {
          return cloneElement(child, {
            ...child.props,
            children: elementChildren,
            triggerValue,
          });
        }

        return cloneElement(child, {
          ...child.props,
          children: elementChildren,
        });
      }

      return null;
    },
    [triggerValue]
  );

  const hydratedChildren = useMemo(
    () =>
      Array.isArray(children)
        ? children.map(hydrateChild)
        : hydrateChild(children),
    [children, hydrateChild]
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onLayout={onLayout}
    >
      {hydratedChildren}
    </Animated.ScrollView>
  );
}
