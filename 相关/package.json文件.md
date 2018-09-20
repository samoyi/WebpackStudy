# package.json 文件


## `name`
1. `name`和`version`两者字段结合起来，决定了一个 package 及其版本的唯一性。
2. 对一个 package 进行的更新，也必须同时更新`version`，这样才能和旧版本区分开来。
3. 如果打算将这个 package 发布，那这两个字段是必须的。否则则是可选的。
4. A name can be optionally prefixed by a scope, e.g. @myorg/mypackage. See npm-scope for more detail.
4. 名字可以添加一个 scope 前缀，例如`@myorg/mypackage`。参考[npm-scope](https://docs.npmjs.com/misc/scope)

### 规则
* 不超过214个字符，包括 scoped package 名称中的 scope 字符串。
* 不能以`.`和`_`开头
* 不能包含大写字母
* 名字将作为 URL 的一部分，以及命令行参数和文件夹名称，所以名字不能包含任何
non-URL-safe 字符。

### 一些提示
* 不要和 Node 核心模块重名
* Don't put "js" or "node" in the name. It's assumed that it's js, since you're
writing a package.json file, and you can specify the engine using the "engines"
field. (See below.)
* 名字可能会作为`require()`的参数，所以应该做到简洁明了
* 预先在 npm registry 里看看是否已经有同名 package


## `files`
1. 可选的`files`字段指定如果你的 package 被作为依赖安装，将包括里面的哪些文件，以及排
除哪些文件。
2. 默认值是`["*"]`，表示除了一些特殊的文件以外，其他文件都会包括。
3. 不管`files`字段怎么设置，上面所说的那些特殊的文件中，一些是一定会包括的（例如
`package.json`），另一些是一定会被排除的（例如`.git`）。
4. 参考`sass-loader`的源码，它的`files`设置为`["lib"]`，所以这个包在安装的时候，就不
会安装源码根目录的`test`文件夹。


## `main`
1. 这个字段应该被设置为你的 package 中的一个模块文件。
2. 以`sass-loader`为例，它的`main`字段设定为`"lib/loader.js"`。当一个程序通过
`require('sass-loader')`加载`sass-loader`时，将返回`lib/loader.js`中输出的模块。
3. 这个字段中的路径是相对于 package 的根目录的。


## `bin`
不懂


## `man`
不懂


## `directories`
不懂


## `scripts`
1. 具体参考[这里](https://docs.npmjs.com/misc/scripts)
2. 有些类似于钩子函数，提供了很多生命周期事件。
3. 看一下下面的例子。我在`sass-loader`的`package.json`的`scripts`字段里添加了一条：
    ```js
    "postuninstall": "echo 66666666666666"
    ```
    当我卸载完成`sass-loader`，就会执行`echo 66666666666666`并打印。
4. 除了自带的生命周期事件外，也可以自己定义事件，并通过`npm run 事件名`来触发事件。比如
最常见的`"dev": "webpack-dev-server"`


## `config`
1. A `config` object can be used to set configuration parameters used in package
scripts that persist across upgrades.
2. 感觉是设置环境变量的感觉。比如如下设置时：
    ```js
    "config": {
        "port": "8081"
    },
    ```
    现在我在 package 的脚本里就可以通过`process.env.npm_package_config_port`引用到
    设置的`8081`
3. 例如在 Vue-cli 2 中，`webpack-dev-server`的端口号要在`config/index.js`中设置。
如果在开发过程中需要若干次变更端口号，可以直接像上面那样设置一个`port`环境变量，然后把
`config/index.js`设置为`process.env.npm_package_config_port`，就可以方便的在
`package.json`中修改端口号了。



## 其他字段直接看文档
* `version`
* `description`
* `keywords`
* `homepage`
* `bugs`
* `license`
* `author`
* `contributors`
* `browser`
* `repository`


## References
* [官网文档](https://docs.npmjs.com/files/package.json)
* [官网文档翻译](https://www.cnblogs.com/nullcc/p/5829218.html)
* [阮一峰](http://javascript.ruanyifeng.com/nodejs/packagejson.html)
