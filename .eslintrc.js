module.exports = {
  extends: ['airbnb-base'],
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', { code: 150 }],
    'eol-last': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': 'off',
    'no-console': 'off',
  },
};
