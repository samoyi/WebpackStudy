# devServer



## `devServer.contentBase`
1. 告诉服务器从哪个目录中提供内容。
2. 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录。推荐使用
绝对路径。
    ```js
    module.exports = {
        //...
        devServer: {
            contentBase: path.join(__dirname, 'public')
        }
    };
    ```
3. 也可以从多个目录提供内容
    ```js
    module.exports = {
        //...
        devServer: {
            contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
        }
    };
    ```
