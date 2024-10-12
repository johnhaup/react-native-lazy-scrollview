import React, { useEffect, useRef } from 'react';
import { LazyChildProps } from '../types';

export function BareLazyChild({
  children,
  onEnterThresholdPass,
  onVisibilityEnter,
}: Pick<
  LazyChildProps,
  'children' | 'onEnterThresholdPass' | 'onVisibilityEnter'
>) {
  const _hasFired = useRef(false);

  useEffect(() => {
    if (!_hasFired.current) {
      _hasFired.current = true;
      if (typeof onEnterThresholdPass === 'function') {
        onEnterThresholdPass();
      }
      if (typeof onVisibilityEnter === 'function') {
        onVisibilityEnter();
      }
    }
  }, [onEnterThresholdPass, onVisibilityEnter]);

  return <>{children}</>;
}
