import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  testTimeout: 20000,
  testMatch: ['**/*.test.(ts|js)'],
  rootDir: '.',

  cacheDirectory: '.jest-cache',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['./jest.setup.ts'],
} satisfies JestConfigWithTsJest;
