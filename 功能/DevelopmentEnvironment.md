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
2. 似乎是从 webpack 4 开始，启动HRM只需要在启动 `webpack-dev-server` 的命令里加上
`--hot` 参数即可，不需要修改 `webpack.config.js` 中 `devServer` 的配置，也不需要手动
使用 `HotModuleReplacementPlugin`。  
参考这篇[文档](https://github.com/webpack/docs/wiki/webpack-dev-server#hot-module-replacement)
3. 在 webpack 4 之前， all we need to do is update our `webpack-dev-server`
configuration, and use webpack's built in HMR plugin. 具体看[文档](https://webpack.js.org/guides/hot-module-replacement/#enabling-hmr)
    1.  首先需要修改`devServer`的配置，让它开启HMR模式。
    2. 然后使用Webpack内置的HMR插件。
4. 虽然HMR可以实现父模块异步接收到它依赖的子模块，但因为没有刷新，父模块的代码并不会重
新运行一遍，所以依赖子模块数据的部分仍然会使用旧的数据。除非使用HMR的接口
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
details on the module.hot interface.
5. However, in most cases, it's not mandatory to write HMR code in every module.
If a module has no HMR handlers, the update bubbles up. This means that a single
 handler can update a complete module tree. If a single module from the tree is
updated, the entire set of dependencies is reloaded.
6. 但在实际开发中，你不需要自己调用这些接口来更新页面，一般相应的loader都会实现这些功能
。比如`style-loader`可以根据依赖变化自动更新样式，`vue-loader`可以根据依赖变化自动更
新vue组件。

### 原理
[文档](https://webpack.js.org/concepts/hot-module-replacement/)

#### In the Application
The following steps allow modules to be swapped in and out of an application:
1. The application asks the HMR runtime to check for updates.
2. The runtime asynchronously downloads the updates and notifies the application.
3. The application then asks the runtime to apply the updates.
4. The runtime synchronously applies the updates.

You can set up HMR so that this process happens automatically, or you can choose
 to require user interaction for updates to occur. TODO：怎么做？使用`import()`？

#### In the Compiler
1. In addition to normal assets, the compiler needs to emit an "update" to allow
updating from previous version to the new version. The "update" consists of two
parts:
    * The updated manifest (JSON)
    * One or more updated chunks (JavaScript)
2. The manifest contains the new compilation hash and a list of all updated
chunks. Each of these chunks contains the new code for all updated modules (or a
flag indicating that the module was removed).
3. The compiler ensures that module IDs and chunk IDs are consistent between
these builds. It typically stores these IDs in memory (e.g. with
webpack-dev-server), but it's also possible to store them in a JSON file.

#### In a Module
1. HMR is an opt-in feature that only affects modules containing HMR code. One
example would be patching styling through the `style-loader`. In order for
patching to work, the style-loader implements the HMR interface; when it
receives an update through HMR, it replaces the old styles with the new ones.
2. Similarly, when implementing the HMR interface in a module, you can describe
what should happen when the module is updated. However, in most cases, it's not
mandatory to write HMR code in every module. If a module has no HMR handlers,
the update bubbles up. This means that a single handler can update a complete
module tree. If a single module from the tree is updated, the entire set of
dependencies is reloaded.

See the [HMR API page](https://webpack.js.org/api/hot-module-replacement/) for
details on the module.hot interface.

#### In the Runtime
1. For the module system runtime, additional code is emitted to track module
`parents` and `children`. On the management side, the runtime supports two
methods: `check` and `apply`.
2. A check makes an HTTP request to the update manifest. If this request fails,
there is no update available. If it succeeds, the list of updated chunks is
compared to the list of currently loaded chunks. For each loaded chunk, the
corresponding update chunk is downloaded. All module updates are stored in the
runtime. When all update chunks have been downloaded and are ready to be applied,
the runtime switches into the `ready` state.
3. The `apply` method flags all updated modules as invalid. For each invalid
module, there needs to be an update handler in the module or in its parent(s).
Otherwise, the invalid flag bubbles up and invalidates parent(s) as well. Each
bubble continues until the app's entry point or a module with an update handler
is reached (whichever comes first). If it bubbles up from an entry point, the
process fails.
4. Afterwards, all invalid modules are disposed (via the dispose handler) and
unloaded. The current hash is then updated and all accept handlers are called.
The runtime switches back to the `idle` state and everything continues as normal.


## Docs
* [Development](https://webpack.js.org/guides/development/)
* [Devtool](https://webpack.js.org/configuration/devtool/)
* [webpack dev server的文档](https://github.com/webpack/docs/wiki/webpack-dev-server)
* [HMR的文档](https://www.webpackjs.com/guides/hot-module-replacement/)
* [HMR原理的文档](https://webpack.js.org/concepts/hot-module-replacement/)
