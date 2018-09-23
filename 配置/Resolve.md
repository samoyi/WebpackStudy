# Resolve

这些选项能设置模块如何被解析。

## `resolve.alias`
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

### exact match
1. 假设你用 Vue。当你`import Vue from 'vue'`时，默认情况下，webpack 引用的是运行时版
本`node_modules/vue/dist/vue.runtime.esm.js`。
2. 如果你想要用完整版，虽然你可以把 vue 模块的`package.json`中的`module`从
`"dist/vue.runtime.esm.js"`改为`"vue.esm.js"`。但合理的方法还是给`vue.esm.js`的路
径设置一个别名：
    ```js
    alias: {
        'vue_full': 'vue/dist/vue.esm.js'
    },
    ```
3. 这样你可以通过`import Vue_full from 'vue_full'`引用到完整版的 Vue，而且还不影响继
续使用`import Vue from 'vue'`引用到运行时的 Vue。
4. 不过引用两个版本的 Vue 没什么必要，所以你可能直接让`import Vue from 'vue'`引用完整
版的：
    ```js
    'vue': 'vue/dist/vue.esm.js'
    ```
5. 现在通过`import Vue from 'vue'`引用的就是完整版的 Vue 了。
6. 那么新的问题是，存在如下文件`node_modules/vue/dist/foo.js`，该如何引用？
7. 普通情况下，`import {str} from 'vue/dist/foo'`就可以了。但问题是现在`'vue'`被定义
成了一个别名，所以路径`'vue/dist/foo'`就不再是预期的路径，导致无法找到`foo.js`。
8. 所以要用 exact match，只需要在别名后面加一个`$`:
    ```js
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    },
    ```
9. 这个意思是，该别名必须要精确匹配。即`'vue'`是在使用该别名，而`'vue/dist/foo'`中的
`'vue'`就只是普通的路径字符串。
10. 现在对两个文件都可以正常引用了
    ```js
    import Vue from 'vue'
    import {str} from 'vue/dist/foo'
    ```


## `resolve.extensions`
1. 如果一个模块的拓展名是`resolve.extensions`指定的数组中的其中一个，则引用该模块时不
需要加扩展名也可以。
2. `resolve.extensions`默认值是`['.wasm', '.mjs', '.js', '.json']`。
3. 如果你要用一个新数组重写该值，新数组最好也能包括上述四种默认扩展名。这样可以保证最有
效的兼容。


## `resolve.mainFields`
1. 当从 npm 包中导入模块时，此选项将决定在`package.json`中使用哪个字段指定的路径来导入
模块。
2. 根据 webpack 配置中指定的`target`不同，默认值也会有所不同。

### 默认值
#### 当`target`属性设置为`webworker`、`web`或者没有指定
1. 默认值为：
    ```js
    module.exports = {
        //...
        resolve: {
            mainFields: ['browser', 'module', 'main']
        }
    };
    ```
2. 例如，vue 的`package.json`中没有指定`target`，所以在`import Vue from 'vue'`时，
会先查找`browser`字段，没有找到；进而查找`module`字段，找到了`"dist/vue.runtime.esm.js"`
。虽然也有`main`字段，但也用不上了。（`main`指定的是 CommonJS 使用的）

#### 对于其他任意的 target
默认值为：
    ```js
    module.exports = {
        //...
        resolve: {
            mainFields: ['module', 'main']
        }
    };
    ```
