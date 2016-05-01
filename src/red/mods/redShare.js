KISSY.add(function(S, Node, Xtemplate, Action, app, redShare_tpl) {
	var doc = document;
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
				jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
			});
			wx.ready(function() {
				wx.onMenuShareTimeline({
					title: '你的好友送来河狸家300元优惠券，快打开链接领取吧。', // 分享标题
					link: encodeURI(window.location.href), // 分享链接
					imgUrl: 'http://www.helijia.com/mobile/build/resources/images/Red/bg2.jpg', // 分享图标
					success: function() {
						//self.callback && self.callback();
					},
					cancel: function() {}
				});
				wx.onMenuShareAppMessage({
					title: '你的好友送来河狸家300元优惠券，快打开链接领取吧。', // 分享标题
					desc: '下载河狸家遇见美丽，一键预约上门美容美甲服务，还有美发美妆健身高颜值丰富体验。', // 分享描述
					link: encodeURI(window.location.href), // 分享链接
					imgUrl: 'http://www.helijia.com/mobile/build/resources/images/Red/bg2.jpg', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function() {},
					cancel: function() {}
				});
			});
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
		render: function() {
			var self = this;
			if (app.isMicroMessenger()) {
				var _reslut=app.getParam();
				var _reslutOne =  _reslut.user_id || _reslut.sui;
				console.log(_reslutOne)
				Action.query('/v2/userInfo/getUserinfo', {
					'userid': _reslutOne
				}, function(json) {
					//console.log(json)
					if (json.ret) {
						S.one('#sh-cum').html(new Xtemplate(redShare_tpl, {
							commands: {
								'getActionUrl': function(scopes, option) {
									return app.config.baseUrl + '/v2/receive/coupon_group';
								},
								'getSui': function(scopes, option) {
									return _reslutOne;
								}
							}
						}).render(json));
					} else {
						self.setMag(json.msg)
					}
				}, function(data) {
					console.log(data)
				});
				self.attachEvent();
				self.hljShare();
			} else {
				//S.one('#s-button').attr("disabled", true);
				//S.one('#sh-tel').attr("disabled", true);
				self.setMag('该活动只支持在微信浏览器中打开');
				return;
			}
		},
		attachEvent: function() {
			var self = this;
			S.one("#sh-cum").delegate('click', '#s-button', function() {
				if (!(/^1[35678][0-9]{9}$/.test(S.one('#sh-tel').val()))) {
					self.setMag('请输入正确的电话号码');
					return false;
				} else {
					document.getElementById('myForm').submit();
				}
			});
		},

		init: function() {
			this.render();
		}
	}
}, {
	requires: [
		'node',
		"xtemplate",
		"../../action/Action",
		"../../app",
		"../tpl/redShare-tpl"
	]
});
