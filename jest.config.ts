import type { Config } from 'jest';

const config: Config = {
  // preset: 'ts-jest',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  collectCoverage: true,
  coverageReporters: ["lcov", "html"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    }
  }
};

export default config;
