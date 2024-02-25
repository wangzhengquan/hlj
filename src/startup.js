(function (global, doc) {
	var debug = false;

	var version = '2.9.5',
		tag = version + '_20160118';

	var APP = global.APP = global.APP || {};

	/**
	 * 获得cookie
	 */
	var getCookie = APP.getCookie = function (c_name) {
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
	};

	var docHead = function () {
		return doc.getElementsByTagName('head')[0] || doc.documentElement;
	};
	var headNode = docHead();

	/**
	 * 引入脚本
	 */
	var createScript = APP.createScript = function (url, config) {
		var success,
			error,
			charset,
			attrs;

		config = config || {};
		success = config.success;
		error = config.error;
		charset = config.charset;
		attrs = config.attrs;

		var node = doc.createElement('script');

		if (attrs) {
			for (var n in attrs) {
				node.setAttribute(n, attrs[n]);
			}
		}

		if (charset) {
			node.charset = charset;
		}

		node.src = url;
		node.async = true;

		var useNative = 'onload' in node;

		var onload = function () {
			var readyState = node.readyState;
			if (!readyState ||
				readyState === 'loaded' ||
				readyState === 'complete') {
				node.onreadystatechange = node.onload = null;
				success && success();
			}
		};

		//标准浏览器 css and all script
		if (useNative) {
			node.onload = onload;
			node.onerror = error;
		}
		// old chrome/firefox for css
		else {
			node.onreadystatechange = onload;
		}


		if (!headNode) {
			headNode = Utils.docHead();
		}
		headNode.insertBefore(node, headNode.firstChild);
		return node;
		/* var firstScript = document.getElementsByTagName('script')[0];  
		 if(firstScript){  
				 firstScript.parentNode.insertBefore(_script, firstScript);  
		 }else{  
					head.appendChild(_script);  
		 }  */
	};

	//页面渲染完成后执行的脚步
	var onafterrender = global.APP.onafterrender;
	APP.onafterrender = function () {
		//alert("onafterrender2");

		//同盾
		var token = getCookie('beancon_id');
		//alert('beancon_id='+token );
		if (token) {
			(function () {
				_fmOpt = {
					partner: 'helijia',
					appName: 'helijia_web',
					token: token
				};
				var cimg = new Image(1, 1);
				cimg.onload = function () {
					_fmOpt.imgLoaded = true;
				};
				cimg.src = "https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=helijia&appName=helijia_web&tokenId=" + _fmOpt.token;
				var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;
				fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.fraudmetrix.cn/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
			})();
		}
		onafterrender && onafterrender.apply(APP);
	};

	if (location.search.indexOf('debug') !== -1) {
		debug = true;
	}

	//正式环境
	global.GLOBAL_CONFIG = {
		apiHost: '//app.helijia.com',
		baseUrl: '//app.helijia.com/zmw',
		imgBaseUrl: 'http://p0.static.helijia.cn/zmw/',

		zmwHost: 'http://meijia.365pp.com',

		version: version,
		/**
		 * 统计接口
		 */
		collectUrl: '//collect.int.helijia.com/empty.gif'

	};

	if (location.host == 'www.stg.helijia.com' || location.search.indexOf('env=test') !== -1) {
		//测试环境
		global.GLOBAL_CONFIG.apiHost = '//test.stg.helijia.com';
		global.GLOBAL_CONFIG.baseUrl = '//test.stg.helijia.com/zmw';
		global.GLOBAL_CONFIG.collectUrl = '//collect.stg.helijia.com/empty.gif';
		global.GLOBAL_CONFIG.zmwHost = 'http://test.weixin.365pp.com';
	} else if (location.host == 'webpub.helijia.com' || location.search.indexOf('env=pre') !== -1) {
		//预发环境
		global.GLOBAL_CONFIG.apiHost = '//apppub.helijia.com';
		global.GLOBAL_CONFIG.baseUrl = '//apppub.helijia.com/zmw';
		global.GLOBAL_CONFIG.collectUrl = '//collect.stg.helijia.com/empty.gif';
		global.GLOBAL_CONFIG.zmwHost = 'http://test.weixin.365pp.com';
	}

	/*global.GLOBAL_CONFIG.apiHost = '//app.helijia.com';
	global.GLOBAL_CONFIG.baseUrl = '//app.helijia.com/zmw';*/


	var configKissy = function () {
		// 该配置中的path是浏览器的访问路径，网站host对应根目录
		KISSY.config({
			packages: {
				UFO: {
					path: "../lib/ufo",
					charset: "utf-8",
					combine: false,
					//tag:KISSY.now(),
					tag: tag,
					ignorePackageNameInUri: true,
					debug: true

				},
				mui: {
					path: "../lib/kissy/mui",
					charset: "utf-8",
					combine: false,
					//tag:KISSY.now(),
					tag: tag,
					ignorePackageNameInUri: true,
					debug: true
				},
				app: {
					path: "../",
					charset: "utf-8",
					combine: false,
					//tag:KISSY.now(),
					tag: tag,
					ignorePackageNameInUri: true,
					debug: true
				},
				css: {
					path: "../resources/style",
					charset: "utf-8",
					combine: false,
					//tag:KISSY.now(),
					tag: tag,
					ignorePackageNameInUri: true,
					debug: true
				}

			}
		});
	};


	var seedUrl = '//g.alicdn.com/??kissy/k/1.4.14/seed-min.js?t=' + tag,
		data_config = "{combine:true}";

	if (debug) {
		seedUrl = '//g.alicdn.com/??kissy/k/1.4.14/seed.js?t=' + tag;
		data_config = "{combine:false}";
	}

	var count = 3,
		start = function () {
			console.log('--Program begin to start--');
			configKissy();
			APP.onstartup();
		},
		countToStart = function () {
			if (--count === 0) {
				start();
			}
		};

	
	createScript(seedUrl, {
		attrs: {
			'data-config': data_config,
		},
		success: function () {
			// console.log('--seed.js loaded--');
			countToStart();
		}
	});

	var pre_load_js = ['../lib/mock.min.js', '../lib/ufo/UFO.js?t=' + tag]

	for (var i =0, len = pre_load_js.length; i< len; i++) {
		createScript(pre_load_js[i], {
			success: function () {
				// console.log('mock.min.js loaded--');
				countToStart();
			}
		});
	}
	
 


})(window, document);

