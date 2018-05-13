var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //devtool: "eval-source-map",
    entry: {
        app: [
        "./src/index.jsx"
        ]
    },
    output: {
        path: __dirname + '/public',
        filename: "bundle.js"
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    node: {
        net: 'empty',
        dns: 'empty',
        fs: 'empty',
        tls: 'empty'
    },

    devServer: {
        proxy: 'http://localhost:3000/'
    },
    
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,

                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-decorators-legacy'],
                        presets: ['react', 'es2015', 'stage-0']
                    },

                },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                use: {
                    loader: 'url-loader'
                }
            },
            {
                test: /\.(png|jpg|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: { limit: 250000 }
                }
            },
            {
                test: /\.json$/,
                use: {
                    loader: 'json-loader'
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('bundle.css')
    ]
};
