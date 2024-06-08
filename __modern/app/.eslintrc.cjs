module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended",
    'plugin:react-hooks/recommended',
    "plugin:import/recommended"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'prettier',
    "simple-import-sort"
  ],
  rules: {
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "fixStyle": "separate-type-imports"
      }
    ],
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
    "react/react-in-jsx-scope": "off",
    "sort-imports": [
      "error",
      {
        "ignoreCase": false,
        "ignoreDeclarationSort": true,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": [
          "none",
          "all",
          "multiple",
          "single"
        ],
        "allowSeparatedGroups": true
      }
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  },
}
