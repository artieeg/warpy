module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest.setup.js'],
  //transform: {'\\.ts$': ['ts-jest']},
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons|react-native-webrtc|react-native-reanimated|react-native-modal|react-native-animatable)/)',
  ],
  //transformIgnorePatterns: ['node_modules/react-native-webrtc/*'],
};
