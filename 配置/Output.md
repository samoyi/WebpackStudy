# output

1. `output`属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。
2. 主输出文件默认为`./dist/main.js`，其他生成文件的默认输出目录是`./dist`。


## 基础配置
在 webpack 中配置`output`属性的最低要求是，将它的值设置为一个对象，包括以下两点：
    * `filename`：输出文件的文件名。
    * `path`：目标输出目录的绝对路径。
    ```js
    module.exports = {
        output: {
            filename: 'bundle.js',
            path: '/home/proj/public/assets'
        }
    };
    ```


## 多出口
1. 如果要使用多入口多出口的配置，则不能使用普通的`filename`写法，因为它会试图把所有的
输出文件都命名为同样的名字
    ```js
    entry: {
        app: './src/index.js',
        anohter: './src/another.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    ```
    `Conflict: Multiple chunks emit assets to the same filename bundle.js
    (chunks anohter and app)`
2. 必须使用占位符（substitution）来确保每个文件具有唯一的名称。
    ```js
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    ```
    输出两个文件，分别为`app.bundle.js`和`anohter.bundle.js`


## `publicPath`
1. 该配置能帮助你为项目中的所有资源指定一个基础路径。
2. 比如说你在一个组件里引用本地的一个图片：
    ```html
    <img src="../assets/images/1.jpg" />
    ```
3. 打包之后，`dist`里会生成一个 JS 文件和一个图片文件。
    ```
    dist
     |- 5a339e90d795e76df54beaa5a26dc465.jpg
     |- app.bundle.js
     |- index.html
    ```
    按照这个结构直接部署运行，没问题。
4. 但正常的情况下，你可能有很多图片，把它们都放到根目录里显然不合适，所以你会把结构变成
如下
    ```
    dist
     |- app.bundle.js
     |- index.html
     |- assets
          |- 5a339e90d795e76df54beaa5a26dc465.jpg
    ```
5. 但现在`<img src="../assets/images/1.jpg" />`就找不到图片了，因为你只是擅自修改了
图片的路径，并没有通知 webpack，所以 webpack 仍然会从根目录下面找。
6. 这时就需要用到`publicPath`，这个属性会告诉 webpack，我的资源都会放到这个路径下面。
7. 这可以是相对路径也可以是绝对路径，远程 URL 路径也可以。
8. 现在如下设置，告诉 webpack 图片的路径是相对于`path`中设定的路径的`assets`子目录
    ```js
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './assets/',
    }
    ```
9. 另外，上面说了设定为远程 URL 路径也可以，所以这就可以将资源放在 CDN 服务器中。
10. 例如你打算把资源放在如下目录里：`http://cdn.example.com/assets/`，那只要把
`publicPath`设定为上述路径，加载图片的路径就会变为`http://cdn.example.com/assets/5a339e90d795e76df54beaa5a26dc465.jpg`

### 动态设定
1. 可以在入口起点通过全局变量`__webpack_public_path__`动态设定 publicPath
2. 在这里设置时如果适应相对路径，仍然是相对于`output.path`，而不是当前文件
    ```js
    // src/index.js
    __webpack_public_path__ = './assets/';
    ```


## 在生产环境中使用 hash 进行版本控制
### 构建级别 hash
1. 在构建生产版本时，每个构建版本可以用唯一的 hash 来区分，便于版本控制
2. 如果要给整体的构建添加 hash，可以如下配置
    ```js
    output: {
        filename: 'app.[hash].js',
        path: `${path.resolve(__dirname, 'dist')}/[hash]`,
    }
    ```
3. 所有打包输出的都会放在一个以 hash 值命名的文件夹内，并且所有的 bundle 都会带上本次
构建过程的 hash。`dist`中会是类似下面的结构：
    ```
    dist
     |- bf0768da879505631289
             |- 5a339e90d795e76df54beaa5a26dc465.jpg
             |- app.bf0768da879505631289.js
     |- index.html
    ```
4. 之后如果再输出一个新的生产版本，又会匹配一个新的 hash。第二次输出时，`dist`会变成类
似如下结构：
    ```
    dist
     |- 871ff1044501272416f6
             |- 5a339e90d795e76df54beaa5a26dc465.jpg
             |- app.871ff1044501272416f6.js
     |- bf0768da879505631289
             |- 5a339e90d795e76df54beaa5a26dc465.jpg
             |- app.bf0768da879505631289.js
     |- index.html
    ```
5. 现在就可以用新的`app.js`替换旧的，刷新缓存。
6. 另一个问题是，通常生成 hash 值太长了以致没有必要，可以通过添加长度参数的方式来
slice hash 值。例如本次构建的 hash 是`871ff1044501272416f6`，如果写成`[hash:8]`，那
文件夹或文件命名中的 hash 值就只会截取前 8 位，例如：`app.871ff104.js`。

