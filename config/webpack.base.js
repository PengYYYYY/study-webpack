const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: {
        app: path.resolve(__dirname,'../src/index.js'),
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname,'../dist'),
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },{
                test: /\.(png|svg|jpg|gif)$/,
                use:{
                    loader:'url-loader',
                }
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },{
                test:/\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title:'WebpackTest'
        }),
    ]
}