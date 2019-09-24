import wx from 'weixin-js-sdk';

const shareMethod = (info, fn) => {
    wx.ready(function(){
        wx.checkJsApi({
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ],
            success: function(res) {
                wx.onMenuShareTimeline({
                    title: info.title, // 分享标题
                    link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: info.imgUrl || 'https://static1.aidingmao.com/lease/img/1c72cef0-9fa0-11e8-81e0-d74e73ff9d05.png', // 分享图标
                    success: function () {
                        fn();
                    }
                });
                wx.onMenuShareAppMessage({
                    title: info.title, // 分享标题
                    desc: info.desc, // 分享描述
                    link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: info.imgUrl || 'https://static1.aidingmao.com/lease/img/1c72cef0-9fa0-11e8-81e0-d74e73ff9d05.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        fn();
                    }
                });
                wx.onMenuShareQQ({
                    title: info.title, // 分享标题
                    desc: info.desc, // 分享描述
                    link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: info.imgUrl || 'https://static1.aidingmao.com/lease/img/1c72cef0-9fa0-11e8-81e0-d74e73ff9d05.png', // 分享图标
                    success: function () {
                        fn();
                    },
                    cancel: function () {}
                });
                wx.onMenuShareWeibo({
                    title: info.title, // 分享标题
                    desc: info.desc, // 分享描述
                    link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: info.imgUrl || 'https://static1.aidingmao.com/lease/img/1c72cef0-9fa0-11e8-81e0-d74e73ff9d05.png', // 分享图标
                    success: function () {
                        fn();
                    },
                    cancel: function () {

                    }
                });
                wx.onMenuShareQZone({
                    title: info.title, // 分享标题
                    desc: info.desc, // 分享描述
                    link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: info.imgUrl || 'https://static1.aidingmao.com/lease/img/1c72cef0-9fa0-11e8-81e0-d74e73ff9d05.png', // 分享图标
                    success: function () {
                        fn();
                    },
                    cancel: function () {

                    }
                });
                if(!info.type) alert('已为你生成分享链接，请点击右上角 ··· 分享！');
            }
        });
    });
    wx.error(function(res){
        // alert(JSON.stringify(res));
    });
};

export default shareMethod
