/**
 * Whether a child spanning [start, end] overlaps the trigger zone [startTrigger, endTrigger].
 */
export function isWithinTriggers(
  start: number,
  end: number,
  startTrigger: number,
  endTrigger: number
) {
  'worklet';
  return start < endTrigger && end > startTrigger;
}

/**
 * Whether at least `threshold` of a child spanning [start, start + size] is inside the container.
 * A child larger than the container counts as fully visible when it fills the container.
 */
export function isPercentVisible(
  start: number,
  size: number,
  containerStart: number,
  containerEnd: number,
  threshold: number
) {
  'worklet';
  const containerSize = containerEnd - containerStart;
  if (containerSize <= 0 || size <= 0) {
    return false;
  }

  const visible =
    Math.min(start + size, containerEnd) - Math.max(start, containerStart);

  return visible > 0 && visible >= Math.min(size, containerSize) * threshold;
}
