require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useAnimatedReaction: (prepare, react) => {
    const value = prepare();
    react(value);
  },
  useDerivedValue: (fn) => ({
    value: fn(),
  }),
}));
