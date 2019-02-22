**用webpack4.0做更多事情**

上一篇webpack入门文章中，我们学会了怎么使用webpack搭建一个前端工程，了解了webpack的一些核心概念。但是webpack的功力远不止如此，在本文中，我们将学习如何使用webpack来做更多的事情，如何进行环境分离，如何配置es6，再配置vue，使用vue来进行开发。

这篇文章是入门文章的延续，所以demo也延续入门文章的demo。

> 开发与生产环境的分离

在实际开发中，会有许多环境，有 开发环境，生产环境，测试环境，预发环境....(因公司而异)。最常见的两种是开发环境和生产环境。在不同的环境会有很多不同的配置。所以我们需要把不同环境的配置文件从`webpack.config.js`文件中分离出来。

首先进行目录的改造。首先安装依赖,用于融合配置文件。
```
npm install -D webpack-merge
```

```
webpack-demo
|- config
    |- webpack.base.js
    |- webpack.dev.js
    |- webpack.pro.js
|- package.json
|- src
    |- 略
```

**webpack.base.js**
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname,'./src/index.js'),
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname,'../dist'),
    },
    module: {
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
                    options: {
                        limit: 8192,
                        name: 'images/[name].[ext]?[hash]'
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'WebpackTest'
        })
    ]
}
```
**output文件名修改：** 我们需要对output的filename选项进行修改。在用户访问网页之后，会加载dist包中的bundle.js，并且进行缓存。在我们进行版本更新以后，如果加载文件名还是bundle.js的话。浏览器不会拉去新的bundle.js资源，会直接使用浏览器缓存的资源。所以我们需要将每次打包后的资源名都命名不同。`[name].[hash].js`会根据文件内容给每个文件名加上唯一的哈希，这样就不会出现重名文件了。

#### 开发环境(dev)

**webpack.dev.js**
```
const merge = require("webpack-merge");
const base = require("./webpack.base");
const webpack = require("webpack");

