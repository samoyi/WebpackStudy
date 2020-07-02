# Code Splitting


有两种常用的代码分离方法：
* 多入口：使用 `entry` 配置手动地分离代码。
* 动态导入：通过模块的内联函数调用来分离代码。


<!-- TOC -->

- [Code Splitting](#code-splitting)
    - [多入口](#多入口)
        - [方法](#方法)
        - [存在的问题及解决方法](#存在的问题及解决方法)
            - [重复打包](#重复打包)
            - [需要根据分离的模块手动配置`entry`](#需要根据分离的模块手动配置entry)
            - [无法动态加载模块？](#无法动态加载模块)
    - [动态导入](#动态导入)
        - [优点](#优点)
        - [参数不支持纯动态表达式](#参数不支持纯动态表达式)
        - [Webpack Mode](#webpack-mode)
        - [Prefetching/Preloading modules](#prefetchingpreloading-modules)
    - [Lazy Loading](#lazy-loading)
        - [Frameworks](#frameworks)
    - [References](#references)

<!-- /TOC -->


## 多入口
### 方法
1. 这是迄今为止最简单、最直观的分离代码的方式。不过，这种方式手动配置较多，并有一些陷阱。
2. 示例：
    ```js
    // webpack.config.js
    entry: {
        index: './src/index.js',
        another: './src/another.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    ```
    ```js
    // index.js
    import _ from 'lodash';
    import another_string from './another.js';
    ```
    ```js
    // another.js
    import _ from 'lodash';
    export default 'another';
    ```
3. 构建结果如下：
    ```shell
                Asset         Size  Chunks             Chunk Names
      index.bundle.js     70.5 KiB    0, 1  [emitted]  index
    another.bundle.js     70.4 KiB       1  [emitted]  another
    ```
4. 可以看到，确实是实现了代码分离，`index` 和 `anohter` 模块分别输出了独立的文件。

### 存在的问题及解决方法
#### 重复打包
1. 从两个输出文件的尺寸上可以看出来，各自都打包了 lodash。重复的引用就会重复的打包，显然不合理的。
2. 使用 webpack 内置的 `SplitChunks` 插件，可以把相同的依赖提取出来单独输出。配置方法如下：
    ```js
    // webpack.config.js
    entry: {
        index: './src/index.js',
        another: './src/another.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    // ...
    ```
3. 再次构建，结果为
    ```js
                              Asset       Size  Chunks             Chunk Names
    vendors~another~index.bundle.js   69.5 KiB       0  [emitted]  vendors~another~index
                    index.bundle.js    1.6 KiB    1, 2  [emitted]  index
                  another.bundle.js   1.52 KiB       2  [emitted]  another
    ```
4. 可以看到，虽然这次输出了3个文件，但是却显著减少了整体的代码量。

#### 需要根据分离的模块手动配置`entry`
而且随着项目的变动，你可能有不同的模块要分离，这样就要不停的修改 `entry`。这个缺点貌似无解。

#### 无法动态加载模块？
1. 因为下面将要说到的动态导入法代码分离中，`import()` 会自动把依赖打包为单独的文件。
2. 所以在你将 `another` 模块按照上面的方法作为一个入口单独输出时，会生成一个独立的文件。但如果又在 `index` 里动态加载 `import('./another')`，又会自动生成一个独立的文件。进而造成混乱。
3. 所以，代码分离方案，应该直接使用下面的动态导入法。


## 动态导入
1. 先看一下这篇 `配置/context&entry.md` 的多入口单输出，其中说到，使用 `import()` 运行时依赖的话，依赖的模块会被单独输出一个文件。
2. 动态导入实现的代码分离就是根据这个原理。而且这种情况下，不会出现上面重复打包的情况。下面的 `index` 和 `another` 多动态导入的 lodash，lodash 会被提取出一个独立的文件。
3. 先看一下 `webpack.config.js` 的配置
    ```js
    entry: {
        index: './src/index.js', // 单入口即可
    },
    output: {
        filename: '[name].bundle.js',
        // 上面 filename 可以给输出的文件重命名，而不是使用默认的自然数命名法。
        // 但 filename 的命名只针对 entry 的入口文件，即这里只有 index.js 会重命名为index.bundle.js。
        // 而非 entry 文件，如果不设置下面的 chunkFilename，输出的 another 模块和 提取的 lodash 模块还是会用自然数命名法。
        // 具体配置参考  配置/output.md
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    ```
4. 两个模块中的引用都使用动态引用
    ```js
    // index.js

    // 注释里设置的 webpackChunkName，对应配置文件里的 chunkFilename 。
    // 会指定该模块输出后的文件名

    import(/* webpackChunkName: "another" */ './another.js')
    .then(res=>{
        console.log(res);
    });

    import(/* webpackChunkName: "lodash" */ 'lodash')
    .then(res=>{
        console.log(res);
    });
    ```
    ```js
    import(/* webpackChunkName: "lodash" */ 'lodash')
    .then(res=>{
        console.log(res);
    });

    export default `I'm another`;
    ```
5. 注意一个问题，上面两个模块都引用了 lodash 并为其重命名，如果两个重命名不同怎么办？测试结果是：谁最短就用谁的；如果一样短，就比较首字符的；如果首字符相同，就依次比较之后的字符。
6. 构建结果为
    ```shell
                       Asset       Size  Chunks             Chunk Names
             index.bundle.js   2.14 KiB       0  [emitted]  index
           another.bundle.js  189 bytes       1  [emitted]  another
    vendors~lodash.bundle.js   69.5 KiB       2  [emitted]  vendors~lodash
    ```

### 优点
和多入口方法一样实现了代码分离，同时解决了多入口方案无解的频繁修改 `entry` 问题，而且实现了动态加载模块。

### 参数不支持纯动态表达式
1. It is not possible to use a fully dynamic import statement, such as `import(foo)`. Because `foo` could potentially be any path to any file in your system or project.
2. The `import()` must contain at least some information about where the module is located. Bundling can be limited to a specific directory or set of files so that when you are using a dynamic expression - every module that could potentially be requested on an `import()` call is included. 
3. For example, ```import(`./locale/${language}.json`)``` will cause every `.json` file in the `./locale` directory to be bundled into the new chunk. At run time, when the variable language has been computed, any file like `english.json` or `german.json` will be available for consumption.
    ```js
    // imagine we had a method to get language from cookies or other storage
    const language = detectVisitorLanguage();
    import(`./locale/${language}.json`).then(module => {
        // do something with the translations
    });
    ```
    
### Webpack Mode
使用 `webpackMode` 注释来设定模块的加载方式。一共有4种方式：`lazy`、`lazy-once`、`eager` 和 `weak`。四种模式的 [具体功能](https://webpack.js.org/api/module-methods/#import-)

### Prefetching/Preloading modules
TODO 没看懂要怎么用，试了一下没发现有什么不同


## Lazy Loading
就是在事件处理函数中使用 `import()` 函数动态加载模块

### Frameworks
Many frameworks and libraries have their own recommendations on how this should
be accomplished within their methodologies. Here are a few examples:
* React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
* Vue: [Lazy Load in Vue using Webpack's code splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
* AngularJS: [AngularJS + Webpack = lazyLoad](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)


## References
* [code-splitting](https://www.webpackjs.com/guides/code-splitting/)
* [lazy-loading](https://webpack.js.org/guides/lazy-loading/)
* [Webpack and Dynamic Imports: Doing it Right](https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234)
