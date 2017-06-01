const path = require("path");
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const glob = require('glob');
const entries = {};
const chunks = [];
const prodEntries = {};
const prodChunks = [];
const svrConfig = {
  host: "127.0.0.1",
  port: 3000
};
const proxyConfig = [{
  router: "/proxy",
  url: "cnodejs.org"
}];

glob.sync('./src/pages/**/index.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.js')[0];
  entries[chunk] = [path, hotMiddlewareScript];
  chunks.push(chunk);
});
glob.sync('./src/pages/**/index.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.js')[0];
  prodEntries[chunk] = [path];
  prodChunks.push(chunk);
});

var devConfig = {
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
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/images/[name].[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[hash:8].[ext]'
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
    new OpenBrowserPlugin({
      url: `http://${svrConfig.host}:${svrConfig.port}`
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: [
      '.js', 'jsx'
    ],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      assets: path.resolve(__dirname, 'src/assets/')
    }
  }
}

var prodConfig = {
  devtool: 'cheap-source-map',
  entry: prodEntries,
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
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/images/[name].[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: prodChunks,
      minChunks: prodChunks.length
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css',
      allChunks: true
    }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: [
      '.js', 'jsx'
    ],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      assets: path.resolve(__dirname, 'src/assets/')
    }
  }
}

glob.sync('./src/pages/**/*.html').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.html')[0];
  const filename = chunk + '.html';
  const htmlConf = {
    filename: filename,
    template: path,
    inject: 'body',
    favicon: './src/assets/images/favicon.png',
    hash: false,
    chunks: ['vendors', chunk]
  }
  devConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});
glob.sync('./src/pages/**/*.html').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.html')[0];
  const filename = chunk + '.html';
  const htmlConf = {
    filename: filename,
    template: path,
    inject: 'body',
    favicon: './src/assets/images/favicon.png',
    hash: true,
    chunks: ['vendors', chunk]
  }
  prodConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});

module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig,
  svrConfig: svrConfig,
  proxyConfig: proxyConfig
};
