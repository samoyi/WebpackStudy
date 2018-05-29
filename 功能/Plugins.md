# Plugins

## `clean-webpack-plugin`
### 使用Atom编辑器时遇到的问题
1. 只要操作了`dist`目录下的文件，即使是打开再关上，之后再build的时候会报错：
```shell
Error: EPERM: operation not permitted, mkdir 'D:\WebpackStudy\dist'
```
2. Atom项目结构里，`dist`还存在，但已经是空的了。
3. 本地磁盘里双击`dist`文件夹，会提示位置不可用，拒绝访问。
4. 在Atom项目结构里点击一下`dist`它就会消失。
5. 而即使我用Notepad++打开着其中的文件，也可以成功build
6. 看起来是Atom进行了某种锁定


## `MiniCssExtractPlugin`
不知道什么原因，这个插件不能和`style-loader`同时使用，且配置时必须要写在`css-loader`、
`'sass-loader'`之类的前面。即：
```js
use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
],
```


## `webpack-merge`
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
