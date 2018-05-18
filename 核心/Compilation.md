# Compilation
[Source](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)

## Basic
A `compilation` object represents a single build of versioned assets. While
running Webpack development middleware, a new compilation will be created each
time a file change is detected, thus generating a new set of compiled assets. A
compilation surfaces information about the present state of module resources,
compiled assets, changed files, and watched dependencies. The compilation also
provides many callback points at which a plugin may choose to perform custom
actions.


## References
* [how to write a plugin](https://github.com/webpack/docs/wiki/how-to-write-a-plugin)
* [https://cloud.tencent.com/developer/article/1006353](玩转webpack（一）上篇：webpack的基本架构和构建流程)
* https://cloud.tencent.com/developer/article/1006354[](玩转webpack（一）下篇：webpack的基本架构和构建流程)
* [玩转webpack（二）：webpack的核心对象](https://lxzjj.github.io/2017/11/08/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%BA%8C%EF%BC%89/)
