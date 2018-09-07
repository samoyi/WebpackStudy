# Charset


## Misc
### 测试 Vue 异步路由时遇到的中文乱码问题
1. `dist\index.html`
```html
<!doctype html>
<html>
<head>
    <title>起步</title>
    <!-- <meta charset="utf-8"> -->
</head>
<body>
    <h1>异步路由</h1>
    <div id="app">
        <router-link to="/login">login</router-link> <br />
        <router-link to="/profile">profile</router-link> <br /><br />

        <router-view></router-view>
    </div>
    <script src="bundle.js"></script>
    <!-- <script src="bundle.js" charset="utf-8"></script> -->
</body>
</html>
```
2. `webpack.config.js`
```js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin()
    ],
};
```
3. 使用同步路由时，所有中文都是乱码
`src\index.js`
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = {
    template: `<div>
                    Login 组件
                </div>`,
};

const Profile = {
    template: `<div>
        Profile 组件
    </div>`,
};

const routes = [
    {
        path: '/login',
        component:  Login,
    },
    {
        path: '/profile',
        component:  Profile,
    },
];

const router = new VueRouter({
    routes,
});

new Vue({
    el: '#app',
    router,
});
```
4. 把 Profile 改成异步路由，Profile 组件正常显示中文，其他中文还是乱码
```js
const Profile = ()=>import('./Profile.vue');
// const Profile = {
//     template: `<div>
//         Profile 组件
//     </div>`,
// };
```
```html
<!-- src\Profile.vue -->
    <template>
        <div>
            Profile 组件
        </div>
    </template>
```
5. 有趣的是，首先生成的`bundle.js`，有如下一段代码
```js
// 动态创建一个 <script>
var a, s = document.getElementsByTagName("head")[0], c = document.createElement("script");
// 设定该 <script> 字符编码
c.charset = "utf-8",
c.timeout = 120,
i.nc && c.setAttribute("nonce", i.nc),
// 加载异步组件
c.src = function(t) {
    return i.p + "" + t + ".bundle.js"
}(t),
a = function(e) {
    c.onerror = c.onload = null,
    clearTimeout(u);
    var n = r[t];
    if (0 !== n) {
        if (n) {
            var i = e && ("load" === e.type ? "missing" : e.type)
            , o = e && e.target && e.target.src
            , a = new Error("Loading chunk " + t + " failed.\n(" + i + ": " + o + ")");
            a.type = i,
            a.request = o,
            n[1](a)
        }
        r[t] = void 0
    }
}
;
var u = setTimeout(function() {
    a({
        type: "timeout",
        target: c
    })
}, 12e4);
c.onerror = c.onload = a,
s.appendChild(c)
```
6. 也就是说，异步加载的会被自动添加编码，但最初生成的并没有。
7. 虽然不知道有没有更好的解决方法，但可以通过在`dist\index.html`中手动设置编码来解决。
参考文件中的两处注释：如果只给`<script src="bundle.js"></script>`设置`charset`，则
`<h1>`和`<title>`的中文仍是乱码，所以直接用`<meta>`设置就好了。
