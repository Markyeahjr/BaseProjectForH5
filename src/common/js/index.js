/**
 * Created by Administrator on 2017/9/23.
 */

(function ($) {
    //模拟 scrollTop 动画效果
    function scroll(scrollTo, time) {
        var scrollFrom = parseInt(document.body.scrollTop),
            i = 0,
            runEvery = 5;
        scrollTo = parseInt(scrollTo);
        time /= runEvery;
        var interval = setInterval(function () {
            i++;
            document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
            if (i >= time) {
                clearInterval(interval);
            }
        }, runEvery);
    }

    //扩展serializeJson方法
    $.fn.serializeJson=function(){
        var serializeObj={};
        $(this.serializeArray()).each(function(){
            serializeObj[this.name]=this.value;
        });
        return serializeObj;
    };
    //扩展every方法
    $.fn.every = function(callback) {
        var result = true;
        var self = this;
        this.each(function(index, element) {
            if(!callback(index, element, self)) {
                result = false;
                return false;
            }
        });
        return result;
    };
})(Zepto);