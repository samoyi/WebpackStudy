# Glossary
[官方Glossary](https://webpack.js.org/glossary/)


## chunk 和 bundle  的区别
* [一篇分析](https://stackoverflow.com/a/48024612)
* bundle 是打包出来的产物，chunk 是打包过程中的内部。
* 一般来说 chunk 和 bundle 是意义对应的，但并不总是。文档上没有说例外的情况是什么，上
面那篇回答说到的一个例子是同时生成 source map 时，就是一个 chunk 生成了两个 bundle。
