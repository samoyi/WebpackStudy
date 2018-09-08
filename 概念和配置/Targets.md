# Targets

1. 虽然 webpack 主要用于构建浏览器端程序，但因为 JS 也可以编写服务器端甚至桌面程序（例
如Electron）。
2. 所以 webpack 使用`target`属性来设置构建目标，指定编译后的代码是用在哪种环境之下的。
3. 每个 target 都有各种部署(deployment)/环境(environment)特定的附加项，以支持满足其
需求。例如，当`target`设置为`"electron"`，webpack 引入多个 electron 特定的变量。
4. 默认的 target 值是`web`，即编译为类浏览器环境里可用的代码。还有哪些 target，参考
[配置文档](https://webpack.js.org/configuration/target/)。


## Multiple Targets
尽管 webpack 不支持向`target`传入多个字符串，你可以通过打包两份分离的配置来创建同构的
库。参考[文档](https://webpack.docschina.org/concepts/targets)。


## References
* [Target概念](https://webpack.js.org/concepts/targets/)
* [Target配置](https://webpack.js.org/configuration/target/)
* [Build Targets](https://survivejs.com/webpack/output/targets/)
