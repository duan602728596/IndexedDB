import path from 'path';

export default {
  entry: {
    app: [path.join(__dirname, '../../test/app.js')]
  },
  output: { publicPath: '/' },
  externals: {
    mocha: 'window.mocha',
    chai: 'window.chai'
  },
  rules: [
    {
      test: /(mocha|chai)/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'script/'
        }
      }]
    }
  ],
  js: {
    include: /(src|test|lib)/,
    exclude: /(node_modules|mocha|chai)/
  },
  css: { exclude: /mocha/ },
  html: [{ template: path.join(__dirname, '../../test/index.pug') }]
};