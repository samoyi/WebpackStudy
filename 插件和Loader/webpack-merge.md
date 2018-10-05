# webpack-merge

## 合并顺序
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


## 不能很好的合并 loader 的`options`
`webpack-merge`[好像不能很好的合并 loader 的`options`](https://github.com/survivejs/webpack-merge/issues/82)
，所以需要根据环境分别设置的 loader 就不要再通用配置文件里设置了，直接分别在开发和生产
的配置文件里设置
    ```js
    // webpack.dev.js
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'images/[name].[ext]',
                },
            },
        ],
    },
    ```
    ```js
    // webpack.prod.js
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'images/[name].[ext]',
                    publicPath: 'http://www.mycdn.com/assets/'
                },
            },
        ],
    },
    ```
