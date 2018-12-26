# devServer

## `devServer.contentBase`
1. 当你想使用一些不参与打包的静态文件时，类似于`vue-cli2`中的`/static/`目录下的那种文件，就可以用到这个属性。
2. 当你把这个属性指定为一个目录时，在启用服务器时，该目录里面的文件就会拷贝到服务器的根目录。
3. 例如设定如下的`public`目录为静态文件目录
    ```js
    module.exports = {
        //...
        devServer: {
            contentBase: path.join(__dirname, 'public')
        }
    };
    ```
4. 比如该目录下有一个文件`foo.jpg`，当 devServer 运行时，`./public/foo.jpg`就会拷贝到服务器根目录。在 HTML 里可以通过绝对路径和 URL 来访问
    ```html
    <img src="/public.jpg" />
    或
    <img src="http://localhost:8080/foo.jpg" />
    ```
5. 这个属性可以设置为一个路径字符串，或者一个包含若干个路径字符串的数组用于指定多个目录。推荐使用绝对路径。    
6. 这个属性的默认值是 CWD。也就是说，如果是通过`package.json`的`scripts`来运行服务器，则整个项目目录里的资源都可以引用。感觉上，还有应该有专门的静态资源目录才好，就像`vue-cli`的`/static/`。
7. 不过这个属性，通常应该像`vue-cli`那样，被设置为`false`，也就是禁用该功能。因为这只是开发服务器的功能，生产构建时并不能用。所以最好也是像`vue-cli`那样使用`copy-webpack-plugin`，不管是开发构建还是生产构建，都统一把`/static/`中的资源拷贝到构建目录的`static`目录。


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
