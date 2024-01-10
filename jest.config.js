/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/module',
  ],
};
