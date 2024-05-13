import { createContext, useContext } from 'react';

const initialContext = {
  hasReachedEnd: { value: false },
  triggerValue: { value: 0 },
  scrollValue: { value: 0 },
  bottomYValue: { value: 0 },
};

export const AnimatedContext = createContext(initialContext);

export const useAnimatedContext = () => useContext(AnimatedContext);
