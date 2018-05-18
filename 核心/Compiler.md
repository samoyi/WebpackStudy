# Compiler
[Source](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)

## Basic
The `compiler` object represents the fully configured Webpack environment. This
object is built once upon starting Webpack, and is configured with all
operational settings including options, loaders, and plugins. When applying a
plugin to the Webpack environment, the plugin will receive a reference to this
compiler. Use the compiler to access the main Webpack environment.


## References
* [how to write a plugin](https://github.com/webpack/docs/wiki/how-to-write-a-plugin)
* [https://cloud.tencent.com/developer/article/1006353](玩转webpack（一）上篇：webpack的基本架构和构建流程)
* https://cloud.tencent.com/developer/article/1006354[](玩转webpack（一）下篇：webpack的基本架构和构建流程)
* [玩转webpack（二）：webpack的核心对象](https://lxzjj.github.io/2017/11/08/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%BA%8C%EF%BC%89/)
