/**
 * tinper react 多页面脚手架配置文件
 */

const path = require("path");
const hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const glob = require("glob");
const entries = {};
const chunks = [];
const prodEntries = {};
const prodChunks = [];

//服务端设置
const svrConfig = {
  historyApiFallback: false
};

//远程代理访问，可以配置多个代理服务
const proxyConfig = [{
  enable: true,
  router: "/api/*",
  url: "http://cnodejs.org"
}, {
  enable: true,
  router: ["/users/*", "/orgs/*"],
  url: "https://api.github.com"
}];

//优化配置，对于使用CDN作为包资源的引用从外到内的配置
const externals = {
  "react": "React",
  "react-dom": "ReactDOM",
  "react-router": "ReactRouter",
  "axios": "axios"
}

//默认加载扩展名、相对JS路径模块的配置
const resolve = {
  extensions: [
    ".jsx", ".js", ".less", ".css", ".json"
  ],
  alias: {
    components: path.resolve(__dirname, "src/components/"),
    assets: path.resolve(__dirname, "src/assets/"),
    pages: path.resolve(__dirname, "src/pages/")
  }
}

//开发环境多入口
glob.sync("./src/pages/*/index.js").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/index.js")[0];
  entries[chunk] = [path, hotMiddlewareScript];
  chunks.push(chunk);
  prodEntries[chunk] = [path];
  prodChunks.push(chunk);
});

//Loader
const rules = [{
  test: /\.js[x]?$/,
  exclude: /(node_modules)/,
  include: path.resolve("src"),
  use: [{
    loader: "babel-loader"
  }]
}, {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    use: ["css-loader", "postcss-loader"],
    fallback: "style-loader"
  })
}, {
  test: /\.less$/,
  use: ExtractTextPlugin.extract({
    use: ['css-loader', 'postcss-loader', 'less-loader'],
    fallback: 'style-loader'
  })
}, {
  test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
  exclude: /favicon\.png$/,
  use: [{
    loader: "url-loader",
    options: {
      limit: 8196,
      name: "images/[name].[hash:8].[ext]"
    }
  }]
}, {
  test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
  use: [{
    loader: "file-loader",
    options: {
      name: "images/[name].[hash:8].[ext]"
    }
  }]
}];

//开发环境主要配置
var devConfig = {
  devtool: "cheap-module-eval-source-map",
  entry: entries,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "/"
  },
  externals: externals,
  module: {
    rules: rules
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new CommonsChunkPlugin({
      name: "vendors",
      filename: "vendors.js",
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: resolve
}

//生产环境主要配置
var prodConfig = {
  devtool: "source-map",
  entry: prodEntries,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash:8].js",
    publicPath: ""
  },
  externals: externals,
  module: {
    rules: rules
  },
  plugins: [
    new CommonsChunkPlugin({
      name: "vendors",
      filename: "vendors.[hash:8].js",
      chunks: prodChunks,
      minChunks: prodChunks.length
    }),
    new ExtractTextPlugin({
      filename: "[name].[hash:8].css",
      allChunks: true
    }),
    new CleanWebpackPlugin(['dist']),
    new uglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ],
  resolve: resolve
}

//页面扫描机制包含开发环境和生产环境的html
glob.sync("./src/pages/*/index.html").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/index.html")[0];
  const filename = chunk + ".html";
  const htmlConf = {
    filename: filename,
    template: path,
    inject: "body",
    favicon: "./src/assets/images/favicon.png",
    hash: true,
    chunks: ["vendors", chunk]
  }
  devConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
  prodConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});

module.exports = {
  devConfig,
  prodConfig,
  svrConfig,
  proxyConfig
};
