(function (global, doc) {
	var debug = false;

	var	tag = '20160118';

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
				MUI: {
					path: "../lib/mui",
					charset: "utf-8",
					combine: false,
					//tag:KISSY.now(),
					tag: tag,
					ignorePackageNameInUri: true,
					debug: true
				},
				APP: {
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

	
	var docHead = function () {
		return doc.getElementsByTagName('head')[0] || doc.documentElement;
	};
	var headNode = docHead();

	/**
	 * 引入脚本
	 */
	var createScript = function (url, config) {
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
				success && success(url);
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


	if (location.search.indexOf('debug') !== -1) {
		debug = true;
	}

	var seedUrl = '//g.alicdn.com/??kissy/k/1.4.14/seed-min.js?t=' + tag,
		data_config = "{combine:true}";

	if (debug) {
		seedUrl = '//g.alicdn.com/??kissy/k/1.4.14/seed.js?t=' + tag;
		data_config = "{combine:false}";
	}

	var count = 2,
		start = function () {
			console.log('--Program begin to start--');
			configKissy();
			global.onAfterLoad();
		},
		countToStart = function () {
			if (--count === 0) {
				start();
			}
		};

	var pre_load_js = [
		// '../lib/mock.min.js', 
	  {url: seedUrl, config: {attrs: { 'data-config': data_config }}},
	  '../lib/ufo/UFO.js?t=' + tag,
	];

	// load js files
	for (var i =0, len = pre_load_js.length; i< len; i++) {
		var url, config;
		if (typeof pre_load_js[i] === 'object') {
			url = pre_load_js[i].url
			config = pre_load_js[i].config
		} else {
			url = pre_load_js[i]
			config = {}
		}
		config.success = function (url) {
			console.log('--loaded--', url);
			countToStart();
		}
		// console.log('creat', url);
		createScript(url, config);
	}

})(window, document);

