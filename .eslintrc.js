module.exports = {
  env: {
    es2021: true,
  },
  extends: "@guardian/eslint-config-typescript",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-inferrable-types": 0,
    "import/no-namespace": 2,
  },
  root: true,
  ignorePatterns: ["**/*.js", "node_modules"],
};
