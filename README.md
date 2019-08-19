## 模仿vue构建基本的mvvm模式实现双向绑定

### 目标：主要实现的功能
* 数据代理    ✔
* 模板解析 ✔
> * 解析双括号   ✔
> * v-on绑定事件   ✔
> * v-text绑定事件   ✔
> * v-class绑定事件   ✔
> * v-html绑定事件   ✔
> * v-model绑定事件   ✔
* 数据绑定 ✔
> * 数据拦截  ✔
> * 订阅发布  ✔

#### 至此实现了vue的基本的模板绑定和数据双向绑定
原理图
<img src='https://raw.githubusercontent.com/guxiangyuan11/IMAGE/master/images/%E5%8E%9F%E7%90%86%E5%9B%BE.png'>

将实现的一些思路编写成了文章：

> * [前端MVVM理论-MVC和MVP](https://www.jianshu.com/p/e2ac3260c767)
> * [前端MVVM理论-MVVM](https://www.jianshu.com/p/7088249276de)
> * [前端MVVM实战-常用的几个方法和属性](https://www.jianshu.com/p/ca9404cf2f9b)
> * [前端MVVM实战-数据代理](https://www.jianshu.com/p/56f859da7a7d)
> * [前端MVVM实战-模板解析之双括号解析](https://www.jianshu.com/p/160c989e73c1)
> * [前端MVVM实战-模板解析之事件指令和一般指令](https://www.jianshu.com/p/faff382af115)
> * [前端MVVM实战-数据绑定(一)](https://www.jianshu.com/p/3bf0b4d76611)
> * [前端MVVM实战-数据绑定(二)](https://www.jianshu.com/p/21592a132f67)

