# Code Splitting
This feature allows you to split your code into various bundles which can
then be loaded on demand or in parallel. It can be used to achieve smaller
bundles and control resource load prioritization which, if used correctly,
can have a major impact on load time.  

There are three general approaches to code splitting available:
* Entry Points: Manually split code using `entry` configuration.
* Prevent Duplication: Use the SplitChunks to dedupe and split chunks.
* Dynamic Imports: Split code via inline function calls within modules.


## Entry Points
使用多 `entry` 生成多个 bunlde

### Prevent Duplication
1. If there are any duplicated modules between entry chunks they will be
included in both bundles.
2. Use [SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) to
extract common dependencies into an existing entry chunk or an entirely new
chunk.
3. Some other useful plugins and loaders provided by the community for splitting
 code:
 * [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
    : Useful for splitting CSS out from the main application.
 * [bundle-loader](https://webpack.js.org/loaders/bundle-loader/): Used to split
    code and lazy load the resulting bundles.
 * [promise-loader](https://github.com/gaearon/promise-loader): Similar to the
    `bundle-loader` but uses promises.

### 无法动态加载模块
使用多 entry 进行代码分离的一个不足是，it isn't as flexible and can't be used to
dynamically split code with the core application logic.


## Dynamic Imports
过去是使用[require.ensure](https://webpack.js.org/api/module-methods/#require-ensure)
来实现动态加载，但现在应该使用 ES6 的运行时模块加载函数 [import()](http://es6.ruanyifeng.com/#docs/module#import)
```js
async function getComponent() {
    var element = document.createElement('div');
    const lodash = await import(/* webpackChunkName: "lodash" */ 'lodash');
    const _ = lodash.default;

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}
getComponent().then(component => {
    document.body.appendChild(component);
});
```

### Webpack Mode
使用 `webpackMode` 注释来设定模块的加载方式。一共有4种方式：`lazy`、`lazy-once`、
`eager`和`weak`。四种模式的[具体功能](https://webpack.js.org/api/module-methods/#import-)

### Webpack Chunk Name
默认情况下，webpack 会使用数字ID来命名生成的模块文件，使用 `webpackChunkName` 注释可
以指定名称
```js
import(/* webpackChunkName: "foo-image" */ "assets/images/foo.jpg");
import(/* webpackChunkName: "bar-module" */ "modules/bar");
```

### Prefetching/Preloading modules
TODO 没看懂要怎么用，试了一下没发现有什么不同


## Lazy Loading
就是在事件处理函数中使用`import()`函数动态加载模块

### Frameworks
Many frameworks and libraries have their own recommendations on how this should
be accomplished within their methodologies. Here are a few examples:
* React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
* Vue: [Lazy Load in Vue using Webpack's code splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
* AngularJS: [AngularJS + Webpack = lazyLoad](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)


## Bundle Analysis
1. You can generate the required JSON file for this tool by running
`webpack --profile --json > stats.json`
2. 然后上传到[这里](https://webpack.github.io/analyse/)进行分析


## References
* [code-splitting](https://www.webpackjs.com/guides/code-splitting/)
* [lazy-loading](https://webpack.js.org/guides/lazy-loading/)
* [Webpack and Dynamic Imports: Doing it Right](https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234)
