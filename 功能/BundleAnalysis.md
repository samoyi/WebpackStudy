# Bundle Analysis

1. 应当通过 webpack 项目模块分析工具来分析项目，可能还会获得一些建议和警告。
2. 可以使用[官方分析工具](https://github.com/webpack/analyse)或社区的其他
[可视化分析工具](https://webpack.js.org/guides/code-splitting/#bundle-analysis)。
3. 使用下面的命令生成一个供分析工具使用的 JSON 文件到项目根目录
    ```shell
    webpack --profile --json > stats.json
    ```
4. 然后上传到[官方分析工具](https://webpack.github.io/analyse/)或其他工具进行分析。
