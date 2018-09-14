# externals

## 功能
1. 对于某些不（能）打包的依赖，在运行时获取。  
2. 例如百度地图的 API 脚本只有 CDN 版本，不能通过 npm 安装。


## 用法
1. 在`index.html`中引入脚本
    ```html
    <div id="app"></div>
    <script type="text/javascript"
        src="http://api.map.baidu.com/api?v=2.0&ak=A4749739227af1618f7b0d1b588c0e85">
    </script>
    ```
2. 在`webpack.config.js`中配置`externals`
    ```js
    module.exports = {
        //...
        externals: {
            // 将脚本中的 BMap 定义为 BaiduMap
            BaiduMap: 'BMap',
        }
    };
    ```
3. 在组件里引用`BaiduMap`
    ```js
    import Map from 'BaiduMap'
    ```
