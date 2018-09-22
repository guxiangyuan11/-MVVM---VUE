// 定义一个变量来存watche对象

function Observer(data) {
    this.data = data
    this.start(data)
}

Observer.prototype = {
    // 开始对数据进行监测
    start(data){
        var _self = this
        // 对该对象进行遍历
        Object.keys(data).forEach(function (key) {
            // 拿到key值和value值，进行监测
            _self.convert(key,data[key])
        })
    },
    convert(key, value){
        // 对指定属性实现响应式数据绑定
        this.defineReactive(this.data, key, value);
    },
    defineReactive(data, key,val){
        // 创建该对象的dep对象
        // dep对象主要是用来发布消息的，通知订阅者更新
        var dep = new Dep()
        // 间接性的递归，监测更深层次的数据
        var childObj = observe(val);
        // 给data重新定义属性(添加set/get)
        Object.defineProperty(data,key,{
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get(){
                // 在get方法中添加watche对象到该dep上
                // 如果是通过watch触发的get方法就进行watch存储到该dep上
                if(Dep.target){
                    // 在watcher那边添加dep对象
                    Dep.target.addDep(dep)
                }
                return val
            },
            set(newVal){
                if(newVal === val){
                    return
                }
                val = newVal
                // 如果新值是一个对象的话就再进行监测
                childObj = observe(newVal)
                dep.notify()
            }
        })
    }
}

var countId = 0
function Dep() {
    this.id = countId++
    this.watchs = []
}
Dep.prototype = {
    // 添加watcher存储到dep上
    addWatchs(watch) {
        this.watchs.push(watch)
    },
    // 发布消息，通知watch更新
    notify(){
        this.watchs.forEach(function (watch) {
            watch.update()
        })
    }
}
Dep.target = null
// 检查数据是否符合监测对象
function observe (data){
    // value必须是对象, 因为监视的是对象内部的属性
    if (!data || typeof data !== 'object') {
        return
    }
    new Observer(data)
}