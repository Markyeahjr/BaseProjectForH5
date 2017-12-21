/**
 * Created by Administrator on 2017/9/23.
 */

(function ($) {
    var bankList = {
        init: function () {
            bankList.shouBankList();
            console.log($('#edit'));
            $('#edit').click(function () {
                $('#container').toggleClass('finish');
                $('#container').toggleClass('edit');
                console.log('进入'+$(this).text()+'状态');
                $(this).text()=='编辑'? $(this).text('完成'):$(this).text('编辑');
                console.log($('.edit'));
            });
            $('#addNewCard').click(function () {
                console.log('添加新卡');
            });
            // 编辑状态下 点击删除
            $('.container').on('touchstart', '.pointer', function () {
                $(this).addClass('cur');
                return false;
            });
            $('.container').on('touchend', '.pointer', function () {
                $(this).removeClass('cur');
                console.log($(this).parent().index(),'删除');
                return false;
            });
            // 完成状态下 点击卡片
            $('.finish').on('click', 'li', function () {
                console.log('选中'+ $(this).index(),'发送请求并跳转');
                $(this).addClass('cur').siblings().removeClass('cur');
            });
        },
        shouBankList: function () {
            var data = [
                {
                    'bankName': '工商银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_ICBC.png',
                    'type': 1

                },
                {
                    'bankName': '建设银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_CCB.png',
                    'type': 2

                },
                {
                    'bankName': '平安银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_CBHB.png',
                    'type': 3


                },
                {
                    'bankName': '农业银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_ABC.png',
                    'type': 4


                },
                {
                    'bankName': '中国银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_BOC.png',
                    'type': 5
                },
                {
                    'bankName': '敬荣银行储蓄卡',
                    'name': '**荣',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_CCB.png',
                    'type': 6
                },
                {
                    'bankName': '农业银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_ABC.png',
                    'type': 4


                },
                {
                    'bankName': '中国银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_BOC.png',
                    'type': 5
                },
                {
                    'bankName': '敬荣银行储蓄卡',
                    'name': '**荣',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_CCB.png',
                    'type': 6
                },
                {
                    'bankName': '农业银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_ABC.png',
                    'type': 4


                },
                {
                    'bankName': '中国银行储蓄卡',
                    'name': '**宇',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_BOC.png',
                    'type': 5
                },
                {
                    'bankName': '敬荣银行储蓄卡',
                    'name': '**荣',
                    'lastNumber': 3847,
                    'bankIcon': 'images/paycard_icon_CCB.png',
                    'type': 6
                }
            ]

            var str = '';
            var bgArr = ['red', 'blue', 'purple', 'green', 'yellow', 'other'];
            var loadImageNum = 0;

            for (var i = 0; i < data.length; i++) {
                str +=
                    '<li data-type="'+data[i].type+'">' +
                    '<div class="leftbox">' +
                    '<img src="'+ data[i].bankIcon+'">' +
                    '</div>' +
                    '<div class="rightbox">' +
                    '<div class="bankname">'+ data[i].bankName+'</div>' +
                    '<p class="peoplename">'+ data[i].name+'</p>' +
                    '<div class="banknumber">' +
                    '<small>****</small>' +
                    '<small>****</small>' +
                    '<small>****</small>' +
                    '<span>'+ data[i].lastNumber+'</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pointer">' +
                    '<span>删除</span>' +
                    '</div>' +
                    '<div class="ischoose">' +
                    '</div>' +
                    '</li>';
                var img=new Image();
                var src= 'images/card_'+bgArr[data[i].type-1]+'.png';
                img.src=src;
                img.onload=function(){
                    loadImageNum+=1;
                    if(loadImageNum == data.length){
                        console.log('所有背景图片加载完毕');
                        // 添加
                        $("#bankCardList").append(str);
                        var cardList = $('#bankCardList li');
                        for (var i = 0; i < cardList.length; i++) {

                            var card = $(cardList[i]);
                            var cardtype = card.attr('data-type');
                            var cardIndex = card.index();
                            var src= 'images/card_'+bgArr[cardtype-1]+'.png';

                            card.css({'backgroundImage': 'url('+src+')','top': (cardIndex*107/37.5) + 'rem'});

                        }
                        cardList.eq(-1).css({marginBottom: 64/37.5+'rem'})
                    }
                };
            }
        }
    };
    bankList.init();
})(Zepto);