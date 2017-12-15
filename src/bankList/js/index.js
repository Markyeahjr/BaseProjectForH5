/**
 * Created by Administrator on 2017/9/23.
 */

(function ($) {
    var bankList = {
        init: function () {
            bankList.shouBankList();
        },
        shouBankList: function () {
            var data = [
                {
                    'bankName': '工商银行',
                    'depositCard': true,
                    'creditCard': false
                },
                {
                    'bankName': '农业银行',
                    'depositCard': true,
                    'creditCard': false
                },
                {
                    'bankName': '建设银行',
                    'depositCard': true,
                    'creditCard': false
                },
                {
                    'bankName': '招行银行',
                    'depositCard': true,
                    'creditCard': false
                },
                {
                    'bankName': '浦发银行',
                    'depositCard': true,
                    'creditCard': false
                }
            ]

            var str = '';

            for (var i = 0; i < data.length; i++) {
                var depositCardImg = data[i].depositCard ? 'Support-icon.png' : 'noSupport-icon.png';
                var creditCard = data[i].creditCard ? 'Support-icon.png' : 'noSupport-icon.png';

                str +=
                    '<tr>' +
                    '<td class="bankname">' + data[i].bankName + '</td>' +
                    '<td class="deposit-card"><img src="images/' + depositCardImg + '"></td>' +
                    '<td class="credit-card"><img src="images/' + creditCard + '"></td>' +
                    '</tr>'
            }

            // 添加
            $("#bankInfoList").append(str);

        }
    };
    bankList.init();
})(Zepto);