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


## `devServer.inline`
1. Toggle between the dev-server's two different modes.
2. By default the application will be served with inline mode enabled. This means that a script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.
3. It is also possible to use iframe mode, which uses an `<iframe>` under a notification bar with messages about the build.
4. 看起来，iframe 模式是永远可用的。而 inline 模式是默认模式，但可以禁用。
5. 使用 iframe 模式时，需要再实际的 URL 后面再加上`/webpack-dev-server/`。例如：`http://localhost:8080/webpack-dev-server/`。
6. 如果要禁用 inline 模式，可以修改配置文件：
    ```js
    module.exports = {
      //...
      devServer: {
        inline: false
      }
    };
    ```
    或者 CLI：
    ```sh
    webpack-dev-server --inline=false
    ```
    To switch to iframe mode
7. 不懂。实测中禁用了 inline 模式后 iframe 模式也不能 HMR。
