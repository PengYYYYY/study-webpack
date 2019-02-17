const merge = require('webpack-merge');
const base = require("./webpack.base.js");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require("path");

module.exports = merge(base ,{
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(['dist'],{
            root: path.resolve(__dirname,'../'),
        })
    ],
})