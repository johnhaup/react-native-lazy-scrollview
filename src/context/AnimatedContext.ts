import { createContext, useContext } from 'react';

const initialContext = {
  scrollValue: { value: 0 },
  topYValue: { value: 0 },
  bottomYValue: { value: 0 },
  topTriggerValue: { value: 0 },
  bottomTriggerValue: { value: 0 },
};

export const AnimatedContext = createContext(initialContext);

export const useAnimatedContext = () => useContext(AnimatedContext);
