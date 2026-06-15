import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";

export default [
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
          "./apps/web/tsconfig.json",
          "./apps/account-center/tsconfig.json",
          "./apps/workspace/tsconfig.json",
          "./apps/server/tsconfig.json",
        ],
      },
    },
    plugins: {
      react,
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
