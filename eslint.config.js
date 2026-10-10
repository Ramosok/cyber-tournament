import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const prettierFlat = eslintConfigPrettier;
const prettierConfigs = Array.isArray(prettierFlat)
  ? prettierFlat
  : [prettierFlat];

export default [
  {
    ignores: ["build", "coverage", "node_modules", "*.d.ts"],
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      unicorn,
      sonarjs,
      security,
      "no-unsanitized": noUnsanitized,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-console": ["error", { allow: ["info", "error"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-else-return": "error",
      "no-return-await": "error",
      "no-useless-return": "error",
      "no-param-reassign": "off",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "no-implicit-coercion": "error",
      "no-unsafe-optional-chaining": "error",
      "no-void": ["error", { allowAsStatement: true }],
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",
      "import/no-cycle": "off",
      "import/no-relative-packages": "off",
      "import/no-extraneous-dependencies": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [".*[А-Яа-яЁё].*"],
              message: "Кириллица в путях импортов запрещена",
            },
          ],
        },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react-dom$"],
            ["^node:"],
            ["^@?\\w"],
            ["^(@/|src/|ui/|logic/)(.*)"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: false }],
      "react/self-closing-comp": ["error", { html: true, component: true }],
      "react/no-array-index-key": "error",
      "react/no-unstable-nested-components": ["error", { allowAsProps: false }],
      "react/no-danger": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "unicorn/filename-case": [
        "error",
        { cases: { pascalCase: true, kebabCase: true, camelCase: true } },
      ],
      "unicorn/prefer-query-selector": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/no-array-callback-reference": "error",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/no-duplicate-string": ["error", { threshold: 5 }],
      "sonarjs/no-small-switch": "error",
      "security/detect-object-injection": "off",
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",
      "prettier/prettier": "error",
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react-dom$"],
            ["^node:"],
            ["^@?\\w"],
            ["^@?\\w.*\\u0000$", "^[^.].*\\u0000$", "^\\..*\\u0000$"],
            ["^(@/|src/|ui/|logic/)(.*)"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowNullish: false },
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["variable", "function", "parameter", "method", "accessor"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allowSingleOrDouble",
          custom: { regex: "^[A-Za-z_$][A-Za-z0-9_$]*$", match: true },
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 2025, -1,
          ],
          ignoreDefaultValues: false,
          ignoreArrayIndexes: false,
          enforceConst: true,
          detectObjects: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "id-match": [
        "error",
        "^[A-Za-z_$][A-Za-z0-9_$]*$",
        { properties: false, onlyDeclarations: false },
      ],
      "no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, 2, 3, 4, 5],
          ignoreDefaultValues: false,
          ignoreArrayIndexes: false,
          enforceConst: true,
          detectObjects: true,
        },
      ],
    },
  },
  {
    // В .d.ts типы расширяются через declaration merging, а он работает
    // только с interface.
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  },
  ...prettierConfigs,
];
