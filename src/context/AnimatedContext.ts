import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

const initialContext = {
  _hasProvider: false,
  scrollValue: { value: 0 } as SharedValue<number>,
  containerStart: { value: 0 } as SharedValue<number>,
  containerEnd: { value: 0 } as SharedValue<number>,
  startTrigger: { value: 0 } as SharedValue<number>,
  endTrigger: { value: 0 } as SharedValue<number>,
  horizontal: { value: false },
  isScrollUnmounted: { value: false },
};

export const AnimatedContext = createContext(initialContext);

export const useAnimatedContext = () => useContext(AnimatedContext);
