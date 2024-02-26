KISSY.add(function (S, Storage, ParamUtil) {
	var version = '2.9.5'
	var _PARAM = ParamUtil.processParam(S.unparam(decodeURIComponent(location.search.slice(1)))),
		ua = navigator.userAgent.toLowerCase(),
		app_ua_arr = ua.match(/(hlj-\w+)\/(\d\.\d\.\d)/i);

	var position_key = "hlj_customer_position",
		session_user_key = 'hlj_user';


	var CITY_MAP = undefined,
		NAME_KEY_CITY_MAP = undefined,
		CITY_LIST = [
			{
				name: '北京市',
				code: '110100'
			},
			{
				name: '上海市',
				code: '310100'
			},
			{
				name: '杭州市',
				code: '330100'
			},
			{
				name: '成都市',
				code: '510100'
			},
			{
				name: '深圳市',
				code: '440300'
			},
			{
				name: '广州市',
				code: '440100'
			},
			{
				name: '武汉市',
				code: '420100'
			},
			{
				name: '南京市',
				code: '320100'
			},
			{
				name: '天津市',
				code: '120100'
			},
			{
				name: '重庆市',
				code: '500100'
			}];

	// app.config.
	//正式环境
	var REAL_CONFIG = {
		apiHost: '//app.helijia.com',
		baseUrl: '//app.helijia.com/zmw',

	};

	var TEST_CONFIG = {
		apiHost: '//test.stg.helijia.com',
		baseUrl: '//test.stg.helijia.com/zmw',
	}


	var PUB_CONFIG = {
		apiHost: '//apppub.helijia.com',
		baseUrl: '//apppub.helijia.com/zmw',
	}

	var config = {
		// imgBaseUrl: 'http://p0.static.helijia.cn/zmw/',
		imgBaseUrl:'../',
		version: version,
	};

	S.mix(config, REAL_CONFIG)
	// console.log("merge ====", config)

	var app = {
		config: config,
		// 获得cookie
		getCookie: function (c_name) {
			var c_start;
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return "";
		},

		getCity: function (code) {
			return this.getCityMap()[code] || this.getCityMap()['110100'];
		},
		getCityByName: function (name) {
			if (!(/市$/.test(name))) {
				name = name + "市";
			}
			return this.getNameKeyCityMap()[name] || this.getNameKeyCityMap()['北京市'];
		},
		getCityMap: function () {
			if (!CITY_MAP) {
				CITY_MAP = {};
				var city;
				for (var i = 0, len = CITY_LIST.length; i < len; i++) {
					city = CITY_LIST[i];
					CITY_MAP[city.code] = city;
				}
			}
			return CITY_MAP;
		},
		getNameKeyCityMap: function () {
			if (!NAME_KEY_CITY_MAP) {
				NAME_KEY_CITY_MAP = {};
				var city;
				for (var i = 0, len = CITY_LIST.length; i < len; i++) {
					city = CITY_LIST[i];
					NAME_KEY_CITY_MAP[city.name] = city;
				}
			}
			return NAME_KEY_CITY_MAP;
		},
		getCityList: function (cb) {
			cb && cb(result);
			return CITY_LIST;
		},

		/**
		 * addrDetail: ""
		 address: "地铁10号线; 机场线"
		 city: "北京市"
		 city_code: '110100',
		 phoneNumber: undefined
		 point: {
			 lat: 39.96688,
			 lng: 116.463573
		 }
		 lat: 39.96688
		 lng: 116.463573
		 postcode: undefined
		 province: "北京市"
		 title: "三元桥"
		 */
		setPosition: function (position) {
			console.log('setPosition', position);
			if (!position.city_code) {
				position.city_code = this.getCityByName(position.city).code;
			}
			Storage.setSessionItem(position_key, position);
		},
		getPosition: function () {
			Storage.getSessionItem(position_key);
		},
		setSessionUser: function (user) {
			Storage.setSessionItem(session_user_key, user);
		},
		getSessionUser: function () {
			return Storage.getSessionItem(session_user_key);
		},
		isLogined: function () {
			return !!this.getSessionUser();
		},
		/**
		 * 获取url参数
		 * @returns
		 */
		getParam: function () {
			return _PARAM;
		},

		/**
		 * 是否是在里面app
		 * hlj-ios/2.8.8
		 *	hlj-android/2.8.8
		 * @returns
		 */
		isApp: function () {
			return app_ua_arr && (app_ua_arr[1] == "hlj-ios" || app_ua_arr[1] == "hlj-android");
			//return _PARAM.from_type=='app';
		},
		isAdroidApp: function () {
			return app_ua_arr && app_ua_arr[1] == "hlj-android";
		},
		isIosApp: function () {
			return app_ua_arr && app_ua_arr[1] == "hlj-ios";
		},
		/*APP版本号*/
		getAppVersion: function () {
			return app_ua_arr && app_ua_arr[2];
		},
		/**
		 * 获取运行容器
		 * @returns
		 */
		getRunEnv: function () {
			return app_ua_arr && app_ua_arr[1];
		},

		/**
		 * 是否是微信
		 */
		isMicroMessenger: function () {
			return (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger");
		},

		/*
			 * 没有安装app跳转到下载页面
			 * 从h5唤起app
			 */
		notifyApp: function (ios_url, android_url) {
			var u = navigator.userAgent;
			if (u.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
				window.location = "http://www.helijia.com/APP/down.html";
				return;
			} else if (u.match(/(iPhone|iPod|iPad);?/i)) {
				window.location = ios_url;

			} else if (u.match(/android/i)) {
				window.location = android_url;
			}

			var clickedAt = +new Date;
			setTimeout(function () {
				!window.document.webkitHidden && setTimeout(function () {
					if (+new Date - clickedAt < 2000) {
						window.location = "http://www.helijia.com/APP/down.html";
					}
				}, 500);
			}, 500);
		},
	};
	return app
}, {
	requires: ["UFO/util/Storage", "./util/ParamUtil"]
});
