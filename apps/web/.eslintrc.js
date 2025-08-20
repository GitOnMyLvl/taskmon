module.exports = {
  extends: [
    '@taskmon/config/eslint-preset.js',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ]
  }
};

