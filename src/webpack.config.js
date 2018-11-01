"use strict";

const path = require("path");
var webpack = require('webpack');
module.exports = {
    entry: "./Scripts/app.js",
    output: {
        filename: "./wwwroot/js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
                 new webpack.optimize.UglifyJsPlugin({
                     compress: true,
                     sourceMap: false,
                     mangle: false
                 })
    ]
};