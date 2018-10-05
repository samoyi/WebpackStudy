# Plugin

## 作用
1. webpack 核心以外的任务中，除了模块化的任务是使用 loader 来完成的，其他任务都是由插
件来处理。插件目的在于解决 loader 无法实现的其他事。
2. 但其实 webpack 自身也是构建于你在 webpack 配置中用到的相同的插件系统之上。
3. 在同一个配置中你可以多次使用同一个插件来完成不完全相同的功能，因此你需要每次都创建一
个该插件的实例。这是与loader 的使用不同的地方。


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


## References
* [how to write a plugin](https://github.com/webpack/docs/wiki/how-to-write-a-plugin)
* [Doc](https://webpack.js.org/concepts/plugins/)
