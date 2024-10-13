import React, { useEffect, useRef } from 'react';
import { LazyChildProps } from '../types';
import { logger } from '../../../utils/logger';

export function BareLazyChild({
  children,
  onEnterThresholdPass,
  onVisibilityEnter,
  debug = false,
}: Pick<
  LazyChildProps,
  'children' | 'onEnterThresholdPass' | 'onVisibilityEnter' | 'debug'
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

      if (debug) {
        logger.log(
          '<LazyChild>',
          'No LazyScrollView provider found. Firing onEnterThresholdPass and onVisibilityEnter once.'
        );
      }
    }
  }, [debug, onEnterThresholdPass, onVisibilityEnter]);

  return <>{children}</>;
}
