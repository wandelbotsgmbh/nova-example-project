module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "next",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-warning-comments": "warn",
    "no-constant-condition": "off",

    // The TypeScript compiler itself already warns about these
    "@typescript-eslint/no-unused-vars": "off",
    "no-undef": "off",

    /*
     * Requires "import type" for imports not used at runtime
     * Makes code easier to read due to the explicitness of the imports
     * and improves compiler performance with verbatimModuleSyntax
     * option in tsconfig
     */
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
  },
}
