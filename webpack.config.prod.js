"use strict";

var webpack = require('webpack');

const baseConfig = require("./webpack.config");

module.exports = Object.assign({}, baseConfig, {
    devtool: undefined,
    output: Object.assign({}, baseConfig.output, {
        publicPath: "static"
    }),
    plugins: baseConfig.plugins.concat([
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            preserveComments: "license",
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": "\"production\"",
            },
        }),
    ]),
});
