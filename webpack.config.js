const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = name => ({
  entry: `./src/${name}/index.js`,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, name),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader'],
        }),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', name, 'index.html'),
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
});

module.exports = function(env, argv) {
  return [config('internal'), config('external')];
};
