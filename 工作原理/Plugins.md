# Plugins

## 作用
1. While loaders are used to transform certain types of modules, plugins can be
leveraged to perform a wider range of tasks.
2. 也即是说，webpack核心以外的任务中，除了模块化的任务是使用loader来完成的，其他任务都
是由插件来处理。
3. 但其实，webpack itself is built on the same plugin system that you use in your
 webpack configuration。
4. Since you can use a plugin multiple times in a config for different purposes,
 you need to create an instance of it by calling it with the new operator. 这是与
loader的使用不同的地方。

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
之后按照普通插件的使用方法，运行webpack，当compiler发生done和done这个生命周期事件的时
候，就会进行console。类似于事件绑定的思路。

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
Plugins expose the full potential of the Webpack engine to third-party developers. Using staged build callbacks, developers can introduce their own behaviors into the Webpack build process.

## References
* [how to write a plugin](https://github.com/webpack/docs/wiki/how-to-write-a-plugin)
* [Doc](https://webpack.js.org/concepts/plugins/)
