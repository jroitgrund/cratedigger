const path = require("path");
const webpackConfig = require("./webpack.config");

module.exports = (config) => {
    config.set({
        basePath: process.cwd(),
        browsers: ["Chrome"],
        browserDisconnectTimeout: 30000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 30000,
        client: {
            useIframe: true,
            mocha: {
                reporter: "html",
                ui: "bdd",
            },
        },
        files: [
            "test/index.js"
        ],
        frameworks: ["mocha", "chai", "sinon"],
        reporters: ["mocha"],
        port: 9876,
        preprocessors: {
            "test/index.js": ["webpack", "sourcemap"],
        },
        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
    });
};
