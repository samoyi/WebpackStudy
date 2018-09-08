# Module Resolution 和 `resolve` 配置


## resolver
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


## Resolving rules in webpack
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

### 如果路径指向一个文件
1. 如果路径具有文件扩展名，则被直接将文件打包。
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
    3. 不懂。我把打包入口文件重命名为`index1.js`，把`vue.runtime.esm.js`重命名为`index.js`
    放到`index1.js`，还是找不到模块。
3. 文件扩展名通过`resolve.extensions`选项采用类似的方法进行解析。


## `resolve`配置
### resolve.alias
1. 用于给路径设定一个别名
2. 例如从`/src/index.js`中引用`/module/m_foo.js`，普通情况下是要`require('../module/m_foo')`
3. 但如果如下设置两个别名
    ```js
    alias: {
        foo: '../module/m_foo',
        module: '../module/',
    },
    ```
4. 则既可以`require('foo')`也可以`require('module/m_foo')`

#### exact match
1. 假设你用 Vue。当你`import Vue from 'vue'`时，默认情况下，webpack 引用的是运行时版本
`node_modules/vue/dist/vue.runtime.esm.js`。
2. 如果你想要用完整版，虽然你可以把 vue 模块的`package.json`中的`module`从
`"dist/vue.runtime.esm.js"`改为`"vue.esm.js"`。但合理的方法还是给`vue.esm.js`的路径设置一
个别名：
    ```js
    alias: {
        'vue_full': 'vue/dist/vue.esm.js'
    },
    ```
3. 这样你可以通过`import Vue_full from 'vue_full'`引用到完整版的 Vue，而且还不影响继续使用
`import Vue from 'vue'`引用到运行时的 Vue。
4. 不过引用两个版本的 Vue 没什么必要，所以你可能直接让`import Vue from 'vue'`引用完整版的：
    ```js
    'vue': 'vue/dist/vue.esm.js'
    ```
5. 现在通过`import Vue from 'vue'`引用的就是完整版的 Vue 了。
6. 那么新的问题是，存在如下文件`node_modules/vue/dist/foo.js`，该如何引用？
7. 普通情况下，`import {str} from 'vue/dist/foo'`就可以了。但问题是现在`'vue'`被定义成了一
个别名，所以路径`'vue/dist/foo'`就不再是预期的路径，导致无法找到`foo.js`。
8. 所以要用 exact match，只需要在别名后面加一个`$`:
    ```js
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    },
    ```
9. 这个意思是，该别名必须要精确匹配。即`'vue'`是在使用该别名，而`'vue/dist/foo'`中的`'vue'`
就只是普通的路径字符串。
10. 现在对两个文件都可以正常引用了
    ```js
    import Vue from 'vue'
    import {str} from 'vue/dist/foo'
    ```

### `resolve.extensions`
1. 如果一个模块的拓展名是`resolve.extensions`指定的数组中的其中一个，则引用该模块时不需要加
扩展名也可以。
2. `resolve.extensions`默认值是`['.wasm', '.mjs', '.js', '.json']`。
3. 如果你要用一个新数组重写该值，新数组最好也能包括上述四种默认扩展名。这样可以保证最有效的兼
容。

### `resolve.mainFields`
1. 当从 npm 包中导入模块时，此选项将决定在`package.json`中使用哪个字段指定的路径来导入
模块。
2. 根据 webpack 配置中指定的`target`不同，默认值也会有所不同。

#### 默认值
* 当`target`属性设置为`webworker`、`web`或者没有指定，默认值为：
    ```js
    module.exports = {
        //...
        resolve: {
            mainFields: ['browser', 'module', 'main']
        }
    };
    ```
* 对于其他任意的 target，默认值为：
    ```js
    module.exports = {
        //...
        resolve: {
            mainFields: ['module', 'main']
        }
    };
    ```
