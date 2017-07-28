const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: ['./src/index'],
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [['env', { modules: false }], 'stage-0'],
                            plugins: ['transform-regenerator', 'transform-runtime']
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env': { 
                BUILD_TARGET: JSON.stringify('server'),
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],
    output: { path: path.join(__dirname, 'dist'), filename: 'server.js' }
};
