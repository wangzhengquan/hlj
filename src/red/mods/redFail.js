KISSY.add(function(S, Node, Xtemplate, Action, app) {
	return {
		hljShare: function() {
			if (!window.wx) {
				return;
			}
			var self = this;
			Action.query('/v2/wx/config', {
				'url': window.location.href
			}, function(json) {
				self.doShare(json);
			}, function(data) {
				console.log(data)
			})
		},
		doShare: function(obj) {
			var self = this;
			wx.config({
				debug: false,
				appId: obj.appid,
				timestamp: obj.timestamp,
				nonceStr: obj.nonceStr,
				signature: obj.signature,
				jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"]
			});
			wx.ready(function() {
				wx.onMenuShareTimeline({
					title: '你的好友送来河狸家300元优惠券，快打开链接领取吧。', // 分享标题
					link: 'http://www.helijia.com/mobile/build/APP/red/redShare.html?sui='+self._result['rui'], // 分享链接
					imgUrl: 'http://www.helijia.com/mobile/build/resources/images/Red/bg2.jpg', // 分享图标
					success: function() {
						//self.callback && self.callback();
					},
					cancel: function() {}
				});
				wx.onMenuShareAppMessage({
					title: '你的好友送来河狸家300元优惠券，快打开链接领取吧。', // 分享标题
					desc: '下载河狸家遇见美丽，一键预约上门美容美甲服务，还有美发美妆健身高颜值丰富体验。', // 分享描述
					link: 'http://www.helijia.com/mobile/build/APP/red/redShare.html?sui='+self._result['rui'], // 分享链接
					imgUrl: 'http://www.helijia.com/mobile/build/resources/images/Red/bg2.jpg', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function() {},
					cancel: function() {}
				});
			});
		},
		userArgent: function() {
			var self = this;		
			if (app.isMicroMessenger()) {
				/*Action.query('/v2/wx/authorize', {
					'url': encodeURI(window.location.href)
				}, function(json) {
					alert(json);
				}, function(data) {
					console.log(data)
				})*/
				self.attachEvent();
				self.hljShare();
				self._result=app.getParam();
				if(self._result['msg'].length != 0){
					S.one('#failMsg').html(decodeURI(self._result['msg'])+'，<br />分享优惠给好友，<br />你就有机会获得300元大礼包。');
					//self.setMag(decodeURI(self._result['msg']));	
				};					
			} else {
				S.one('#s-button').attr("disabled", true);
				S.one('#gotoOrder').attr("disabled", true);
				self.setMag('该活动只支持在微信浏览器中打开');
				return;
			}
		},
		setMag: function(msg) {
			if (!S.one('#s-alert')) {
				var str = '<div class="str" id="s-alert"></div>';
				S.one('body').append(str);
			};
			var salert = S.one('#s-alert');
			salert.html(msg);
			var popHeight = salert.innerHeight(),
				popWidth = salert.innerWidth();
			salert.css({
				"opacity": 1,
				"left": "50%",
				"top": "50%",
				"margin-top": -popHeight / 2 + 'px',
				"margin-left": -popWidth / 2 + 'px',
				"display": "block"
			});
			setTimeout(function() {
				salert.css('display', 'none');
			}, 2000)
		},
		attachEvent: function() {
			var self=this;
			S.one("#s-button").on("click", function(event) {
				self.setMag('亲，右上角可以分享哦');
			});
			S.one("#gotoOrder").on("click", function(event) {
				window.location.href = 'http://www.helijia.com/mobile/build/APP/home/index.html?channel=new_weixin';
			});
		},
		init: function() {
			this.userArgent();
		}
	}

}, {
	requires: [
		'node',
		"xtemplate",
		"../../action/Action",
		"../../app"
	]
});
