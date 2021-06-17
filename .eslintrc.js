module.exports = {
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    // 自己写一些想配置的规则
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
};