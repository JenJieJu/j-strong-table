Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}



export const createElement = (v) => document.createElement(v);

/**
 * 监听对象某个属性
 * @param  {obj}   obj 目标对象
 * @param  {string}   key 对象属性名
 * @param  {function} cb  变化出发的函数
 */
export const watch = (obj, key, cb) => {
    let value = undefined;
    Object.defineProperty(obj, key, {
        get: () => value,
        set: (v) => {
            value = v;
            cb(v);
        }
    })
}


/**
 * 获取元素
 * @param  {string} selector 元素id
 * @return {node}          元素对象
 */
export const selectorElement = selector => {
    return selector ? document.querySelectorAll(selector)[0] : undefined;
}


/**
 * 通过html创建元素
 * @param  {string} htmlString html
 * @return {dom}            元素
 */
export const createElementFromHTML = (htmlString) => {

    var parent = document.createElement('template');

    parent.innerHTML = htmlString.trim();

    let child = parent.content.firstElementChild;


    return child;
}