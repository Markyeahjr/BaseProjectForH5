/**
 * Created by Administrator on 2017/9/23.
 */

(function ($) {
    var payInfo = {
        whole: {
            'state': 0,
            'isBind': false,
            'title': '快钱支付',
            'payPattern': 'KuaiQianPay',
            'money': '￥10000.00',
            'pt': '预约私教：陈大月、陈大月、陈小希、陈华宇、陈大钊、陈华、陈辰、陈晓月、陈大月、陈小希、陈华宇、陈大钊',
            'userToken': '654321',
            'orderInfo': ''
        },
        api: {
            'test': 'http://10.0.20.50/',
            'beta': 'http://beta-pay.healthmall.cn/',
            'office': 'http://pay.healthmall.cn/'
        },
        depositCardForm: {
            isAllowPay: false,
            isSendVerify: false
        },
        creditCardForm: {
            isAllowPay: false,
            isSendVerify: false
        },
        bindCardForm: {
            isAllowPay: false,
            isSendVerify: true
        },
        init: function () {
            /************1.获取初始信息对页面进行初始化***************/
            payInfo.getInitInfo();


            /************事件start***************/
            //切换
            $('#container .tab-switch span').click(function () {
                console.log('切换');
                var index = $(this).index();
                payInfo.formValidation($('.tab-content').eq(index).find('form'));
                //tab切换
                $(this).addClass('cur').siblings().removeClass('cur').parent().parent().find('.tab-content').eq(index).show().siblings('.tab-content').hide();
                //记录是储蓄卡还是信用卡
                payInfo.whole.state = index;
                $('#pay').attr('data-pay', index);
            });

            //支付按钮
            $('#pay').click(function () {
                var form;
                var params = {};

                //绑卡否?>储蓄卡还是信用卡?是否连连?
                if (payInfo.whole.isBind) {//已绑卡
                    form = $('#bindCardForm');
                    var validCode = form.find('.verify input').val();
                    params = {
                        "payToken": payInfo.whole.payToken,
                        "orderInfo": payInfo.whole.orderInfo,
                        "validCode": validCode
                    };
                    console.log(params);

                } else {//未绑卡
                    if (payInfo.whole.state == 0) {//储蓄卡
                        form = $('#depositCardForm');
                    } else {
                        form = $('#creditCardForm');
                    }
                    form.find('input:required').removeAttr('disabled');
                    params = {
                        'orderInfo': payInfo.whole.orderInfo,
                        'bankType': payInfo.whole.state
                    };
                    $.extend(params, form.serializeJson());
                    console.log(params);
                    params = {
                        "cardName": "测试",
                        "cardId": "340827198512011810",
                        "bankNumber": "4380880000000007",
                        "phone": "13172549050",
                        "validCode":  form.find('.verify input').val(),
                        "bankType": payInfo.whole.state,
                        "orderInfo": payInfo.whole.orderInfo
                    };
                    console.log(params);
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json",
                        dataType: "json",
                        url: '/api/deal/firstPay/' + payInfo.whole.payPattern,
                        data: JSON.stringify(params),
                        success: function (data) {
                            if(data.responseCode == 10000){
                                console.log(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        }
                    });
                }
            });

            //input失焦时验证表单
            $('input').blur(function () {
                payInfo.formValidation($(this).closest("form"));
            });

            //获取验证码
            payInfo.getVerifyCode();

            //信用卡有效期过滤器
            $('.endtime input').keyup(function (event) {
                var num = $(this).val();
                var keyNum = event.which;//删除键
                num = num.replace(/[^0-9\/]/g, ''); //只允许数字和斜杠'/'
                $(this).val(num);
                if ($(this).val().length == 2 && keyNum != 8) {
                    $(this).val(num + '/')
                }
            });
            /************事件end***************/


        },

        /**获取验证码**/
        getVerifyCode: function () {
            $('.getverify').click(function () {
                console.log('提交表单', $(this).closest("form").attr("id"));
                var form = $(this).closest("form");
                var self = this;//备份指针
                var formid = form.attr('id');
                var params = '';//参数

                $(this).siblings('input').removeAttr('required', 'name');
                //已绑卡
                if (payInfo.whole.isBind) {
                    params = {
                        'orderInfo': payInfo.whole.orderInfo,
                        'payToken': payInfo.whole.payToken
                    };
                } else {//未绑卡
                    //去掉disabled,否则serialize()无法获取到值
                    form.find('input:required').removeAttr('disabled');
                    params = {
                        'orderInfo': payInfo.whole.orderInfo,
                        'bankType': payInfo.whole.state
                    };
                    $.extend(params, form.serializeJson());
                }
                console.log(params);
                params = {
                    "cardName": "测试",
                    "cardId": "340827198512011810",
                    "bankNumber": "4380880000000007",
                    "phone": "13172549050",
                    "bankType": 0,
                    "orderInfo": payInfo.whole.orderInfo
                };

                // $.ajax({
                //     type: 'POST',
                //     url: 'http://10.0.20.50/api/deal/firstReady/{0}',
                //     data: form.serialize(),
                //     success: function () {
                //
                //     }
                // });
                $.ajax({
                    type: 'POST',
                    contentType: "application/json",
                    dataType: "json",
                    url: '/api/deal/firstReady/' + payInfo.whole.payPattern,
                    data: JSON.stringify(params),
                    success: function (data) {
                        if(data.responseCode == 10000){
                            console.log(data.msg);
                        } else {
                            alert(data.msg);
                        }
                    }
                });
                $(this).attr('disabled', true).closest("form").find('input:required').each(function (index, item) {
                    $(item).attr('disabled', true);
                });
                $(this).siblings('input').attr({'required': 'required', 'name': 'verifyNumber'});
                payInfo[formid].isAllowPay = true; //允许支付
                var second = 10;
                var timer = setInterval(function () {
                    var text = '已发送(' + second + ')';
                    console.log(second);
                    $(self).text(text);
                    second--;
                    if (second < 0) {
                        $(self).text('获取验证码');
                        $(self).removeAttr('disabled');
                        clearInterval(timer);
                    }
                }, 1000);
                payInfo[formid].isSendVerify = true;//已发送验证码
            });

        },

        /**表单验证**/
        formValidation: function (form) {
            var inputArr = form.find('input:required');
            var formid = form.attr('id');
            var varifybtn = form.find('button');
            var valid = false;
            // inputArr.each(function (index, item) {
            //     if (!!$(item).val()) {
            //         console.log(index);
            //         valid = true;
            //     } else {
            //         valid = false;
            //         return;
            //     }
            // });
            var valid = inputArr.every(function (index,item) {
                return $(item).val() != ''
            });

            //发送验证码按钮是否可点击
            console.log('valid', valid);
            if (!payInfo[formid].isSendVerify) {//未发送验证码,需要验证 发送验证码按钮 是否可点击
                if (valid && inputArr.length != 5 && inputArr.length != 7) {
                    varifybtn.removeAttr('disabled');
                }
                if (!valid) {
                    varifybtn.attr('disabled', 'disabled');
                }
            }

            //支付按钮是否可点击
            if (valid && payInfo[formid].isAllowPay) {
                $('#pay').removeAttr('disabled');
            }
            if (!valid) {
                $('#pay').attr('disabled', 'disabled');
            }

        },

        /**获取页面信息**/
        getInitInfo: function () {
            $.ajax({
                type: 'get',
                url: '/test',
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    payInfo.whole.orderInfo = data.encryp;
                    console.log(payInfo.whole);
                    var orderInfo = $('#orderInfo');//订单详情
                    var isWarp = $('#isWarp');//显示全部私教按钮
                    var notBindCard = $('#notBindCard');//未绑卡界面
                    // var fs = parseInt(getComputedStyle(window.document.documentElement)['font-size']);//根字体


                    /**************拼接订单信息***************/
                    //拼接title
                    $('title').text(payInfo.whole.title);
                    //订单金额
                    orderInfo.find('h4').text(payInfo.whole.money);
                    //预约私教
                    isWarp.text(payInfo.whole.pt);
                    //预约私教显示交互
                    // isWarp.height()/fs>35/37.5
                    if (payInfo.whole.pt.length > 19) {
                        isWarp.addClass('nowarp').siblings('span').css('display', 'block');
                        isWarp.siblings('span').click(function () {
                            $(this).toggleClass('turnup').siblings('#isWarp').toggleClass('nowarp');
                        });
                    }

                    /**************根据支付类型判断支持的支付方式***************/
                    getSupportPayType(payInfo.whole.payPattern);

                    function getSupportPayType(title) {
                        if (title == 'BaoFuPay' || title == 'KuaiJiePay' || title == 'YiLianPay') {
                            //切换按钮
                            notBindCard.find('.tab-switch').show().siblings('.tab-alone').hide();
                        } else {
                            //单个按钮
                            var payType = payInfo.whole.state == 0 ? '仅支持储蓄卡' : '仅支持信用卡';
                            notBindCard.find('.tab-switch').hide().siblings('.tab-alone').text(payType).show().siblings('.tab-content').hide().eq(payInfo.whole.state).show();

                        }
                    }

                    if (payInfo.whole.isBind) {
                        $('#container .notbindcard').hide();
                        $('#container .bindcard').show();
                        payInfo.getDefoultCard();
                        var str =
                            '<div class="leftbox">' +
                            '<img src="' + payInfo.whole.logo + '">' +
                            '</div>' +
                            '<div class="rightbox">' +
                            '<div class="bankname">' + payInfo.whole.bankName + payInfo.whole.bankTyptName + '</div>' +
                            '<p class="peoplename">' + payInfo.whole.name + '</p>' +
                            '<div class="banknumber">' +
                            '<small>****</small>' +
                            '<small>****</small>' +
                            '<small>****</small>' +
                            '<span>' + payInfo.whole.shortBankNumber + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="pointer">更换<span></span></div>';
                        $('#card').append(str);
                        $('#phoneNum').text(payInfo.whole.phone);

                    } else {
                        $('#container .notbindcard').show();
                        $('#container .bindcard').hide();
                    }
                    $('#container').show();
                }
            });

        },

        /**获取默认银行卡信息**/
        getDefoultCard: function () {
            var params = {
                'payOrgan': payInfo.whole.title,
                'token': payInfo.whole.userToken
            };
            console.log(params);
            var defoultCardInfo = {
                "logo": "images/paycard_icon_ICBC.png",
                "bankColor": "A",
                "bankName": "中国工商银行",
                "bankTyptName": "储蓄卡",
                "shortBankNumber": "0000",
                "name": "***雨",
                "phone": "138****8000",
                "payToken": "ca34dfaf138f4570b2a442943d6667ca"
            };
            $.extend(payInfo.whole, defoultCardInfo);
            console.log('合并后', payInfo.whole);
        }
    };
    payInfo.init();

    //扩展serializeJson方法
    $.fn.serializeJson=function(){
        var serializeObj={};
        $(this.serializeArray()).each(function(){
            serializeObj[this.name]=this.value;
        });
        return serializeObj;
    };

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