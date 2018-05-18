#  Automatic Compilation and Hot Module Replacement
1. Automatic Compilation的作用是修改模块是webpack会自动编译。如果使用
webpack-dev-server，编译好之后页面会自动刷新。  
2. Hot Module Replacement 的作用是在自动编译的基础上，实现无刷新的页面更新。
3. 虽然HMR可以实现父模块异步接收到它依赖的子模块，但因为没有刷新，父模块的代码并不会重
新运行一遍，所以依赖子模块数据的部分仍然会使用旧的数据。除非在`module.hot.accept`的回
调参数里面进行更新。


[Automatic Compilation的文档](https://webpack.js.org/guides/development/#choosing-a-development-tool)
[HMR的文档](https://www.webpackjs.com/guides/hot-module-replacement/)
