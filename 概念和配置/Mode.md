# Mode
1. In webpack4, providing the `mode` configuration option tells webpack to use
its built-in optimizations accordingly.
2. If not set, webpack sets `production` as the default value for mode.
3. 设定 `mode` 值为 `development` 或 `production` 之后，webpack 会自动配置一些相应
的插件，免去了手动配置的麻烦。具体见[文档](https://webpack.js.org/concepts/mode/)
