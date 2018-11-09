module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: 11,
          edge: 12,
          chrome: 40,
          firefox: 40
        },
        debug: false,
        modules: false,
        useBuiltIns: false
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining']
};