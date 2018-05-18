# Loaders

## 作用
1. Out of the box, webpack only understands JavaScript files.
2. Loaders allow webpack to process other types of files and converting them
into valid modules that can be consumed by your application and added to the
dependency graph.
3. 这里说到的“converting them into valid modules”，这里说的模块并不是js模块，并不是
说真的把一个例如jpg文件转换为js模块。而是说，将一个文件“模块化”了。文件本身可能并没有变
，但它的身份已经被纳入了模块体系中。
4. 例如，file-loader仅仅是拷贝文件并重命名而已。但经过webpack和file-loader的处理后，
可以在js文件里这样写了：
```js
import Icon from './assets/icon.jpg';
```
虽然这里`Icon`保存的其实是build之后的图片路径字符串，而非图片的二进制值。但从用法上来看
，这个图片已经被视为一个模块了。
5. TODO 但是模块化有什么用？


## 原理


## 设计
### 一切皆模块，小模块组成大模块
#### 最初，我们提到模块，只会想到js和css。
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
1. component1和component2才是独立且完整的功能体。
2. TODO 但是不是用webpack或其他工具，component1和component2是不是也能作为一个独立模
块呢？要移植的话，直接拷贝过去，然后html引用js和css不是也可以吗？

### 一个模块中引用了某个文件，则该文件也需要配置相应的loader
假设已经配置好了css文件的loader，但没有配置图片的loader，例如file-loader
```css
.another {
  width: 400px; height: 400px;
  border: solid 1px;
  background: url('./assets/icon1.jpg');
}
```
加载该css文件为模块：
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

1. 如果css文件里不引用图片，是没有问题的。webpack会将加载该css并解析可用的模块。  
2. 但如果该css文件里还引用了其他**本地**资源，则webpack还会试图将其加载并解析为模块。
3. 这是必要的，因为build之后，icon1.jpg这个文件的路径就不再是`./assets/icon1.jpg`。
这个图片会被拷贝到`dist`目录的根目录，所以包括文件名在内的路径都会发生变化。（文件名要
变为文件内容的hash是因为如果有以下两个文件，`src/image/a/icon.png`和
`src/image/b/icon.png`，只拷贝不改名的话就会冲突）
4. 以为webpack自身不能处理该图片文件，所以必须要有对应的loader去处理，在没有找到需要的
loader时，就会出现上述错误。
3. 只有本地文件才会触发webpack去寻找相应的loader来处理，因为远程文件永远只要引用远程路
径就行了。
