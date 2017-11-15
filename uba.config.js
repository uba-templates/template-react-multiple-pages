const path = require("path");
const hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const glob = require("glob");
const entries = {};
const chunks = [];
const prodEntries = {};
const prodChunks = [];


//服务器启动IP与端口
const svrConfig = {
  host: "127.0.0.1",
  port: 3000,
  //是否开启静默模式？true开启，紧显示错误和警告，如要看信息为false。
  noInfo: false
};

//代理模式切换，enable:true启用代理，数据模拟失效.只对开发有效
const proxyConfig = [{
  enable : false,
  router: "/",
  url: "cnodejs.org",
  options : {
    filter : function(req,res){
      return (req.url.indexOf("webpack_hmr") > -1 ? false : true);
    }
  }
}];

//静态资源托管设置
const staticConfig = {
  folder : "src/static"
};

//dev多入口配置
glob.sync("./src/pages/*/index.js").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/index.js")[0];
  entries[chunk] = [path, hotMiddlewareScript];
  chunks.push(chunk);
});


//dev webpack基本配置
var devConfig = {
  devtool: "cheap-module-source-map",
  entry: entries,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "/"
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router": "ReactRouter"
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve("src"),
      use: [{
        loader: "babel-loader"
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ["css-loader","postcss-loader"],
        fallback: "style-loader"
      })
    },{
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
          limit: 10000,
          name: "images/[name].[ext]"
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }]
    }]
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
    new OpenBrowserPlugin({
      url: `http://${svrConfig.host}:${svrConfig.port}`
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: [
      ".js", "jsx"
    ],
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      assets: path.resolve(__dirname, "src/assets/"),
      pages : path.resolve(__dirname, "src/pages/"),
    }
  }
}


//多页面配置
glob.sync("./src/pages/*/*.html").forEach(path => {
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
});



//product多入口配置
glob.sync("./src/pages/*/index.js").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/index.js")[0];
  prodEntries[chunk] = [path];
  prodChunks.push(chunk);
});

//product webpack基本配置
var prodConfig = {
  entry: prodEntries,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash:8].js",
    publicPath: ""
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router": "ReactRouter"
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve("src"),
      use: [{
        loader: "babel-loader"
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ["css-loader","postcss-loader"],
        fallback: "style-loader"
      })
    },{
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
          limit: 10000,
          name: "images/[name].[hash:8].[ext]"
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[name].[hash:8].[ext]"
        }
      }]
    }]
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
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: [
      ".js", "jsx"
    ],
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      assets: path.resolve(__dirname, "src/assets/"),
      pages: path.resolve(__dirname, "src/pages/")
    }
  }
}

//多页面配置
glob.sync("./src/pages/*/*.html").forEach(path => {
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
  prodConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});

module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig,
  svrConfig: svrConfig,
  proxyConfig: proxyConfig,
  staticConfig : staticConfig
};