### chunk 级别 hash
1. 使用构建级别 hash 有个问题，就是，比如说你输出了两个 JS 文件，这两个文件都带有相同的
hash。
    ```js
    entry: {
        app: './src/index.js',
        another: './src/another.js',
    },
    output: {
        filename: '[name].[hash:8].js',
        path: `${path.resolve(__dirname, 'dist')}/[hash]`,
    },
    ```
    两个文件是：`app.5f4b8930.js`和`another.5f4b8930.js`
2. 下次你只更新了 app 模块，重新构建输出后，another 模块也换了新的 hash。
3. 那么部署更新的时候，你要么两个文件都更新，这会导致 another 模块刷新本不该刷新的缓存。
这只是有两个文件的情况，如果有多个文件且只有少数更新了，就会有很多没有更新的文件刷新缓存。
4. 要么你就要明确的找出来生成的哪些文件是真正有更新的，然后只更新这些文件。但是对于依赖
复杂的情况，想要找出来也不是很容易的事情。
5. 所以就要使用 chunk 级别的 hash，即`chunkhash`
    ```js
    entry: {
        app: './src/index.js',
        another: './src/another.js',
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].[chunkhash:8].js',
        // 文件夹名还可以使用构建级别的 hash
        path: `${path.resolve(__dirname, 'dist')}/[hash]`,
    },
    ```
9. 这样，app 和 another 都有了各自独立的 hash。下次只更新了 app 模块，输出的两个
chunk 中只有 app 对应的文件名 hash 会更新，another 对应的文件名还是和之前的一样。这样
整体部署更新时，就只有更新过的文件会刷新缓存。

### `index.html`引用脚本的问题
1. 现在的 bundle 会自动带上参数，但截至目前为止，`index.html`引用脚本的代码依然是
    ```html
    <script src="app.js"></script>
    ```
2. 也就是说每次构建后，都要修改`index.html`中引用脚本的`src`属性才行。
3. 这就需要用到`htmlwebapckplugin`插件，它会根据生成的 bundle 名称自动生成引用该
bundle 的`index.html`文件。

### 不要在开发环境中使用 hash
1. 首先一个明确的错误会出现，就是 HMR 不能和 `chunkhash`/`contenthash`共存，否则就会
报错。看起来 HMR 无法处理更换 bundle 文件的问题。但是使用`hash`仍然可以。
2. 而且还会造成其他问题，比如内存泄露，因为 dev server 不能清除之前的就 bundle 文件。
参考这个[issue](https://github.com/webpack/webpack-dev-server/issues/377)。
3. 所以应该只在生产环境的配置里使用 hash。


## 设定输出文件名称
### `output.chunkFilename`
1. 此选项决定了非入口(non-entry) chunk 文件的名称。可以参考`功能\CodeSplitting.md`中
的例子。
2. 所谓非入口 chunk 文件，先看看`配置\context&entry.md`的多入口单输出部分，里面讲到了
在动态加载模块时（`import()`），虽然被加载模块没有通过写进 entry 配置里从而被单独输出，
但这种动态加载的方式也会使它被输出为一个单独文件。这样的文件就属于非出口 chunk 文件。
3. `output.filename`可以指定入口 chunk 文件的名称，而不能指定非入口的。因为需要通过
`output.chunkFilename`来指定。例如
    ```js
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
    },
    ```
4. `filename`值的中括号里面的`name`变量是模块文件名，但`chunkFilename`的`name`变量却
不是，而是要用`import()`的注释参数`webpackChunkName`来设定
    ```js
    // 根据上面的`output`配置，`another.js`模块的输出文件将命名为`another.bundle.js`
    import(/* webpackChunkName: "another" */ './another.js')
    ```
5. `webpackChunkName`可以设定任意字符串。但一个问题，如果多个模块都动态引用了
`another.js`，而各自设定的`webpackChunkName`却不一样，会怎么办？
6. 显然不会输出多个命名不同的文件，那样就失去打包的意义了。经过我的测试，这种时候的命名
规则是：谁最短就用谁的；如果一样短，就比较首字符的；如果首字符相同，就依次比较之后的字符
。例如
    ```js
    // a.js
    import(/* webpackChunkName: "another" */ './another.js')
    // b.js
    import(/* webpackChunkName: "foo" */ './another.js')
    //输出为 foo.bundle.js

    // c.js
    import(/* webpackChunkName: "foo" */ './other.js')
    // d.js
    import(/* webpackChunkName: "bar" */ './other.js')
    // 输出为 bar.bundle.js
    ```
