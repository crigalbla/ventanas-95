module.exports = {
  extends: [ 'eslint-config-astro-svelte-jsdoc-standard' ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    "no-tabs": "off",
    "svelte/no-at-html-tags": "off",
    "quotes": ["warn", "double"],
    "indent": ["warn", "tab"],
    "eol-last": "warn",
    "svelte/valid-compile": "off",
    "no-return-assign": "off",
    "no-mixed-spaces-and-tabs": "off",
    "css-semicolonexpected": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "warn",
    "prefer-const": "warn"
  }
};