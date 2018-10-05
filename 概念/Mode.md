# Mode

1. 在 webpack4, 设置`mode`选项可以让 webpack 使用相应的内置的优化。
2. 默认值是`production`。
3. 可设定的值及作用

    <table>
        <thead>
            <tr>
                <td>值</td>
                <td>作用</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>`development`</td>
                <td>
                    会将`process.env.NODE_ENV`的值设为`development`。启用
                    `NamedChunksPlugin` 和 `NamedModulesPlugin`。
                </td>
            </tr>
            <tr>
                <td>`production`</td>
                <td>
                    会将`process.env.NODE_ENV`的值设为`production`。启用
                    `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`,
                    `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`,
                    `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin`和
                    `UglifyJsPlugin`.
                </td>
            </tr>
            <tr>
                <td>`none`</td>
                <td>不选用任何默认优化选项</td>
            </tr>
        </tbody>
    </table>
