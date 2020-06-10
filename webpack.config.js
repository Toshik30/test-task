const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const chokidar = require('chokidar');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); 

const config = {
  entry: "./src/js/index.js",
  output: {
    filename: "./js/bundle.js"
  },
  devtool: "source-map",
  devServer: {
    before(app, server) {
      chokidar.watch([
        './src/html/**/*.html'
      ]).on('all', function() {
        server.sockWrite(server.sockets, 'content-changed');
      })
    },
    hot: true,
    liveReload: false
  },
  mode: "development",
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: true
      }),
      new UglifyJsPlugin()
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.scss',
      '.html',
    ],
    modules: [
      'src',
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          'css-hot-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: true,
              plugins: () => [
                require("cssnano")({
                  preset: [
                    "default",
                    {
                      discardComments: {
                        removeAll: true
                      }
                    }
                  ]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"]
      }
    ]
  },
  watch: true,
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.resolve(__dirname, "src/html/index.html"),
    }),
    new HtmlWebpackPlugin({  
      filename: 'lessons.html',
      template: path.resolve(__dirname, 'src/html/lessons.html'),
    }),
     new HtmlWebpackPlugin({  
      filename: 'blog.html',
      template: path.resolve(__dirname, 'src/html/blog.html'),
    }),
      new HtmlWebpackPlugin({  
      filename: 'contacts.html',
      template: path.resolve(__dirname, 'src/html/contacts.html'),
    }),
       new HtmlWebpackPlugin({  
      filename: 'about-us.html',
      template: path.resolve(__dirname, 'src/html/about-us.html'),
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/fonts",
        to: "./fonts"
      },
      {
        from: "./src/images",
        to: "./images"
      },
    ]),
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};