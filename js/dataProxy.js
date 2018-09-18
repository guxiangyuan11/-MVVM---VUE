function MvvmVue(options) {
    this._options = options // 得到传过来的配置
    var data = this._data = this._options.data // 得到配置里面的data对象
    var _self = this // 保存this对象
    // 遍历属性对象JSON
    Object.keys(data).forEach(function (key) {
        // 实现属性代理
        _self._proxy(key)
    })
    // 编译HTML模板
    new Compile(_self._options.el || document.body, _self)
}
MvvmVue.prototype._proxy = function (key) {
    var _self = this // 保存this对象
    // 将需要代理的对象名添加到对象实例上，并定义得到方式
    Object.defineProperty(_self, key, {
        configurable: false, // 不能再重新定义
        enumerable: true, // 可以枚举
        // 当读取对象此属性值时自动调用, 将函数返回的值作为属性值, this为实例对象
        // 如实例去获取data中的某属性时
        get() {
            // 返回的是实例内部_data中的对象值
            return _self._data[key]
        },
        // 当修改了对象的当前属性值时自动调用, 监视当前属性值的变化, 修改相关的属性, this为实例对象
        // 如实例去设置data中的某属性值时
        set(newValue) {
            // 设置的是实例内部_data中的对象值
            _self._data[key] = newValue
        }
    })
}