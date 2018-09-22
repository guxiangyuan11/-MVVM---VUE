function Watcher(value, vm, cb) {
    this.exp = value // 记录传过来的value对象
    this.vm = vm // mvvm实例对象
    this.cb = cb // 函数回调
    this.depIds = {}
    this.value = this.get()  // 得到当前渲染的数据值

}

Watcher.prototype = {
    // 添加dep，存储在Watcher对象里
    addDep(dep){

        // 判断是否存在
        if(!this.depIds.hasOwnProperty(dep.id)){
            dep.addWatchs(this)
            this.depIds[dep.id] = dep
        }
    },
    // 在这里进行视图的更新
    update(){
        var oldValue = this.value
        var newValue = this.get()
        if(newValue === oldValue){
            return
        }
        // 调用更新视图,这里需要把this指向改为mvvm对象实例
        this.cb.call(this.vm ,newValue, oldValue)
        this.value = newValue
    },
    get(){
        // 将target指向该Watcher对象
        Dep.target = this
        // 这里在拿value值的时候会去调用defineProperty的get函数
        var value = this.getDataValue()
        Dep.target = null
        return value
    },
    getDataValue(){
        var vals = this.exp.split(".")
        var val = this.vm._data
        vals.forEach(function (key) {
            val = val[key]
        })
        return val
    }
}