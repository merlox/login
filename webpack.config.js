const path = require('path')
const htmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')


module.exports = {
    mode: process.env.NODE_ENV,
    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, 'src', 'client', 'App.js')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            query: {
                presets: ['env', 'react']
            }
        }, {
            test: /\.styl$/,
            exclude: /node_modules/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            }, 'stylus-loader'],
            include: /src/
        }]
    },
    plugins: [
        new htmlPlugin({
            title: "Login / Sign up",
            template: './src/client/index.ejs',
            hash: true
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
}
