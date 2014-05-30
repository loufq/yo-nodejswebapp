'use strict';

//数据库对象Clone-数据库对象有选择的暴露给外面

module.exports.clone = function clone(obj,selectFields) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = {};
    for (var attr in obj) {
        var hasOwnProperty = obj.hasOwnProperty(attr);
        var needOut = (selectFields.indexOf(attr) > -1);
        if (needOut) {
            copy[attr] = obj[attr]
        };
    }
    return copy;
}
