import React from 'react';
import { useAnimatedContext } from '../../context/AnimatedContext';
import { BareLazyChild } from './components/BareLazyChild';
import { FullLazyChild } from './components/FullLazyChild';
import { LazyChildProps } from './types';

export const LazyChild = function (props: LazyChildProps) {
  const { _hasProvider } = useAnimatedContext();

  if (!_hasProvider) {
    return (
      <BareLazyChild
        onEnterThresholdPass={props.onEnterThresholdPass}
        onVisibilityEnter={props.onVisibilityEnter}
        debug={props.debug}
      >
        {props.children}
      </BareLazyChild>
    );
  }

  return <FullLazyChild {...props} />;
};
