KISSY.add(function (S, Action, Promise, Storage, HomeConfig, BannerConfig) {

	return {
		/*
		 * 获取home配置
		 */
		getHomeConfig: function (cb) {
			 var defer = S.Defer();
			 cb && cb(HomeConfig);  
			 defer.resolve(HomeConfig);                            
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
			});

			return defer.promise;
		},

		/*
		 * 获取指定城市的banner配置
		 */
		getBannerConfigOfCity: function (city_code, cb) {
			// console.log('================', BannerConfig)
			var defer = S.Defer();
			cb && cb(BannerConfig.data);
			defer.resolve(BannerConfig.data);
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
	requires: ["./Action", "promise", 'UFO/util/Storage', 'APP/data/home_config', 'APP/data/banner_config']
});