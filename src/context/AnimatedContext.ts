import { createContext, useContext } from 'react';

export const AnimatedContext = createContext({ value: 0 });

export const useAnimatedContext = () => useContext(AnimatedContext);
