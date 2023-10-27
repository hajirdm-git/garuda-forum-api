module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-undef': 0,
    'no-console': 'off',
    indent: ['error', 2],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'linebreak-style': 0,
    'class-methods-use-this': 0,
    'no-unused-vars': 0,
  },
};
