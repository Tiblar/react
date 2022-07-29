const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "@svgr/webpack",
          }
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[hash:base64:5]"
              }
            }
          },
          "postcss-loader",
          'sass-loader',
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        include: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|mp3|mp4|jpg|jpeg|gif|ttf|ico)$/,
        exclude: /node_modules/,
        loader: "file-loader?name=assets/[hash:base64:5].[ext]"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[hash].js",
    publicPath: "/"
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: path.join(__dirname, './dist'),
    publicPath: "/",
    hot: true,
    host: '0.0.0.0',
    port: 8888,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
      favicon: path.resolve(__dirname, "public/favicon.ico")
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[hash].css',
      chunkFilename: "assets/[id]--[hash].css",
      ignoreOrder: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/plyr', to: 'plyr' }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/robots.txt', to: 'robots.txt' }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'world-chat/webapp', to: 'matrix' },
        { from: 'public/version', to: "" },
      ]
    }),
  ],
  node: {
    fs: 'empty'
  },
  target: "web",
  devtool: 'source-map',
  // https://stackoverflow.com/a/70437745
  //mode: 'development'
  mode: 'production'
};
