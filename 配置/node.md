# node

不懂


1. 这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为
Node.js 环境编写的代码，在其他环境（如浏览器）中运行。
2. 此功能由 webpack 内部的`NodeStuffPlugin`插件提供。如果 `target` 是`"web"`或
`"webworker"`，那么（即使不设置`node`？）`NodeSourcePlugin`插件也会被激活。
