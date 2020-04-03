const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  entry: "./src/server.ts",
  module: {
    rules: [
      {
        test: /\.(t|j)s?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@src': path.resolve(__dirname, 'src')
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  externals: [nodeExternals()]
};