module.exports = merge(base ,{
    mode: 'development',
    devtool: 'source-map',
    devServer:{
        compress: true, //启用压缩
        port: 1207,     //端口
        open: false,    //自动打开浏览器
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
})
```
首先介绍一下开发环境下我们需要进行配置的几点

- **source-map**：source-map在开发中的用处很大，在浏览器允许的代码是经过编译以后的代码，在出现一些错误的时候，如果不使用source-map的时候，错误无法定位到源代码中。使用了source-map以后，可以直接定位到错误出现的行。配置source-map只需要将devtool属性配置为source-map就可以。
- **devserver配置**:devserver属性可以对开发环境选项进行一些配置，比如：自动打开浏览器，服务端口号，热更替，是否压缩等。
- **模块热更替(HotModuleReplacementPlugin)**:
模块热更替允许在更新各种模块的时候，无需完全刷新页面，这个功能在开发环境中非常实用。最简单的应用场景，你在写一些样式的时候，需要自己配置一些数据上去，这时候你需要调整字体大小。使用了模块热更替之后会页面不用刷新就可以看到效果，省去了重新配置数据。在开启热更替时，还需要对模块热更替插件进行配置，否则会报错。

#### 生产环境(pro)

```
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
```
- clean-webpack-plugin：用于删除文件，在每次打包时，dist文件夹都会出现新的文件，如果不进行删除处理的话，会一直累加到dist文件夹里面。所以这里使用clean-webpack-plugin插件，每次打包的时候都会先删除之前的dist文件。

#### 模式(mode)

在入门篇中，我们每次编译后都会出现`he 'mode' option has not been set`的警告。这是webpack4新增的mode属性，有两种mode，development和production.

- development模式：
    -   将`process.env.NODE_ENV `的值设为 development，过去需要通过webpack.DefinePlugin进行配置。
    -   提供注释、开发阶段的详细错误日志和提示。
- production模式:
    - 将`process.env.NODE_ENV`的值设为 production，过去需要通过webpack.DefinePlugin进行配置。
    - 开启所有的优化代码，压缩插件UglifyJsPlugin，过去需要自行配置。
    - 去掉一些只在开发中运行的代码。
    
`process.env.NODE_ENV`值用于再开发中进行环境判断。

**package.json**
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.pro.js"
},
```
再对npm script进行修改，指定对应配置文件。

> es6配置

下面我们进行es6的配置，由于es6未被所有浏览器全面支持，所有我们在使用的时候还想需要将其转换为es5.主要用到的工具是babel，先进行babel依赖的安装。
```
npm i -D @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader
```
**webpack.base.js**
```
...略
module:{
    rulse:[
        ...略
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }
    ]
}
```
配置loader，这里的exclde选项用于忽略一些文件(敲黑板)，减少webpack的处理量。/node_modules/都是已经转好的文件。

**新增.babelrc文件**
```
webpack-demo
|- config
    |- 略
|- package.json
|- src
    |- 略
|- .babelrc
```
```
{
    "presets": ["@babel/preset-env"], 
    "plugins": ["@babel/plugin-transform-runtime"] 
}
```
- presets(设定转码规则)：过去需要进行规则集指定，现在使用`@babel/preset-env`搭配`@babel/core`解决
- plugins(插件)：`transform-runtime` 插件表示不管浏览器是否支持ES6，只要是ES6的语法，它都会进行转码成ES5

> resolve

这些选项能设置模块如何被解析。在vue开发中通常使用的`@/xxx/xxx`就是将@符号配置为src目录。这样webpack就能快速的找到该路径，这样的配置不仅可以方便开发，而且可以优化构建时间，减轻webpack的工作量。另外还可以配置后缀名的自动补全。
```
resolve: {
    extensions: [ '.js', '.vue', '.scss', '.css'], //后缀名自动补全
    alias: {                                       //别名
        '@': path.resolve(__dirname, '../src'),
    }
},
```
> vue配置

最后我们进行vue的配置,先安装依赖。

```
npm i -D vue vue-loader vue-style-loader vue-template-compiler
```
- vue-loader是vue的loader,vue文件是一个SFC类文件，vue-loader会将其解析成为三部分，template部分用于渲染视图，js，style。
- vue-style-loader用于处理vue-loader解析后的style.
- vue-template-compiler用于处理解析解析后的template.

先进行目录改造
```
webpack-demo
|- config
    |- 略
|- package.json
|- src
    |- components
        |- HelloWorld.vue
    |- views
        |- App.vue
    |- asset
        |- img.png
        |- style.css
    |- index.html
    |- index.js
|- .babelrc
|- package.json
```

**webpack.base.js**
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    ...略
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "vue-style-loader",
                    "css-loader"
                ]
            },{
                test: /\.(png|svg|jpg|gif)$/,
                use:'url-loader',
                
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },{
                test:/\.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',     //文件名
            template: './src/index.html', //模板文件
        })    
    ]
}
```
在这里我们还需要安装VueLoaderPlugin(),并且需要进行HtmlWebpackPlugin的重新配置，我们需要使用自己的template，因为必须创建一个div入口，将vue实例挂载在这上面。按原来方式使用该插件的话，无法创建div入口。

**index.html**
```
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>webpackStudy</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```
**index.js**
```
import Vue from 'vue'
import App from './views/APP'
import '@/asset/style'

new Vue({
    el:'#root',
    render: h => h(App)
})
```
**HelloWorld.vue**
```
<template>
    <div>
        <img src="../asset/img.png" alt="">
        <p>一起学习前端吧</p>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
p{
    font-size: 50px;
}
</style>
```
**App.vue**
```
<template>
  <div id="app">
    <hello-world></hello-world>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>
```

- index.js依旧是我们的webpack入口文件，我们将css文件和APP.vue入口文件引入，进行vue实例化，挂载在root节点上（index.html文件的root节点）。
- 然后就可以开始组件开发啦。

> 附加

安装一个`ProgressBarPlugin`来查看打包进度.
```
npm i -D progress-bar-webpack-plugin
```
```
plugins:[
    new ProgressBarPlugin()//打包进度条
]
```
## github
代码在我的[github仓库](https://github.com/super-YUE/webpakcStudy)step2分支。

## END

webpack这个技能栈将会是前端工程师必备的，对于小白来说，刚开始可能会不太好理解，其实不用把他看到太难，就是文件从哪来到哪里去的一个打包工具而已，我们所做的只是把他的各个模块的从哪来到哪去的问题配好，将每一部分都弄懂。接下来需要做的就是在此基础上进行开发了。

