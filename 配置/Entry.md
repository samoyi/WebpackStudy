# Entry

1. 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
2. webpack 会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。
3. 默认值是 ./src/index.js


## 单个入口简写语法
1. 语法
    ```js
    module.exports = {
        entry: './path/to/my/entry/file.js'
    };
    ```
2. `entry`属性的单个入口语法，是下面的简写：
    ```js
    module.exports = {
        entry: {
            main: './path/to/my/entry/file.js'
        }
    };
    ```


## 对象语法
1. 语法
    ```js
    module.exports = {
        entry: {
            app: './src/app.js',
            vendors: './src/vendors.js'
        }
    };
    ```


## 多入口单输出
1. 假设现在有一个主模块`/src/index.js`和另一个模块`/src/another.js`，并且在主模块里
明确依赖`another.js`：`import print from './another'`。
2. 如果把入口设置为`entry: './src/index.js'`，那么在打包的时候就会把`another.js`也打
包进同一个文件里。
3. 但如果是在运行时依赖的，比如`import('./another')`，webpack 就不会把`another.js`打
包进同一个文件里，而是单独输出一个文件。例如分别输出为`bundle.js`和`0.bundle.js`。
4. 如果这时你仍然喜欢输出为统一的一个文件，就需要把`entry`设定为数组，并添加两个入口文
件进去


## 多入口多输出
### 多入口多输出的需求
* 如果程序比较大，全部打包为一个文件会导致该文件很大。打包为多个文件就可以拆分开来并行加
载。
* 打包为多个文件，可以按需异步加载。
* 如果要多页面应用，不同的页面需要加载不同的文件。
* 某些模块需要时常更新，某些模块不需要频繁的变更，将这两者分开来，不需要频繁更新的可以当
做静态文件，部署到独立的服务器以及设置更长的缓存。

### 设置方法
```js
entry: {
    app: './src/index.js',
    print: './src/another.js',
},
output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
},
```
将`another`模块单独打包并单独输出，这样就可以独立的加载该模块。


## 动态入口
1. 通过把`entry`的值设定为一个函数，可以动态的设定入口
2. 函数可以直接返回`entry`的值，也可以返回一个 promise，该 promise 解析的结果会作为
`entry`的值。

```js
module.exports = {
    //...
    entry: () => './src/index.js'
};
```
```js
module.exports = {
    //...
    entry: () => new Promise((resolve) => resolve(['./src/index.js', './src/another.js']))
};
```
