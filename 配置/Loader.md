# Loader


## Rule
每个规则可以分为三部分 - 条件(condition)，结果(result)和嵌套规则(nested rule)。

### Rule 条件

### Rule 结果

### 嵌套的 Rule
1. 可以使用属性`rules`和`oneOf`指定嵌套规则。
2. 这些规则用于在规则条件(rule condition)匹配时进行取值。

#### Rule.enforce
1. 可能的值有：`"pre"` | `"post"`
2. 文档中下面的解释不懂，单说一下使用`"pre"`的一个例子。
3. 加入你要对 JS 文件使用`eslint-loader`和`babel-loader`，那显然你应该先对它使用
`eslint-loader`然后再使用`babel-loader`。
4. 那么在配置`use`的时候，就要注意顺序。因为`use`数组中设定的 loader 在使用时是按照从
右往左的顺序，所以应该像下面这样配置
    ```js
    module.exports = {
        // ...
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        "babel-loader", // 后
                        "eslint-loader", // 先
                    ],
                },
            ],
        },
        // ...
    }
    ```
5. 不过你也可以更明确的指定`eslint-loader`检查源代码而不`babel-loader`转义后的代码。
这时你需要用到 Rule.enforce 配置，并且值要设定为`"pre"`，并把`eslint-loader`的配置独
立出来
    ```js
    module.exports = {
        // ...
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
            ],
        },
        // ...
    }
    ```

#### Rule.exclude 和 Rule.include
1. 这两个选项的值都是数组，数组项是绝对路径，可以是目录也可以是具体文件。
2. Rule.exclude 对应的数组项指定该 loader 不去处理指定的目录下的文件或指定的文件；
Rule.include 对应的数组项指定该 loader 只处理指定目录内的文件或指定的文件。
3. 使用这两个配置可以保证不处理不必要的文件；而且可以因为不用去没用的目录查找文件，会减
少打包时间。
4. 比如你要用`babel-loader`来转码 JS 文件，如果你只配置了`test: /\.js$/`，那
`babel-loader`就会转码所有的 JS 文件，包括`/node_modules/`里的所有 JS 文件，而这显然
是不必要的。
5. 这时就可以通过 Rule.exclude 选项来排除
    ```js
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    }
    ```
6. Rule.include 则是相反，指明 loader 应该处理指定的目录下的文件或指定的文件。
7. 实测看起来应该是用了 Rule.include 就没必要用 Rule.exclude 了
    ```js
    {
        test: /\.js$/,
        // exclude: /node_modules/,
        include: /src/,
        loader: 'babel-loader',
    }
    ```
    按照上面配置，打包速度比上面用 Rule.exclude 的速度快了一点点。如果 `babel-loader`
    也处理了`node_modules`中的文件，那应该更慢才对。
8. 一个不懂的问题是，如果我 include 的路径带有子路径，必须要用数组+字符串的形式才能有效
    ```js
    {
        test: /\.js$/,
        // include: /src\/modules/,
        include: [
            path.resolve(__dirname, 'src/modules'),
        ],
        loader: 'babel-loader',
    }
    ```
    我如果是用注释中正则的写法，则`src/modules`下的 JS 文件并不会被处理。

#### Rule.options
1. 设定一些 loader 处理过程中需要的参数
2. 例如`url-loader`可以在`options`中设置一个`limit`属性，来限定文件的最大值。
    ```js
    {
        loader: 'url-loader',
        options: {
            limit: 8192
        }
    }
    ```
