# webpack-dev-server

## `devServer.proxy`
1. Proxying some URLs can be useful when you have a separate API backend
development server and you want to send API requests on the same domain.
2. The dev-server makes use of the powerful [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
package. Check out its documentation for more advanced usages.
3. Note that some of `http-proxy-middleware`'s features do not require a
`target` key, e.g. its `router` feature, but you will still need to include a
`target` key in your config here, otherwise `webpack-dev-server` won't pass it
along to http-proxy-middleware).
4. 虽然看到网上有人说要实现跨域需要设置`changeOrigin`属性为`true`，但实测并不需要。
5. 在 Vue-cli2 中，这个选项是在`config/index.js`中的`proxyTable`中设置的。

### 基本代理
1. With a backend on `localhost:3000`, you can use this to enable proxying:
```js
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};
```
2. 这样，如果要请求`http://localhost:3000`，直接使用`/api`就行了。

### `pathRewrite`
1. If you don't want `/api` to be passed along, we need to rewrite the path. 不
懂，感觉和文档中说的正好相反。
2. 实际的例子就是，默认情况下，如果请求路径为`/api/list`，则实际的请求路径并不会是
`http://localhost:3000/list`，而是当前主机的`/api/list`。也就是说，默认情况下只有单
独的`/api`路径才会被代理，后面再加上其他的就不会走代理了。
3. 如果希望`/api/list`也被转换为`http://localhost:3000/list`，则需要如下加上
`pathRewrite`属性
    ```js
    module.exports = {
        //...
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    pathRewrite: {'^/api' : ''}
                }
            }
        }
    };
    ```

### `secure`
A backend server running on HTTPS with an invalid certificate will not be
accepted by default. If you want to, modify your config like this:
```js
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'https://other-server.example.com',
                secure: false
            }
        }
    }
};
```

### `bypass`
不懂，测试和预期不同
