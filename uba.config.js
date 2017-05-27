const path = require("path");
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const glob = require('glob');
const entries = {};
const chunks = [];



glob.sync('./src/pages/**/index.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.js')[0]
  entries[chunk] = path
  chunks.push(chunk)
});

console.log(entries);

var config = {
  devtool: 'cheap-module-source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve('src'),
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    }]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css',
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', 'jsx']
  }
}

glob.sync('./src/pages/**/*.html').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.html')[0];
  const filename = chunk + '.html';
  const htmlConf = {
    filename: filename,
    template: path,
    inject: 'body',
    //favicon: './src/assets/img/logo.png',
    hash: false,
    chunks: ['vendors', chunk]
  }
  config.plugins.push(new HtmlWebpackPlugin(htmlConf));
});



module.exports = config;
