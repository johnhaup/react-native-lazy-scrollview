import { useAnimatedContext } from '../context/AnimatedContext';

/**
 * Shared value if you need to track the scroll value for other interactions outside of the LazyScrollView.
 * Note this must be called from a LazyScrollView child as it uses the AnimatedContext.
 */
export const useLazyScrollValue = () => {
  const { scrollValue } = useAnimatedContext();

  return scrollValue;
};
