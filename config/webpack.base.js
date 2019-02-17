const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
                
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'WebpackTest'
        }),
        new CleanWebpackPlugin(['dist'],{
            root: path.resolve(__dirname,'../'),
        }),
    ],
}