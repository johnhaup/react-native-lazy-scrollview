export interface LazyChildCallbacks {
  /**
   * Callback to fire when the LazyChild passes the LazyScrollView's offset after being offscreen
   * - Note: This will only fire once and stop measuring if onExitThresholdPass is not provided.
   */
  onEnterThresholdPass?: () => void;
  /**
   * Callback to fire when the LazyChild passes the LazyScrollView's offset after being onscreen
   * - Note: This will not fire if onEnterThresholdPass has not fired.
   */
  onExitThresholdPass?: () => void;
  /**
   * Callback to fire when the LazyChild's viewable area exceeds the percentVisibleThreshold.
   * - Note: This will only fire once and stop measuring if onVisibilityExit is not provided.
   */
  onVisibilityEnter?: () => void;
  /**
   * Callback to fire when the LazyChild's viewable area goes under the percentVisibleThreshold after being above it.
   * - Note: This will not fire if onVisibilityEnter has not fired.
   */
  onVisibilityExit?: () => void;
}

/**
 * @interface LazyChildProps
 */
export interface LazyChildProps extends LazyChildCallbacks {
  children: React.ReactNode;
  /**
   * How much of the LazyChild should be visible before the percent visible threshold is passed.  For example, 0.5 would fire onPercentVisibleThresholdPass when 50% of the LazyChild is visible.  This has no effect if onPercentVisibleThresholdPass is not provided.
   * @defaultValue 1.0
   */
  percentVisibleThreshold?: number;
  /**
   * When true, console.logs LazyChilds measurement data.  Even if true, will not call console.log in production.
   */
  debug?: boolean;
}
