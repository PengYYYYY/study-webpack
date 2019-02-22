## 为什么要学习webpack

webpack是现在主流的前端构建工具，主流公司的项目中几乎都有他的存在。很多同学接触到现代前端可能就是学习的Vue，vue-cli脚手架会自动帮你生成一个web工程，他就是基于webpack进行构建的。但是只会使用现成的脚手架工具是远远不够的，想要更深入的了解其中的运行机制还得自己从0开始搭建web工程。下面我们开始从0搭建一个简单的入门级demo。

## 入门要点

本篇文章针对的是webpack小白，看完之后呢，你将会了解到大致的webpack运行流程啦。简单的来说就是，就是我们写的文件从哪儿来到哪儿去的这么一个流程。话不多说，开始动手吧。

## 开始动手

首先创建一个文件夹webpackStudy作为我们的工程文件。

> 初始化

进入webpackStudy文件夹中，在命令行中使用`npm init`来初始化生成一个新的 package.json 文件。然后根据命令行中的提示自行设置工程名称，版本号，项目描述等选项。然后我们的文件夹目录就会多出一个package.json文件，这个文件会把web工程中的一些依赖、命令、描述等集中起来，它相当于一张制造图纸。

然后我们进行webpack的安装，webpack4.0在安装webpack的同时还需要进行webpack-cli的安装。运行命令`npm install -D webpack webpack-cli`(-D的意思是安装本地依赖)。

接下来，我们需要添加以下目录或文件。
```
webpack-demo
|- package.json
|- src
    |- index.js
|- webpack.config.js
```

- src目录是开发目录
- index.js是入口文件，负责开发目录与打包器的连接。
- webpack.config.js是webpack的配置文件，他负责操作webpack这个打包器。

> 入口（entry）

entry会指示webpack应该使用哪个模块，来作为起点模块，然后在进入起点模块以后，webpack会对起点模块的各个依赖模块进行加载和分析。

**webpack.config.js**
```
const path = require("path");
moudule.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    }
}
```
以上就是对入口的简单配置，在上面的entry对象中，配置的是单入口，会加载以index为模块名称的模块。path模块是js自带模块，用于处理文件路径和目录路径。

> 出口（output）

有入口就有出口，output属性会告诉webpack在哪里输出它经过处理后创建的文件，以及如何命名这些文件。在web工程中，整个应用程序结构都会被编译到所指定的输出路径的文件夹中。
```
const path = require("path");
moudule.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
}
```
上面的示例当中，我们指定输出路径为当前目录结构下的，dist目录，输出的文件名为bundle.js。

下面我们进行简单的测试

**src/index.js**
```
console.log("hello world");
```
**package.json**
```
略...
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
},
```
对index.js写入打印代码，同时对package.json写入script执行命令。build命令的意思是，运行`npm run build`时，会调用webpack处理webpack.config.js(默认处理文件)文件。

运行`npm run build`，此时的目录结构变成

```
webpack-demo
|- dist
    |-bundle.js
|- package.json
|- src
    |- index.js
|- webpack.config.js
```

运行`node dist/bundle`，控制台输出`hello world`。

```
运行时的警告
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to
'development' or 'production' to enable defaults for each environment.
是因为没有选择模式造成的，忽略即可。
```
> 装载（loader）

webpack自身只能理解JavaScript文件，但是项目中肯定会有其他的文件，最常用的肯定是图片文件和css文件，webpack需要依靠各类loader去处理非Javascript文件，将他们转换成webpack能够有效进行处理的模块，然后webpack会对他们进行打包处理然后输出。下面来进行css文件和图片文件的处理。首先安装依赖`npm install -D style-loader css-loader url-loader`。

```
const path = require("path");

module.exports = {
略···
    module: {
        rules: [
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
                        limit: 8192, //文件大小限制
                        name: 'images/[name].[ext]?[hash]'
                    }
                }    
            }
        ]
    }
}
```
- test选项用于标识出应该被对应的loader进行转换的某种文件。
- use选项表示转换时对应的loder。use对应的数组的处理顺序是从后往前。
- options可以进行一些选项的配置，图片处理中limit选项是限制文件的大小，而name选项中的name是对应的文件名，ext则是文件的后缀，hash则是该文件的hash码。

**测试**

向src目录中添加图片，以及新建一个style.css文件。向dist目录添加一个index.html文件,来展示打包后的内容。
```
webpack-demo
|- dist
    |-index.html
    |-bundle.js
|- package.json
|- src
    |- index.js
    |- img.png
    | -style.css
|- webpack.config.js
```
**src/index.js**
```
import "./style.css"
import imgUrl from "./img.png"

function createComponent(){
    var element = document.createElement('div');
    element.innerHTML = ['hello webpack'];
    return element;
}
function createImg(){
    var imgBox = document.createElement('img');
    imgBox.src = imgUrl;
    return imgBox;
}

document.body.append(createComponent(),createImg());
```
**src/style.css**
```
body{
    text-align: center;
    color: blueviolet;
    font-size: 40px;
    font-weight:bold;
}
```
**dist/index.html**
```
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpackStudy</title>
</head>
<body></body>
<script src="./bundle.js"></script>
</html>
```

运行`npm run build`后，然后打开dist里面的index.html你将会看到你再src/index.js里面写的内容。

> 插件（plugins）

前面说到，webpack会把工程目录下的文件处理然后打包到dist目录中去。按理说，dist目录中不应该由我们创建文件的，所以这时候插件（plugins）派上用场了。

插件相对于loader来说，可以执行更广的任务，从打包到压缩，到分割文件...它可以用来处理各种各样的任务。下面我们将用上`html-webpack-plugin`插件来处理dist目录中的html文件自动生成，并加载bundle资源问题。

首先安装依赖`npm install -D html-webpack-plugin`

**webpack.config.js**
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    略...
    plugins:[
        new HtmlWebpackPlugin({
            title:'WebpackTest' //设置html文件文件名称,
        })
    ]
}
```
我们添加了插件html-webpack-plugin,然后删除dist文件中的html文件,然后运行`npm run build`命令后会发现,dist目录中会自动创建index.html文件并加载bunlde.js,这都是插件在发挥作用。

> dev-server

在实际的开发中，我们不可能每进行一次修改后就打包一次，这样无疑是非常低效的。所以我们需要一个工具，可以随时让我们看到我们写的效果。webpack-dev-server就是这样一个工具，下面我们来进行安装和使用。首先安装依赖`npm install -D webpack-dev-server`

**package.json**
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open",
    "build": "webpack"，
    
},
```
- package.json中的dev命令的意思是，运行`npm run dev`时，会调用webpack-dev-server工具来执行webpack.config.js(默认文件)。
- --open选项的意思是执行该命令时自动打开浏览器访问。

运行`npm run dev`会自动打开浏览器，并访问http://localhost:8080(默认端口,如8080端口被占用会依此类推)。

## github
代码在我的[github仓库](https://github.com/super-YUE/webpakcStudy)step1分支。

## END

至此，我们就可以算是对webpack4.0入了个门。我们写出了一个简易的webpackdemo，大致了解了webpack进行打包处理，如何使用loader，如何使用插件，如何安装webpack-dev-server以便于在开发中使用。当然webpack的世界远不止于此，还有更多的内容等着我们去了解。

更多内容到另一篇文章[《webpack4.0+vue+es6配置》](https://juejin.im/post/5c68f4e9e51d454be11473b9#heading-2)