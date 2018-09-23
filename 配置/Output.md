# Output

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


## 使用 hash 进行版本控制
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
