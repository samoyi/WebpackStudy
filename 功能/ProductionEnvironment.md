# Production Environment

## 生产环境的要求
* Minification
* 适用于生产环境的 Source Mapping
* Split and minify CSS

因为开发环境和生产环境对Webpack的配置有着不同的要求，所以需要对配置进行分离。

## Separate webpack configurations
[具体方法](https://webpack.js.org/guides/production/)
1. 首先需要将原来单一的Webpack配置分为三部分：
    * 开发环境需要用配置
    * 生产环境需要的配置
    * 通用的配置
      开发配置和生产配置都会使用 `webpack-merge` 来融合通用配置
2. 现在 `webpack-dev-server` 需要使用开发环境的配置，而 `build` 需要使用生产环境的配置。


## Specify the Environment
1. Many libraries will key off the `process.env.NODE_ENV` variable to determine
what should be included in the library.
2. Technically, `NODE_ENV` is a system environment variable that Node.js exposes
 into running scripts. It is used by convention to determine dev-vs-prod
behavior by server tools, build scripts, and client-side libraries.
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
1. 如果使用 Webpack4，直接把 `mode` 设为 `production` 即可。
2. If not set, webpack sets `production` as the default value for `mode`. 也就是
说，开发环境的配置里必须要把 `mode` 设为 `development`
3. 如果用之前的版本，就使用 `UglifyJSPlugin` 插件


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
