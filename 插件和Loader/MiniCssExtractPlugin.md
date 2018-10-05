# MiniCssExtractPlugin

不知道什么原因，这个插件不能和`style-loader`同时使用，且配置时必须要写在`css-loader`、
`'sass-loader'`之类的前面。即：
```js
use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
],
```
