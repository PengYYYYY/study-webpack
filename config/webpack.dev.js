const merge = require("webpack-merge");
const base = require("./webpack.base");
const webpack = require("webpack");

module.exports = merge(base ,{
    mode: 'development',
    devtool: 'source-map',
    devServer:{
        compress: true, //启用压缩
        port: 1207,     //端口
        open: false,      //自动打开浏览器
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
})