# Modules

## What is a webpack Module


## Resolution
### Resolver
1. A resolver is a library which helps in locating a module by its absolute path.
2. A module can be required as a dependency from another module.
3. The dependency module can be from the application code or a third party
library.
4. The resolver helps webpack find the module code that needs to be included in
the bundle for every such `require`/`import` statement.
5. webpack uses [enhanced-resolve](https://github.com/webpack/enhanced-resolve)
to resolve file paths while bundling modules.

### Resolving rules
Using `enhanced-resolve`, webpack can resolve three kinds of file paths:
* Absolute paths
* Relative paths
* Module paths

### Resolve module paths
TODO 没看懂 [文档](https://webpack.js.org/concepts/module-resolution/#module-paths)


## Resolving Loaders
This follows the same rules as those specified for file resolution. But the
[`resolveLoader`](https://webpack.js.org/configuration/resolve/#resolveloader) configuration option can be used to have separate resolution
rules for loaders.


## Caching
Every filesystem access is cached, so that multiple parallel or serial requests
to the same file occur faster. In [watch mode](https://webpack.js.org/configuration/watch/)
, only modified files are evicted from the cache. If watch mode is off, then the
cache gets purged before every compilation. In `webpack-dev-server` and
`webpack-dev-middleware` watch mode is enabled by default.


## References
* [Modules](https://webpack.js.org/concepts/modules/)
