const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge({
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                ],
            },
        ],
    },
}, common);
