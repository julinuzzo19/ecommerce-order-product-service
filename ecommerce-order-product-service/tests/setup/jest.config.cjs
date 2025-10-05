module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest/presets/default-esm",
      testEnvironment: "node",
      rootDir: process.cwd(),
      testMatch: [
        "<rootDir>/src/**/domain/__tests__/**/*.test.ts",
        "<rootDir>/src/**/application/__tests__/**/*.test.ts",
        "<rootDir>/src/shared/**/__tests__/**/*.test.ts",
      ],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
      },
      transformIgnorePatterns: [
        "node_modules/(?!(uuid)/)"
      ],
      extensionsToTreatAsEsm: [".ts"],
      transform: {
        "^.+\\.ts$": ["ts-jest", {
          useESM: true,
          tsconfig: {
            module: "esnext"
          }
        }]
      },
      collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/index.ts",
        "!src/**/__tests__/**",
      ],
    },
    {
      displayName: "integration",
      preset: "ts-jest/presets/default-esm",
      testEnvironment: "node",
      rootDir: process.cwd(),
      testMatch: [
        "<rootDir>/src/**/infrastructure/__tests__/**/*.integration.test.ts",
      ],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/testDatabase.ts"],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
      },
      transformIgnorePatterns: [
        "node_modules/(?!(uuid)/)"
      ],
      extensionsToTreatAsEsm: [".ts"],
      transform: {
        "^.+\\.ts$": ["ts-jest", {
          useESM: true,
          tsconfig: {
            module: "esnext"
          }
        }]
      },
      collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/index.ts",
        "!src/**/__tests__/**",
      ],
    },
    {
      displayName: "e2e",
      preset: "ts-jest/presets/default-esm",
      testEnvironment: "node",
      rootDir: process.cwd(),
      testMatch: [
        "<rootDir>/src/**/infrastructure/__tests__/**/*.e2e.test.ts",
        "<rootDir>/tests/e2e/**/*.test.ts",
      ],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/testDatabase.ts"],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
      },
      transformIgnorePatterns: [
        "node_modules/(?!(uuid)/)"
      ],
      extensionsToTreatAsEsm: [".ts"],
      transform: {
        "^.+\\.ts$": ["ts-jest", {
          useESM: true,
          tsconfig: {
            module: "esnext"
          }
        }]
      },
      collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/index.ts",
        "!src/**/__tests__/**",
      ],
    },
  ],
};