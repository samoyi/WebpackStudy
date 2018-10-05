# Production Environment

## 生产环境的要求
* Minification
* 适用于生产环境的 Source Mapping
* Split and minify CSS

因为开发环境和生产环境对 Webpack 的配置有着不同的要求，所以需要对配置进行分离。


## 分离 webpack 配置
1. 由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。
2. 首先需要将原来单一的`webpack.config.js`配置分为三部分：
    * 开发环境需要的配置：`webpack.dev.js`
    * 生产环境需要的配置：`webpack.prod.js`
    * 通用的配置：`webpack.common.js`
3. 开发配置和生产配置都会使用`webpack-merge`来融合通用配置
    ```js
    // webpack.dev.js
    const merge = require('webpack-merge');
    const common = require('./webpack.common.js');

    module.exports = merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            filename: '[name].bundle.js',
        },
        devServer: {
            contentBase: './dist',
        },
    });
    ```
    ```js
    // webpack.prod.js
    const merge = require('webpack-merge');
    const common = require('./webpack.common.js');

    module.exports = merge(common, {
        mode: 'production',
        output: {
            // 只在生产环境使用 hash
            filename: '[name].[chunkhash:8].js',
        },
    });
    ```
    ```js
    // webpack.common.js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        entry: {
            app: './src/index.js',
            another: './src/another.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                // ...
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html',
            }),
        ],
        // ...
    };
    ```
4. 下来需要修改`package.json`。因为之前用的是默认的`webpack.config.js`文件，所以
webpack 在进行构建时可以找到该配置文件。但现在进行了分离和改名，就需要告诉 webpack 构
建时要使用的配置文件是什么。
    ```json
    "scripts": {
        "dev": "webpack-dev-server --hot --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js"
    }
    ```
    通过`--config`参数来指明两种不同构建过程中各自需要的配置文件。



## Specify the Environment
1. 许多 library 将通过与`process.env.NODE_ENV`环境变量关联，以决定 library 中应该引
用哪些内容。
2. Technically, `NODE_ENV` is a system environment variable that Node.js exposes
into running scripts. It is used by convention to determine dev-vs-prod behavior
by server tools, build scripts, and client-side libraries.
3. `NODE_ENV`是 Node.js 暴露给运行时的脚本的一个系统环境变量，按照惯例它被用于判断当前
是开发环境还是生产环境，服务器工具、构建脚本和客户端 library 会因此做出不同的决策。
4. 但因为当前环境是要在`webpack.config.js`中设定的，所以在该配置文件中访问`NODE_ENV`
属性的值是`undefined`。因而不能在配置文件中用该属性来决定怎样配置，例如下面的是不行的：
    ```js
    process.env.NODE_ENV === 'production'
                             ? '[name].[hash].bundle.js'
                             : '[name].bundle.js'
    ```
    还是要通过分离开发和生产配置文件，并使用不同的构建命令来加载不同的配置文件。
3. 有两个地方需要根据不同的环境来做出不同的决策：编译时和编译后。  
设定编译后的环境可以使用 Webpack 的 `DefinePlugin` 插件；如果要设定在编译时的环境，需
要在命令行进行设定。

### 编译时根据 `NODE_ENV` 决定不同编译策略
1. 例如需要仅在生产环境时才使用 `MiniCssExtractPlugin` 插件，所以要在编译时，即
`webpack.config.js` 文件中获得 `process.env.NODE_ENV`。
2. 由于 `DefinePlugin` 插件设置 `process.env.NODE_ENV` 也是在编译时，它只能作用于编
译后。
3. 例如要将设置为`development`:
    * 在 `Windows` 中：`SET NODE_ENV=development`
    * 在 OS X 或 Linux 中：`export NODE_ENV=development`
4. 在 `package.json` 的 `script` 属性中会进行环境设置：
```json
"dev": "SET NODE_ENV=development&& webpack-dev-server --hot --config webpack.dev.js",
"build": "SET NODE_ENV=production&& webpack --config webpack.prod.js"
```
`&&`可以连接两个命令。前面没有加空格，是因为如果有空格，则 `NODE_ENV` 的值也会带上后面
的空格。

### 编译后根据 `NODE_ENV` 决定不同脚本策略
如果已经在 `package.json` 中设置了 `NODE_ENV` ，就不需要再进行下面的设置了  

1. 例如某些库会根据环境来进行不同的错误提示
2. Contrary to expectations, `process.env.NODE_ENV` is not set to `"production"`
 within the build script `webpack.config.js`, see [#2537](https://github.com/webpack/webpack/issues/2537).
3. We can use webpack's built in `DefinePlugin` to define this variable for all
our dependencies
4. 任何位于 `/src` 的本地代码都可以关联到 `process.env.NODE_ENV` 环境变量



## Minification
1. 如果使用 Webpack4，直接把`mode`设为`production`即可。
2. If not set, webpack sets `production` as the default value for `mode`. 也就是
说，开发环境的配置里必须要把`mode`设为`development`
3. 如果用之前的版本，就使用`UglifyJSPlugin`插件


## Source Mapping
We encourage you to have source maps enabled in production, as they are useful
for debugging as well as running benchmark tests. That said, you should choose
one with a fairly quick build speed that's recommended for production use.


## Split and minify CSS
* [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
* 该插件适用于 webpack 4，较之前的的 `extract-text-webpack-plugin` 有了若干提升，但
不支持HMR，不过你应该是只在生产环境使用该插件，所以没什么影响。


## References
* [Production](https://webpack.js.org/guides/production/)
