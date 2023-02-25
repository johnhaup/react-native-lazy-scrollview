module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!react-native-reanimated|@react-native|react-native)',
  ],
  coverageReporters: ['json-summary'],
};
