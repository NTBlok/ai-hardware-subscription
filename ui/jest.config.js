const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  rootDir: "./",
  roots: ["<rootDir>", "<rootDir>/src/components/__tests__/"],
  modulePaths: [
    "<rootDir>/src/components",
    "<rootDir>/node_modules",
    "<rootDir>",
  ],

  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",

  modulePaths: ["<rootDir>/src/components/*"],
  transformIgnorePatterns: ["node_modules/(?!d3-(time-format|time|scale))"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    // "^.+\\.js$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleDirectories: ["<rootDir>/../", "node_modules"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    // '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    // "^d3-(.*)$": `d3-$1/dist/d3-$1`,
    "^d3-scale$": "<rootDir>/node_modules/d3-scale/dist/d3-scale.min.js",
    "^d3-time$": "<rootDir>/node_modules/d3-time/dist/d3-time.min.js",
    "^d3-time-format$":
      "<rootDir>/node_modules/d3-time-format/dist/d3-time-format.min.js",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^pages/(.*)$": "<rootDir>/pages/$1",
    "src/components/(.*)": "<rootDir>/../src/components/$1",
    "pages/(.*)": "<rootDir>/../pages/$1",
    "@App/(.*)": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.jest.json",
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
