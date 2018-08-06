# Dependency Graph

## 原理
1. Any time one file depends on another, webpack treats this as a dependency.
2. This allows webpack to take non-code assets, such as images or web fonts, and
also provide them as dependencies for your application.
3. When webpack processes your application, it starts from a list of modules
defined on the command line or in its config file. Starting from these entry
points, webpack recursively builds a dependency graph that includes every module
your application needs, then packages all of those modules into a small number
of bundles - often, just one - to be loaded by the browser.
3. For HTTP/2, you can also use Code Splitting and bundling through webpack for
the [best optimization](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6).
