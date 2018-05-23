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
behavior by server tools, build scripts, and client-side libraries. Contrary to
 expectations, `process.env.NODE_ENV` is not set to `"production"` within the
 build script `webpack.config.js`, see #2537.
3. We can use webpack's built in `DefinePlugin` to define this variable for all
our dependencies
4. 任何位于 `/src` 的本地代码都可以关联到 `process.env.NODE_ENV` 环境变量


## Minification
1. 如果使用Webpack4，直接把 `mode` 设为 `production` 即可。
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
