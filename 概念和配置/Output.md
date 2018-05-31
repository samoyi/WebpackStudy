# Output

## Function
[Concept](https://webpack.js.org/concepts/output/)  
Configuring the `output` configuration options tells webpack how to write the
compiled files to disk.  


## Configuration
[Configuration](https://webpack.js.org/configuration/output/)

### publicPath
参考【功能-PublicPath】

### Substitutions
If your configuration creates more than a single "chunk" (as with multiple entry
 points or when using plugins like CommonsChunkPlugin), you should use
substitutions to ensure that each file has a unique name.
```js
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}

// writes to disk: ./dist/app.js, ./dist/search.js
```

### output.chunkFilename
This option determines the name of non-entry chunk files. 这些文件是在 runtime 而
非编译时生成的。参考[动态加载模块](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
时 `output.chunkFilename` 的作用。
