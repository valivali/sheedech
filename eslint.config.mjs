import js from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import prettier from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config([
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"]
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      prettier: prettier
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "simple-import-sort/imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-empty-interface": "error",
      ...prettierConfig.rules,
      "prettier/prettier": "error"
    }
  }
]);
