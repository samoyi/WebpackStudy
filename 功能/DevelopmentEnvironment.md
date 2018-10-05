# Development Environment

## 开发环境的要求
* Source Maps：编译后的代码映射回原始源代码
* Automatic Compilation：模块修改时，自动重新编译并刷新显示
* Hot Module Replacement：在 Automatic Compilation 的基础上，无刷新更新


## Source Maps
1. 当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。
2. 为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始
源代码。
3. Webpack 使用`devtool`配置选项来设置 source maps 的生成，可以有很多种配置值，来生成不同需
求的 source maps。具体的配置值见[文档](https://webpack.js.org/configuration/devtool/)
```js
module.exports = {
    // ...
    devtool: 'inline-source-map',
    // ...
};
```


## Automatic Compilation
* 有[三种方法](https://webpack.js.org/guides/development/#choosing-a-development-tool)
可以实现，不过绝大多数都是使用`webpack-dev-server`，并使用`NPM Scripts`。这里只记录
`webpack-dev-server`方法。
* `webpack-dev-server` 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
* [webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)

### 配置
1. 安装`webpack-dev-server`
2. 修改`webpack.config.js`
    ```js
    module.exports = {
        // ...
        devServer: {
            // 告知 webpack-dev-server，在 localhost:8080 下建立服务，
            // 将 dist 目录下的文件，作为可访问文件。
            contentBase: './dist'
        },
        // ...
    }
    ```
3. 在`package.json`中添加一个 script 脚本，可以直接运行开发服务器(dev server)
    ```js
    // ...
    "scripts": {
        // ...
        "dev": "webpack-dev-server --open",
        // ...
    }
    // ...
    ```
4. 在命令行中运行`npm run dev`，`webpack-dev-server`就会启动。因为加了`--open`参数，
所以默认浏览器会自动打开`http://localhost:8080/`，当然也可以不加。


## HMR
1. HMR 允许在运行时更新各种模块，而无需进行完全刷新。
2. 从 webpack 4 开始，启动 HRM 只需要在启动 `webpack-dev-server` 的命令里加上
`--hot` 参数即可，不需要修改 `webpack.config.js` 中 `devServer` 的配置，也不需要手动
使用 `HotModuleReplacementPlugin`。参考这篇[文档](https://github.com/webpack/docs/wiki/webpack-dev-server#hot-module-replacement)
    ```js
    // ...
    "scripts": {
        // ...
        "dev": "webpack-dev-server --hot",
        // ...
    }
    // ...
    ```
3. 在 webpack 4 之前，看[HMR的文档](https://www.webpackjs.com/guides/hot-module-replacement/)
4. HMR 不能和`chunkhash`及`contentHash`共用，dev server 无法处理带 hash 的热更新。
不过一般情况下也是只在开发环境配置 HMR，以及只在生产环境使用 hash。
5. 虽然 HMR 可以实现父模块异步接收到它依赖的子模块，但因为没有刷新，父模块的代码并不会重
新运行一遍，所以依赖子模块数据的部分仍然会使用旧的数据。除非使用 HMR 的接口
`module.hot.accept`中的的回调参数里面进行更新。
```js
if (module.hot) {
    module.hot.accept('./math.js', function() {
        console.log('Accepting the updated printMe module!');
        document.body.appendChild(component());
    })
}
```
See the [HMR API page](https://webpack.js.org/api/hot-module-replacement/) for
details on the `module.hot` interface.
6. However, in most cases, it's not mandatory to write HMR code in every module.
If a module has no HMR handlers, the update bubbles up. This means that a single
 handler can update a complete module tree. If a single module from the tree is
updated, the entire set of dependencies is reloaded.
7. 但在实际开发中，你不需要自己调用这些接口来更新页面，一般相应的 loader 都会实现这些功
能。比如`style-loader`可以根据依赖变化自动更新样式，`vue-loader`可以根据依赖变化自动更
新 vue 组件。

### 原理
[文档](https://webpack.js.org/concepts/hot-module-replacement/)


## 实现上述三个功能的一个配置示例
* `package.json`
    ```js
    {
        // ...
        "scripts": {
            // ...
            "dev": "webpack-dev-server --hot",
            // ...
        },
        "devDependencies": {
            // ...
            "webpack-dev-server": "^3.1.8"
        },
        // ...
    }
    ```
* `webpack.config.js`
    ```js
    const path = require('path');
    const VueLoaderPlugin = require('vue-loader/lib/plugin')

    module.exports = {
        mode: 'development',
            devServer: {
                contentBase: './dist',
            },
            entry: './src/index.js',
            devtool: 'inline-source-map',
            output: {
                filename: 'bundle.js',
                path: path.resolve(__dirname, 'dist'),
            },
            // ...
    };
    ```


## Docs
* [Development](https://webpack.js.org/guides/development/)
* [Devtool](https://webpack.js.org/configuration/devtool/)
* [webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)
* [HMR的文档](https://www.webpackjs.com/guides/hot-module-replacement/)
* [HMR原理的文档](https://webpack.js.org/concepts/hot-module-replacement/)
