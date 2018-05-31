# Manifest
In a typical application or site built with webpack, there are three main types
of code:
* The source code you, and maybe your team, have written.
* Any third-party library or "vendor" code your source is dependent on.
* A webpack runtime and manifest that conducts the interaction of all modules.

## Runtime
1. The runtime, along with the manifest data, is basically all the code webpack
needs to connect your modularized application while it's running in the browser.
2. It contains the loading and resolving logic needed to connect your modules as
 they interact. This includes connecting modules that have already been loaded
into the browser as well as logic to lazy-load the ones that haven't.


## Manifest
1. As the compiler enters, resolves, and maps out your application, it keeps
detailed notes on all your modules. This collection of data is called the
"Manifest" and it's what the runtime will use to resolve and load modules once
they've been bundled and shipped to the browser.
2. No matter which module syntax you have chosen, those `import` or `require`
statements have now become `__webpack_require__` methods that point to module
identifiers. Using the data in the manifest, the runtime will be able to find
out where to retrieve the modules behind the identifiers.
3. The manifest data can be extracted into a json file for easy consumption
using the [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin).

缓存相关的部分，见该目录下的 `Caching.md`

## References
[Manifest](https://webpack.js.org/concepts/manifest/)
