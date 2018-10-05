# file-loader / url-loader

## Options
### `context`
1. 不懂这个要怎么用，我设定了一个不存在的路径，构建结果都是正常的。
2. 但是对下面设定`name`属性确实有影响。

### `emitFile`
1. 默认是`true`，如果是`false`就不会把文件 emit 出来，而是返回一个 public URI
2. It is often useful to disable this option for server-side packages.

### `name`
1. 为将要 emit 的文件指定路径、文件名和扩展名
2. 默认值为`'[hash].[ext]'`

#### 定义为字符串
1. 例如想要从`context`拷贝文件到输出目录时仍然维持当前完整的路径，则可以设置为
    ```js
    // webpack.config.js
    {
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    }
    ```
2. 例如有下面的图片：`src\assets\imgs\kibunn.jpg`，打包之后的在`dist`目录里的图片路
径会是`src\assets\imgs\kibunn.jpg`。
3. 例子中的三个参数加上`hash`，就是四个可用的参数。

#### 定义为函数
1. 还可以定义为一个函数，更复杂的或更动态的来决定生成文件路径。
2. 函数接受一个参数，参数值为文件的绝对路径
3. 函数返回值为生成文件的路径，同样可以使用上面说的四个参数

```js
{
    loader: 'file-loader',
    options: {
        name (file) {
            // 这个 env 可能要通过这里讲的来配置
            // https://webpack.docschina.org/guides/environment-variables/
            // 这里还不能使用 process.env.NODE_ENV
            if (env === 'development') {
                return '[path][name].[ext]'
            }

            return '[hash].[ext]'
        }
    }
}
```

### `outputPath`
这里设置的目录会作为`name`设置的路径的外层目录
```js
{
    loader: 'file-loader',
    options: {
        name: 'imgs/hehe.jpg',
        outputPath: 'images/',
    }
}
```
输出的路径为 `images/imgs/hehe.jpg`

### `publicPath`
1. 输出文件的公共路径
2. 默认值为`__webpack_public_path__`

```js
{
    loader: 'file-loader',
    options: {
        name: 'imgs/hehe.jpg',
        publicPath: 'assets/',
    }
}
```
输出图片的路径为`'dist/imgs/hehe.jpg'`，但 HTML 引用的路径是`'dist/assets/imgs/hehe.jpg'`
