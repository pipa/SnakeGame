// Deps =========================================
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: 'master.css'
});
// const uglifyPlugin = require('uglifyjs-webpack-plugin');
// const LiveReloadPlugin = require('webpack-livereload-plugin');

// Main Config ==================================
const config = {
  watch: true,
  devServer: {
    contentBase: './'
  },
  devtool: 'inline-source-map',
  entry: [
    './assets/js/main.js',
    './assets/scss/master.scss'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        exclude: /(node_modules|bower_components)/,
        use: extractSass.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [extractSass]
};

// Exposing `config` for webpack ================
module.exports = config;
