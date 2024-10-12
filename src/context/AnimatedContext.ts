import { createContext, useContext } from 'react';

const initialContext = {
  _hasProvider: false,
  scrollValue: { value: 0 },
  containerStart: { value: 0 },
  containerEnd: { value: 0 },
  topTriggerValue: { value: 0 },
  bottomTriggerValue: { value: 0 },
};

export const AnimatedContext = createContext(initialContext);

export const useAnimatedContext = () => useContext(AnimatedContext);
