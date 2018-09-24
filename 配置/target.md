# target

## 配置方法
`target`属性可以设置为字符串或函数

### 设置为字符串
<table>
    <thead>
        <tr>
            <td>选项</td>
            <td>描述</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                `async-node`
            </td>
            <td>    
                编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）
            </td>
        </tr>
        <tr>
            <td>
                `electron-main`
            </td>
            <td>
                编译为 Electron 主进程。
            </td>
        </tr>
        <tr>
            <td>
                `electron-renderer`
            </td>
            <td>
                编译为 Electron 渲染进程，使用`JsonpTemplatePlugin`,
                `FunctionModulePlugin`来为浏览器环境提供目标，使用`NodeTargetPlugin`
                和`ExternalsPlugin`为 CommonJS 和 Electron 内置模块提供目标。
            </td>
        </tr>
        <tr>
            <td>
                `node`
            </td>
            <td>
                编译为类 Node.js 环境可用（使用 Node.js `require`加载 chunk）
            </td>
        </tr>
        <tr>
            <td>
                `node-webkit`
            </td>
            <td>
                编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块
                和`nw.gui`导入（实验性质）
            </td>
        </tr>
        <tr>
            <td>
                `web`
            </td>
            <td>
                编译为类浏览器环境里可用（默认）
            </td>
        </tr>
        <tr>
            <td>
                `webworker`
            </td>
            <td>
                编译成一个 WebWorker
            </td>
        </tr>
    </tbody>
</table>

### 设置为函数
不懂实际的用法
