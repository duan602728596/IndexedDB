module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          ie: 11,
          edge: 12,
          chrome: 40,
          firefox: 40
        },
        debug: false,
        modules: false,
        useBuiltIns: false,
        uglify: false
      }
    ],
    '@babel/flow'
  ]
};