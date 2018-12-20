# htmlwebapckplugin


## 功能
1. The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using `script` tags.
2. If you have multiple webpack entry points, they will all be included with `script` tags in the generated HTML.
3. If you have any CSS assets in webpack's output (for example, CSS extracted with the `ExtractTextPlugin`) then these will be included with `<link>` tags in the HTML head.
4. If you have plugins that make use of it, `html-webpack-plugin` should be ordered first before any of the integrated plugins.


## Options
[完整的选项](https://github.com/jantimon/html-webpack-plugin#options)

### `template`
1. 默认情况下，`htmlwebapckplugin`生成的`index.html`文件没有其他多余的内容，在最简单
的 HTML 结构上只会加上引用脚本的若干个`<script>`。
2. 但有些情况下，我们可能会希望生成的`index.html`还会带上一些其他元素。比如在使用 Vue
时，vue 根实例需要挂载到一个元素上，所以我们可能希望在生成的`index.html`有一个元素比如
是`<div id="app"></div>`。
3. 这是就可以使用`template`，把它的值设定为一个模板 HTML 文件，在这个文件里，添加上
`<div id="app"></div>`，这样在`htmlwebapckplugin`生成的`index.html`中也会自动带上
该 div 元素。
4. 上面添加内容的方式是静态的。虽然`div`会被渲染为其他内容，但你添加的这个`div`本身是静态手动添加的。
5. 如果想要动态添加，可以使用如下语法
    ```html
    <title><%= htmlWebpackPlugin.options.hehe %></title>
    ```
    `hehe`是在配置`htmlwebapckplugin`时自定义的属性
    ```js
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      hehe: '2233',
    }),
    ```
    上面就可以吧页面的标题动态设置为`"2233"`



## Plugins
目前有[不少插件](https://github.com/jantimon/html-webpack-plugin#plugins)来增强`html-webpack-plugin`的功能。
