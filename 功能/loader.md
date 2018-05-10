# loaders

## file-loader
[文档](https://github.com/webpack-contrib/file-loader)

### 作用
1. 因为`src`的目录结构和`dist`的不同，所以`src`中各模块对文件的引用路径肯定不能用于
`dist`之中。
2. file-loader的作用在于，它让所有模块在build之后，仍然能够引用到正确的文件。
3. 例如，一个图片被一个或多个模块引用的，file-loader会把该图片emit到`dist`目录，然后
根据图片内容生成一个MD5的哈希作为图片名，并且把`dist`中所有对该图片的引用路径改为新的路
径。

### 分析
其实file-loader本身做的东西很简单：拷贝文件并重命名。  
重要的是，webpack构建了dependency graph。
有了这个dependency graph，webpack就知道了哪些模块依赖了这个文件，就可以把那些模块中对
文件的引用路径改为新的文件名。
