module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'jsx-a11y', 'react-hooks'],
  rules: {
    'no-nested-ternary': 'off',
    'prettier/prettier': 'error',
    'react/jsx-curly-newline': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
};
