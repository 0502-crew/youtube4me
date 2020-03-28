const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/App.tsx",
  mode: "development",
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
      {
        test: /\.(t|j)sx?$/,
        use: { loader: 'ts-loader' },
        exclude: /node_modules/
      },
      // addition - add source-map support
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 45011,
    publicPath: "http://localhost:45011/dist/",
    hotOnly: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // addition - add source-map support
  devtool: "source-map"
};