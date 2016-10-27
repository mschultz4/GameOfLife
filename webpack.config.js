"use strict";

let path              = require("path"), 
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack           = require('webpack');

module.exports = {
    entry: {
        app: "./src/game-of-life.js",
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: ["babel"],
            query: {
                presets: ['es2015', 'react']
            }

        }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};