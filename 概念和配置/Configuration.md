# Configuration

## 原理
1. Webpack's configuration file is a JavaScript file that exports an object.
2. This object is then processed by webpack based upon its defined properties.

## 使用方法
1. It's a standard Node.js CommonJS module, you can do the following:
    * import other files via `require(...)`
    * use utilities on npm via `require(...)`
    * use JavaScript control flow expressions i. e. the `?:` operator
    * use constants or variables for often used values
    * write and execute functions to generate a part of the configuration
2. The following practices should be avoided:
    * Access CLI arguments, when using the webpack CLI (instead write your own
        CLI, or use `--env`)
    * Export non-deterministic values (calling webpack twice should result in
        the same output files)
    * Write long configurations (instead split the configuration into multiple
        files)
3. There are many different ways to format and style your webpack configuration.
The key is to stick with something consistent that you and your team can
understand and maintain.

### Exporting multiple configurations
Instead of exporting a single configuration object/function, you may export
multiple configurations (multiple functions are supported since webpack 3.1.0).
When running webpack, all configurations are built. For instance, this is useful
 for [bundling a library](https://webpack.js.org/guides/author-libraries/) for
multiple [targets](https://webpack.js.org/configuration/output/#output-librarytarget)
such as AMD and CommonJS:
```js
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  entry: './app.js',
  mode: 'production',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  entry: './app.js',
  mode: 'production',
}]
```

## References
* [Configuration](https://webpack.js.org/concepts/configuration/)
* [Exporting multiple configurations](https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations)
