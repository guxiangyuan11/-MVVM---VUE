
function Compile(el, vm) {
    var _self = this
    _self._vm = vm // 保存MvvmVue实例对象
    // 得到element
    _self._el = _self.isElement(el) ? el:document.querySelector(el)

    if(_self._el){
        // 通过得到的element去遍历所有的子元素并添加到_fragment片段
        _self._fragment =  _self.getFragment(_self._el)
        // 进行_fragment里面的模板编译
        _self.compileFrag(_self._fragment)
        // 把编译好的fragment片段添加到对应的DOM节点中
        _self._el.appendChild(_self._fragment)
    }
}


// 创建fragment片段
Compile.prototype.getFragment=function (el){
    var fragment = document.createDocumentFragment()
    var child
    // 添加节点到fragment
    while (child=el.firstChild) {
        fragment.appendChild(child)
    }
    return fragment
}
// 进行模板编译
Compile.prototype.compileFrag=function (el){
    // 拿到节点中的第一层所有子节点
    var childNodes = el.childNodes
    var _self = this
    Array.prototype.slice.apply(childNodes).forEach(function (node) {
        // 正则找 {{}} 需要拿到里面的字符串
        var reg = /\{\{(.*)\}\}/
        // 判断是否是元素节点
        if(_self.isElement(node)){
            // 查看绑定的指令
            _self.compileV(node)
        } else if(_self.isText(node) && reg.test(node.textContent)){ // 判断是否是文本且节点的内容能否匹配上正则
            // 编译大括号模板
            _self.compileText(node, RegExp.$1)

        }
        // 如果子节点还有子节点
        if (node.childNodes && node.childNodes.length) {
            // 调用实现所有层次节点的编译
            _self.compileFrag(node);
        }
    })
}

// 对指令进行编译
Compile.prototype.compileV = function (node){
    var _self = this
    var vm = this._vm
    var attrs = node.attributes // 得到该node的所有的属性
    // 遍历该属性数组
    Array.prototype.slice.apply(attrs).forEach(function (attr) {
        // 得到指令名字符串 如:v-on:click
        var attrName = attr.name
        // 判断是否有指令属性
        if(attrName.indexOf('v-') === 0 || attrName.indexOf('@') === 0 ){
            var attrValue = attr.value.trim() // 得到属性的值
            // 由于事件绑定的处理和其他的指定绑定处理不一样所以分开处理
            if(attrName.substring(2).indexOf('on')===0 || attrName.indexOf('@') === 0){
                // 事件绑定
                // 在这里做安全判断
                if(attrValue && vm.$options.methods && vm.$options.methods[attrValue]){
                    // 进行函数绑定
                    _self.handelFn(node, attrName, vm.$options.methods[attrValue])
                }
            } else {
                // 处理其他指令
                // 得到对应的指令名 如： html,text
                var name = attrName.substring(2)
                _self.vUtil[name] && _self.vUtil[name](vm, node, attrValue)
            }

            // 最后移除该指令在node上
            node.removeAttribute(attrName)
        }
    })

}

// 判断传过来的是否是node节点
Compile.prototype.isElement = function (node){
    return node.nodeType == 1 // 如果是1的话就是标签
}

// 判断传过来的是否是文本
Compile.prototype.isText = function (node){
    return node.nodeType == 3 // 如果是3的话就是文本
}

// 对文本节点进行赋值
Compile.prototype.compileText = function (node, regStr){
    // 得到相对应的数据，然后进行内容填充
    this.vUtil.text(this._vm, node, regStr)
    // node.textContent = this.vUtil.getDataValue(this._vm, regStr)
}



// 进行回调绑定
Compile.prototype.handelFn = function (node, fnType, fn){
    if(fnType.indexOf('v-') === 0 ){
        var fnType = fnType.split(':')[1]
    } else if( fnType.indexOf('@') === 0 ){
        var fnType = fnType.split('@')[1]
    }
    // 这里进行函数绑定
    // 注意这里需要对fn进行bind修改this指向，并且把this指向MvvmVue实例对象，否则该fn的this指向的是事件绑定者
    node.addEventListener(fnType, fn.bind(this._vm) ,false)
}

Compile.prototype.vUtil = {
    // v-text/ {{}}
    text: function (vm, node, value) {
        this.deal(vm, node, value, 'text')
    },
    // v-html
    html:function (vm, node, value) {
        this.deal(vm, node, value, 'html')
    },
    // v-class
    class: function (vm, node, value) {
        this.deal(vm, node, value, 'class')
    },
    // v-class
    model: function (vm, node, value) {
        this.deal(vm, node, value, 'model');
        var _self = this,
            val = this.getDataValue(vm, value);
        if(value){
            node.value = val
        }
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            _self._setDataValue(vm, value, newValue);
            val = newValue;
        });
    },
    // 这个函数统一进行指令的处理
    deal: function (vm, node, value, type) {
        var _self = this;
        // 这里需要处理不同的指令
        this.dealTypeFn[type+'Updata'] && this.dealTypeFn[type+'Updata'](node, this.getDataValue(vm,value))

        // 进行数据监听，如果有改变就更新视图
        new Watcher(value, vm, function (val) {
            _self.dealTypeFn[type+'Updata'] && _self.dealTypeFn[type+'Updata'](node, val)
        })
    },
    dealTypeFn:{
        textUpdata: function (node,value) {
            node.textContent = value ? value  : ''
        },
        htmlUpdata: function (node, value) {
            node.innerHTML = value ? value : ''
        },
        classUpdata: function (node, value) {
            var nodeClass = node.className
            node.className = nodeClass? nodeClass+ ' ' + value:value;
        }
    },
    // 得到{{}}中指定的数据，从实例中得到
    getDataValue: function (vm, regStr){
        var val = vm._data
        regStr = regStr.split('.')
        regStr.forEach(function (k) {
            val = val[k]
        })
        return val
    },
    _setDataValue:function (vm, exp, value) {
        var val = vm._data
        exp = exp.split('.')
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k]
            } else {
                val[k] = value
            }
        });
    }
}

