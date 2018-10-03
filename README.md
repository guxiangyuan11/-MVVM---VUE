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

[前端MVVM模式从理论到实战 （一）](https://www.jianshu.com/p/e2ac3260c767)

[前端MVVM模式从理论到实战 （二）](https://www.jianshu.com/p/e2ac3260c767)

