# Development Environment

## 开发环境的要求
* Source Maps
* Automatic Compilation
* Hot Module Replacement


## Source Maps
1. When webpack bundles your source code, it can become difficult to track down
errors and warnings to their original location.
2. In order to make it easier to track down errors and warnings, JavaScript
offers source maps, which maps your compiled code back to your original source
code.
3. Webpack使用`devtool`配置选项来设置source maps的生成。具体的配置见[文档](https://webpack.js.org/configuration/devtool/)
4. Use the `SourceMapDevToolPlugin` for a more fine grained configuration.
5. Use `source-map-loader` to deal with existing source maps.


## Automatic Compilation
有[三种方法](https://webpack.js.org/guides/development/#choosing-a-development-tool)
可以实现，不过绝大多数都是使用`webpack-dev-server`，并使用`NPM Scripts`

[webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)
### 配置
`package.json`
```json
"scripts": {
    "dev": "webpack-dev-server --open",
},
```

`webpack.config.js`
```js
devServer: {
    // This tells webpack-dev-server to serve the files from the dist directory
    contentBase: './dist'
},
```

### 功能
1. 命令行执行`npm run dev`后，NPM will automagically reference the binary in
`node_modules` for you, and execute the file or command.
2. It will start a server instance and begin listening for connections from
`localhost` on port `8080`.
3. `--open` 参数可以实现使用默认浏览器打开上述url
4. `webpack-dev-server` is configured by default to support live-reload of files
as you edit your assets while the server is running.
5. TODO 虽然[webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)
上说`--hot`参数可以启动服务器的HMR，但试了之后发现并没有


## HMR
1. HMR is one of the most useful features offered by webpack. It allows all
kinds of modules to be updated at runtime without the need for a full refresh.
2. All we need to do is update our `webpack-dev-server` configuration, and use
webpack's built in HMR plugin. 具体看[文档](https://webpack.js.org/guides/hot-module-replacement/#enabling-hmr)
3. 首先需要修改`devServer`的配置，让它开启HMR模式。
4. 然后使用Webpack内置的HMR插件。
5. 最后，如果有一个模块要实现HMR，则需要在依赖它的模块里调用HMR的接口来监听该模块的变化
，并使用回调函数进行必要的操作。
6. However, in most cases, it's not mandatory to write HMR code in every module.
If a module has no HMR handlers, the update bubbles up. This means that a single
 handler can update a complete module tree. If a single module from the tree is
updated, the entire set of dependencies is reloaded.
7. 虽然HMR可以实现父模块异步接收到它依赖的子模块，但因为没有刷新，父模块的代码并不会重
新运行一遍，所以依赖子模块数据的部分仍然会使用旧的数据。除非使用HMR的接口
`module.hot.accept`中的的回调参数里面进行更新。However, in most cases, it's not
mandatory to write HMR code in every module. If a module has no HMR handlers,
the update bubbles up. This means that a single handler can update a complete
module tree. If a single module from the tree is updated, the entire set of
dependencies is reloaded.
8. 但在实际开发中，你不需要自己调用这些接口来更新页面，一般相应的loader都会实现这些功能
。比如`style-loader`可以根据依赖变化自动更新样式，`vue-loader`可以根据依赖变化自动更
新vue组件。

### 原理
直接看[文档](https://webpack.js.org/concepts/hot-module-replacement/)


## Docs
* [Development](https://webpack.js.org/guides/development/)
* [Devtool](https://webpack.js.org/configuration/devtool/)
* [webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)
* [HMR的文档](https://www.webpackjs.com/guides/hot-module-replacement/)
* [HMR原理的文档](https://webpack.js.org/concepts/hot-module-replacement/)
