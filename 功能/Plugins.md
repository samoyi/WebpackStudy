# Plugins

## `clean-webpack-plugin`
### 使用Atom编辑器时遇到的问题
1. 只要操作了`dist`目录下的文件，即使是打开再关上，之后再build的时候会报错：
```shell
Error: EPERM: operation not permitted, mkdir 'D:\WebpackStudy\dist'
```
2. Atom项目结构里，`dist`还存在，但已经是空的了。
3. 本地磁盘里双击`dist`文件夹，会提示位置不可用，拒绝访问。
4. 在Atom项目结构里点击一下`dist`它就会消失。
5. 而即使我用Notepad++打开着其中的文件，也可以成功build
6. 看起来是Atom进行了某种锁定
