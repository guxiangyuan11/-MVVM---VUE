
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


// 判断传过来的是否是node节点
Compile.prototype.getFragment=function (el){
    var fragment = document.createDocumentFragment()
    var child
    // 拷贝节点到fragment
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

        } else if(_self.isText(node) && reg.test(node.textContent)){ // 判断是否是文本且节点的内容能否匹配上正则
            node.textContent = _self.getDataValue(_self._vm, RegExp.$1) // 得到相对应的数据
        }
        // 如果子节点还有子节点
        if (node.childNodes && node.childNodes.length) {
            // 调用实现所有层次节点的编译
            _self.compileFrag(node);
        }
    })
}

// 判断传过来的是否是node节点
Compile.prototype.isElement=function (node){
    return node.nodeType == 1 // 如果是1的话就是标签
}
// 判断传过来的是否是文本
Compile.prototype.isText=function (node){
    return node.nodeType == 3; // 如果是3的话就是文本
}

// 判断传过来的是否是文本
Compile.prototype.isText=function (node){
    return node.nodeType == 3; // 如果是3的话就是文本
}

// 得到{{}}中指定的数据，从实例中得到
Compile.prototype.getDataValue=function (vm, exp){
    var val = vm._data;
    exp = exp.split('.');
    exp.forEach(function (k) {
        val = val[k];
    });
    return val;
}