const path = require("path");
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function() {

  return {
    devtool: 'cheap-module-source-map',
    entry: {
      app: ['./src/app.js', hotMiddlewareScript],
      vendor: ['react', 'react-dom']
    },
    output: {
      filename: '[name].[hash].js',
      publicPath: "/"
    },
    module: {
      rules: [{
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: [{
          loader: 'babel-loader'
        }]
      }, {
        test: /\.css$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: ['style-loader', 'css-loader']
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        filename : "./index.html",
        template: "./src/index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      })
    ],
    resolve: {
      extensions: ['.js', 'jsx']
    }
  }
}
