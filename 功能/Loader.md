# Loader

## 作用
1. Out of the box, webpack only understands JavaScript files.
2. Loaders allow webpack to process other types of files and converting them
into valid modules that can be consumed by your application and added to the
dependency graph.
3. 这里说到的 “converting them into valid modules”，这里说的模块并不是 js 模块，并不
是说真的把一个例如 jpg 文件转换为 js 模块。而是说，将一个文件“模块化”了。文件本身可能并
没有变，但它的身份已经被纳入了模块体系中。
4. 例如，file-loader 仅仅是拷贝文件并重命名而已。但经过 webpack 和 file-loader 的处
理后，可以在 js 文件里这样写了：
```js
import Icon from './assets/icon.jpg';
```
虽然这里 `Icon` 保存的其实是 build 之后的图片路径字符串，而非图片的二进制值。但从用法上
来看，这个图片已经被视为一个模块了。
5. Loaders allow more power in the JavaScript ecosystem through preprocessing
functions (loaders). Users now have more flexibility to include fine-grained
logic such as compression, packaging, language translations and more.


## Features
* Loaders can be chained. They are applied in a pipeline to the resource. A
chain of loaders are executed in reverse order. The first loader in a chain of
loaders returns a value to the next. At the end loader, webpack expects
JavaScript to be returned.
* Loaders can be synchronous or asynchronous.
* Loaders run in Node.js and can do everything that’s possible there.
* Loaders accept query parameters. This can be used to pass configuration to the
 loader.
* Loaders can also be configured with an `options` object.
* Normal modules can export a loader in addition to the normal main via
`package.json` with the `loader` field.
* Plugins can give loaders more features.
* Loaders can emit additional arbitrary files.


## 原理
### Resolving Loaders
1. Loaders follow the standard [module resolution](https://webpack.js.org/concepts/module-resolution/).
2. In most cases it will be resolved from the [module path](https://webpack.js.org/concepts/module-resolution/#module-paths)
 (think `npm install`,` node_modules`).
3. A loader module is expected to export a function and be written in Node.js
compatible JavaScript.


## 设计
### 一切皆模块，小模块组成大模块
#### 最初，我们提到模块，只会想到 js 和 css 。
开发目录会是这样的：
```
|- /css
|- /js
|- /image
```
这是没有模块化的，这根本没有模块，或者说只有一个大的模块。  
因为模块意味着一个个独立且完整的功能体。

#### 模块化的目录应该是这样的
```
|- /component1
|  |- 1.css
|  |- 1.js
|  |- 1.png
|- /component2
|  |- 2.css
|  |- 2.js
|  |- 2.png
```
1. component1 和 component2 才是独立且完整的功能体。
2. TODO 但是不是用 webpack 或其他工具，component1 和 component2 是不是也能作为一个独
立模块呢？要移植的话，直接拷贝过去，然后 html 引用 js 和 css 不是也可以吗？

### 一个模块中引用了某个文件，则该文件也需要配置相应的 loader
假设已经配置好了 css 文件的 loader ，但没有配置图片的 loader，例如 file-loader
```css
.another {
  width: 400px; height: 400px;
  border: solid 1px;
  background: url('./assets/icon1.jpg');
}
```
加载该 css 文件为模块：
```js
import './another.css';
```
报错：
```shell
ERROR in ./src/assets/icon1.jpg
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
(Source code omitted for this binary file)
```

1. 如果 css 文件里不引用图片，是没有问题的。webpack 会将加载该 css 并解析可用的模块。  
2. 但如果该 css 文件里还引用了其他**本地**资源，则 webpack 还会试图将其加载并解析为模
块。
3. 这是必要的，因为 build 之后，icon1.jpg 这个文件的路径就不再是`./assets/icon1.jpg`。
这个图片会被拷贝到 `dist` 目录的根目录，所以包括文件名在内的路径都会发生变化。（文件名
要变为文件内容的 hash 是因为如果有以下两个文件，`src/image/a/icon.png`和
`src/image/b/icon.png`，只拷贝不改名的话就会冲突）
4. 以为 webpack 自身不能处理该图片文件，所以必须要有对应的 loader 去处理，在没有找到需
要的 loader 时，就会出现上述错误。
5. 只有本地文件才会触发 webpack 去寻找相应的 loader 来处理，因为远程文件永远只要引用远
程路径就行了。



## loaders
### file-loader
[文档](https://github.com/webpack-contrib/file-loader)

#### 作用
1. 因为`src`的目录结构和`dist`的不同，所以`src`中各模块对文件的引用路径肯定不能用于
`dist`之中。
2. file-loader 的作用在于，它让所有模块在 build 之后，仍然能够引用到正确的文件。
3. 例如，一个图片被一个或多个模块引用的，file-loader 会把该图片 emit 到`dist`目录，然
后根据图片内容生成一个 MD5 的哈希作为图片名，并且把`dist`中所有对该图片的引用路径改为新
的路径。

#### 分析
其实 file-loader 本身做的东西很简单：拷贝文件并重命名。  
重要的是，webpack 构建了 dependency graph。
有了这个 dependency graph，webpack 就知道了哪些模块依赖了这个文件，就可以把那些模块中
对文件的引用路径改为新的文件名。
