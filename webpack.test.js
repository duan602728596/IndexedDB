const path = require('path');
const Config = require('webpack-chain');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = new Config();

config
  // mode
  .mode('development')
  // entry
  .entry('app')
  .add(path.join(__dirname, 'tests/index.js'))
  .end()
  // output
  .output
  .path(path.join(__dirname, 'build'))
  .filename('[name].js')
  .chunkFilename('[name].js')
  .publicPath('/')
  .end()
  // devtool
  .devtool('module-eval-source-map')
  // externals
  .externals({
    mocha: 'window.mocha',
    chai: 'window.chai',
    describe: 'window.describe',
    it: 'window.it'
  })
  // module
  .module
  .rule('file')
  .test(/(mocha\.(js|css)|chai)/)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: '[name].[hash:5]:[ext]'
  })
  .end()
  .end()
  .end()
  // plugin
  .plugin('html-webpack-plugin')
  .use(HtmlWebpackPlugin, [{
    inject: true,
    template: path.join(__dirname, 'tests/index.ejs'),
    filename: 'index.html'
  }]);

module.exports = config.toConfig();