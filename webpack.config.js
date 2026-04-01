const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/app.js",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/templates', to: 'templates'},
                { from: './src/static', to: 'static'},
                { from: './src/styles', to: 'css'},
                { from: './node_modules/bootstrap-icons/icons', to: 'icons'},
                { from: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: 'js'},
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
        ],
    },
}