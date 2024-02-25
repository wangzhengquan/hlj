KISSY.add(function(S, Node, Xtemplate, app) {
	return {
		attachEvent: function() {
			var self = this;
			S.one("#hd-btn").on("click", function(event) {
				window.location.href = '../red/redDescription.html';
			});
			S.one("#s-button").on("click", function(event) {
				if (typeof(AppStatist) !== 'undefined') {
					AppStatist.logWithEventIDandParam(200128, "");
				}
				self.setMag('亲，右上角按钮可以分享哦')
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
		init: function() {
			if (!app.isApp()) {
				var str = window.location.href;
				var num = str.indexOf("?");
				str = str.substr(num + 1);
				console.log(str)
				window.location.replace('./redShare.html?' + str);
			} else {
				S.one('body').show();
				if (typeof(AppStatist) !== 'undefined') {
					AppStatist.logWithPageIDandParam(100060,"");
				}
			};
			this.attachEvent();
		}
	}

}, {
	requires: [
		'node',
		"xtemplate",
		"../../app"
	]
});