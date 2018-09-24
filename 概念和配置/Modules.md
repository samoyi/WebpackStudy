# Modules

## 模块化
1. 在模块化编程中，开发者将程序分解成离散功能块(discrete chunks of functionality)，
并称之为模块。
2. 每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。
3. 精心编写的模块提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计
和明确的目的。
4. Node.js 从最一开始就支持模块化编程。然而，在 web 浏览器方面，模块化的支持进程比较缓
慢。因此存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。webpack 基于从这
些系统获得的经验教训，并将模块的概念应用于项目中的任何文件。


## webpack 模块
对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：
    * ES2015 `import`语句
    * CommonJS `require()`语句
    * AMD `define`和`require`语句
    * css/sass/less 文件中的`@import`语句。
    * 样式`(url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接(image url)


## 支持的模块类型
1. webpack 通过 loader 可以支持各种语言和预处理器编写模块。
2. Loader 告诉 webpack 如何处理非 JavaScript 模块，并且在 bundle 中将这些模块作为依
赖引入。
3. webpack 社区已经为各种流行语言和语言处理器构建了 loader，包括：
    * CoffeeScript
    * TypeScript
    * ESNext (Babel)
    * Sass
    * Less
    * Stylus
4. 总的来说，webpack 提供了可定制的、强大和丰富的 API，允许任何技术栈使用 webpack，保
持了在你的开发、测试和生成流程中无侵入性(non-opinionated)。不懂何为无侵入性。


## resolver —— webpack 模块解析器
1. 不管是来自本应用中还是来自第三方的的模块，可以使用下面的方式进行加载：
    ```js
    import foo from 'path/to/module';
    // or
    require('path/to/module');
    ```
2. resolver 是一个库(library)，用于帮助找到模块的绝对路径。
3. 针对每一个`require`/`import`语句，resolver 帮助 webpack 解析到模块的绝对路径
4. 当打包模块时，webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve)
来解析文件路径


## 解析规则
使用 enhanced-resolve，webpack 能够解析三种文件路径：

### 绝对路径
```js
import '/home/me/file';
import 'C:\\Users\\me\\file';
```
由于我们已经取得文件的绝对路径，因此不需要进一步再做解析。

### 相对路径
1. 在这种情况下，使用`import`或`require`的资源文件(resource file)所在的目录被认为是
上下文目录(context directory)。
2. 在`import`/`require`中给定的相对路径，会添加此上下文路径(context path)，以产生模
块的绝对路径(absolute path)。
3. 对于下面的例子，
    ```js
    // index.js
    import {foo} from './foo.js' // 在上下文目录中
    const bar = require('../bar.js'); // 在上下文目录外层
    ```
    * `index.js`所在的目录是`/src/`
    * `foo.js`的路径是`/src/foo.js`，
    * `bar.js`的路径是`/bar.js`

### 模块路径
```js
import 'module';
import 'module/lib/file';
```
1. 模块将在`resolve.modules`中指定的所有目录内搜索。
2. `resolve.modules`的默认值是`['node_modules']`，即当前目录下的`./node_modules`。
3. 如果`./node_modules`不存在，则向外层查找`../node_modules`，以此类推。
4. 模块的路径可以通过`resolve.alias`配置项来设置一个别名。

#### 如果路径指向一个文件
1. 如果路径具有文件扩展名，则直接将文件打包。
2. 否则，将使用`resolve.extensions`选项作为文件扩展名来解析。

#### 如果路径指向一个文件夹
则采取以下步骤找到具有正确扩展名的正确文件：
1. 如果文件夹中包含`package.json`文件，则按照顺序查找`resolve.mainFields`配置选项中指
定的字段。并且`package.json`中的第一个这样的字段确定文件路径。
    1. 例如在默认情况下，在`/src/index.js`中引用`Vue`模块。
    2. 先确定目录`../node_modules`，在其中找到了`vue`文件夹。
    3. 文件夹里包含`package.json`文件。
    4. 默认情况下`resolve.mainFields`的配置值为`['browser', 'module', 'main']`。
    5. 优先在`package.json`中查找`browser`字段，没找到。
    6. 再找`module`字段，找到了值为`"dist/vue.runtime.esm.js"`，于是加载该文件作为
        `Vue`模块。
2. 如果`package.json`文件不存在，或者`package.json`文件中的`resolve.mainFields`指定
的字段都没有返回一个有效路径，则按照顺序查找`resolve.mainFiles`配置选项中指定的文件名，
看是否能在`import`/`require`目录下匹配到一个存在的文件名。注意这里只是文件名，不包括路
径，也就是说文件必须在`import`/`require`目录下。
    1. 继续上面的例子。因为`webpack.config.js`没有配置`resolve.mainFiles`，所以
    `resolve.mainFiles`使用默认值`['index']`。
    2. 如果删除了`node_modules\vue\package.json`里面的`main`和`module`字段，加载
    Vue 的路径就会是`/src/index.js`。因此就会报错。
    3. 不懂。我把打包入口文件重命名为`index1.js`，把`vue.runtime.esm.js`重命名为
    `index.js`放到`index1.js`，还是找不到模块。
3. 文件扩展名通过`resolve.extensions`选项采用类似的方法进行解析。


## References
* [模块](https://webpack.docschina.org/configuration/module/)
* [模块解析](https://webpack.docschina.org/concepts/module-resolution/)
