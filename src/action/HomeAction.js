KISSY.add(function (S, Action, Promise, Storage) {
	var HOME_CONFIG_KEY = "hlj_home_config";

	var HOME_CONFIG = undefined,
		BANNER_CONFIG = undefined,
		BANNER_CONFIG_OF_CITY = undefined;


	return {
		/*
		 * 获取home配置
		 */
		getHomeConfig: function (cb) {
			var defer = S.Defer();
			if (HOME_CONFIG) {
				cb(HOME_CONFIG);
				defer.resolve(HOME_CONFIG);

			} else {
				//HOME_CONFIG = Storage.getLocalItem(HOME_CONFIG_KEY);
				//LocalStorage 存储30天
				if (HOME_CONFIG && (new Date().getTime() - HOME_CONFIG.last_modify < 7 * 24 * 60 * 60 * 1000)) {

					cb(HOME_CONFIG);
					defer.resolve(HOME_CONFIG);
					console.log('Loade home_config from Storage');
				} else {
					Action.query('/v2/home_config.json', {
						//device_type:'h5',  
						device_type: 'iOS'
					}, function (json) {
						HOME_CONFIG = json;
						//console.log("HOME_CONFIG=", HOME_CONFIG);
						HOME_CONFIG.last_modify = new Date().getTime();
						Storage.setLocalItem(HOME_CONFIG_KEY, HOME_CONFIG);
						cb(HOME_CONFIG);
						defer.resolve(HOME_CONFIG);
						console.log("Loade home_config from server", HOME_CONFIG);
					});
				}
			}

			return defer.promise;
		},

		/*
		 * 获取指定城市的home配置
		 */
		getHomeConfigOfCity: function (city_code, cb) {
			var defer = S.Defer();
			this.getHomeConfig(function (json) {

				var data = json.data;
				defer.resolve(data[0]);
				cb && cb(data[0]);
				// var find = false;
				// for (var i = 0, len = data.length; i < len; i++) {
				// 	var item = data[i];
				// 	if (item.code == city_code) {
				// 		defer.resolve(item);
				// 		cb && cb(item);
				// 		find = true;
				// 		break;
				// 	}
				// }
				// if (!find) {
				// 	defer.reject("没有匹配的homeConfig, cityCode:" + city_code);
				// }

			});

			return defer.promise;
		},

		/*
		 * 获取指定城市的banner配置
		 */
		getBannerConfigOfCity: function (city_code, cb) {
			var defer = S.Defer();
			Action.query('/v2/banner_config.json', {
				city: city_code
			}, function (json) {
				//console.log("banner_config==", json);
				//localStorage && (localStorage.setItem('home_config', JSON.stringify(data)));
				BANNER_CONFIG_OF_CITY = json.data;
				cb && cb(json.data);
				defer.resolve(BANNER_CONFIG_OF_CITY);
			}, function (msg) {
				defer.reject(msg);
			});
			return defer.promise;
		},

		//get_product_tags?city=110100&category=tag_mei_jia
		//jump_type: "pros_arts"
		getConfigByCityAndName: function (from, city_code, name, cb) {
			var defer = S.Defer();
			if (from == 'banner') {
				this.getBannerConfigOfCity(city_code).then(function (blocks) {

					for (var i = 0, len = blocks.length; i < len; i++) {
						var block = blocks[i];
						if (block.name == name) {
							defer.resolve(block);
							cb && cb(block);
							break;
						}
					}
				});
			} else {
				this.getHomeConfigOfCity(city_code).then(function (homeconf) {
					var blocks = homeconf.block;
					for (var i = 0, len = blocks.length; i < len; i++) {
						var block = blocks[i];
						if (block.name == name) {
							defer.resolve(block);
							cb && cb(block);
							break;
						}
					}
				});
			}

			return defer.promise;
		}

	};
}, {
	requires: ["./Action", "promise", 'UFO/util/Storage']
});