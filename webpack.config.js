const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // require webpack plugin
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin"); // require webpack plugin
// const JsDocPlugin = require("jsdoc-webpack-plugin"); //jsdoc plugin generates json on webpack build

let config = {
  entry: "./src/index.js", // entry file
  output: {
    path: path.resolve(__dirname, "./public"), // ouput path
    filename: "build.js" // output filename
  },
  module: {
    rules: [
      {
        test: /\.js$/, // files ending with .js
        exclude: /node_modules/, // exclude the node_modules directory
        loader: "babel-loader" // use this (babel-core) loader
      },
      {
        test: /\.scss$/, // files ending with .scss
        use: ExtractTextWebpackPlugin.extract({
          // call our plugin with extract method
          use: ["css-loader", "sass-loader"], // use these loaders
          fallback: "style-loader" // fallback for any CSS not extracted
        }) // end extract
      }
    ] // end rules
  },
  plugins: [
    new ExtractTextWebpackPlugin("styles.css"), // call the ExtractTextWebpackPlugin constructor and name our css file
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./public"), // A directory or URL to serve HTML content from.
    historyApiFallback: true, // fallback to /index.html for Single Page Applications.
    inline: true, // inline mode (set to false to disable including client scripts (like livereload)
    open: true // open default browser while launching
  },
  devtool: "eval-source-map" // enable devtool for better debugging experience
};

module.exports = config;

if (process.env.NODE_ENV === "production") {
  // if we're in production mode, here's what happens next
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
    new OptimizeCSSAssets() // call the css optimizer (minfication)
  );
}
