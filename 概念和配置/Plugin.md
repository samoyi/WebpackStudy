# Plugin

## 作用
1. While loaders are used to transform certain types of modules, plugins can be
leveraged to perform a wider range of tasks.
2. 也即是说，webpack 核心以外的任务中，除了模块化的任务是使用 loader 来完成的，其他任务
都是由插件来处理。
3. 但其实，webpack itself is built on the same plugin system that you use in your
 webpack configuration。
4. Since you can use a plugin multiple times in a config for different purposes,
 you need to create an instance of it by calling it with the new operator. 这是与
loader 的使用不同的地方。

## 原理
### Basic plugin architecture
Plugins are instanceable objects with an `apply` method on their prototype.
This `apply` method is called once by the Webpack compiler while installing the
plugin. The `apply` method is given a reference to the underlying Webpack
compiler, which grants access to compiler callbacks. A simple plugin is
structured as follows:
```js
function HelloPlugin(options) {
    // Setup the plugin instance with options...
}

// When applying a plugin to the Webpack environment, the plugin will receive a
// reference to this compiler. Use the compiler to access the main Webpack
//  environment.
HelloPlugin.prototype.apply = compiler => {
    compiler.hooks.run.tap('HelloPlugin', compiler => {
        console.log('Hello run!');
    });
    compiler.hooks.done.tap('HelloPlugin', compiler => {
        console.log('Hello done!');
    });
};

module.exports = HelloPlugin;
```
之后按照普通插件的使用方法，运行 webpack，当 compiler 发生 run 和 done 这个生命周期事
件的时候，就会进行 console。类似于事件绑定的思路。

### Accessing the compilation
Using the compiler object, you may bind callbacks that provide a reference to
each new compilation. These compilations provide callbacks for hooking into
numerous steps within the build process.
```js
function HelloCompilationPlugin(options) {}

HelloCompilationPlugin.prototype.apply = function(compiler) {
    // Setup callback for accessing a compilation:
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
        console.log('compilation!');
        // Now setup callbacks for accessing compilation steps:
        compilation.hooks.optimize.tap('HelloCompilationPlugin', compilation => {
            console.log("Assets are being optimized.");
        });
    });
};

module.exports = HelloCompilationPlugin;
```
输出为：
```shell
compilation!
compilation!
Assets are being optimized.
Assets are being optimized.
```


## 设计
Plugins expose the full potential of the Webpack engine to third-party
developers. Using staged build callbacks, developers can introduce their own
behaviors into the Webpack build process.


## Plugins
### `clean-webpack-plugin`
#### 使用Atom编辑器时遇到的问题
1. 只要操作了`dist`目录下的文件，即使是打开再关上，之后再build的时候会报错：
```shell
Error: EPERM: operation not permitted, mkdir 'D:\WebpackStudy\dist'
```
2. Atom项目结构里，`dist`还存在，但已经是空的了。
3. 本地磁盘里双击`dist`文件夹，会提示位置不可用，拒绝访问。
4. 在Atom项目结构里点击一下`dist`它就会消失。
5. 而即使我用Notepad++打开着其中的文件，也可以成功build
6. 看起来是Atom进行了某种锁定

### `MiniCssExtractPlugin`
不知道什么原因，这个插件不能和`style-loader`同时使用，且配置时必须要写在`css-loader`、
`'sass-loader'`之类的前面。即：
```js
use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
],
```

### `webpack-merge`
可以合并两个配置中同一个规则的不同配置值。但如果配置值有顺序要求，则必须按顺序合并：
`webpack.common.js`
```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'css-loader',
            ],
        },
    ],
},
```
`webpack.dev.js`
```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
            ],
        },
    ],
},
```
因为在配置规则时，`'style-loader'`必须在`'css-loader'`之前，即：
```js
use: [
    'style-loader',
    'css-loader',
],
```
所以在`webpack.dev.js`进行进行 merge 时，必须要按照正确的顺序：
```js
merge(dev, common);
```



## References
* [how to write a plugin](https://github.com/webpack/docs/wiki/how-to-write-a-plugin)
* [Doc](https://webpack.js.org/concepts/plugins/)
