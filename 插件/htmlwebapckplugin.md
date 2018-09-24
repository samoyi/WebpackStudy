# htmlwebapckplugin

`htmlwebapckplugin`会自动生成`index.html`文件，并引用正确的 bundle 脚本文件

## Options
### `template`
1. 默认情况下，`htmlwebapckplugin`生成的`index.html`文件没有其他多余的内容，在最简单
的 HTML 结构上只会加上引用脚本的若干个`<script>`。
2. 但有些情况下，我们可能会希望生成的`index.html`还会带上一些其他元素。比如在使用 Vue
时，vue 根实例需要挂载到一个元素上，所以我们可能希望在生成的`index.html`有一个元素比如
是`<div id="app"></div>`。
3. 这是就可以使用`template`，把它的值设定为一个模板 HTML 文件，在这个文件里，添加上
`<div id="app"></div>`，这样在`htmlwebapckplugin`生成的`index.html`中也会自动带上
该 div 元素。
