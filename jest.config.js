module.exports = {
  preset: 'ts-jest',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.ts'],
};
