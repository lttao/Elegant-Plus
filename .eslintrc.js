module.exports = {
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  plugins: ['vue'],
  rules: {
    // 自己写一些想配置的规则
    'import/extensions': ['error', 'always', {
      js: 'never', ts: 'never', tsx: 'never', vue: 'never',
    }],
  },
  overrides: [
    {
      files: ['*.vue', '*.js', '*.ts'],
      rules: {
        // 这里写覆盖vue文件的规则
        'linebreak-style': 0,
        'no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },

  },
};
