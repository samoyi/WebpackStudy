# Entry and Context

## `context`
1. 基础目录。用于从配置中解析 entry point 和 loader。
2. 必须是绝对路径。
3. 比如`webpack.config.js`项目处于根目录，里面的`entry`设置为`./src/index.js`。按照
路径可以找到该入口文件没有问题。
4. 现在我加上`context`参数：
    ```js
    module.exports = {
        context: path.resolve(__dirname, '../'),
        entry: './src/index.js',
        // ...
    }
    ```
    现在我把基础目录设为了上一级，所以就找不到 entry 文件了，构建时就会报错。
5. `context`的默认值是当前目录，所以在上述情况下，不设置`context`刚好是正确的。
6. 但`context`的意义是，假如你的配置比较复杂，可能会被配置文件拆分并放到分类目录里，那
默认值的当前目录就不是基础目录了。
7. 例如 Vue-cli 2 中的`build/webpack.base.config.js`因为是在次一级目录，所以它内部
就把`context`设置成了`path.resolve(__dirname, '../')`。
