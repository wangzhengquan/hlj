KISSY.add(function(S){
	// var geolocation = new BMap.Geolocation();
	//var map = new BMap.Map();  
	
	return {
		/**
		 * 获取当前所在地理位置
		 * @param suc
		 * @param error
		 * @returns
		 */
		getCurrentPosition: function(suc, error){
			var position = {
				"accuracy": null,
				"altitude": null,
				"altitudeAccuracy": null,
				"heading": null,
				"latitude": "39.91092455",
				"longitude": "116.41338370",
				"speed": null,
				"timestamp": null,
				"point": {
						"lng": 116.4133837,
						"lat": 39.91092455,
						"pf": "inner"
				},
				"address": {
						"city": "北京市",
						"city_code": 0,
						"district": "",
						"province": "北京市",
						"street": "",
						"street_number": ""
				}
		  }
			var defer = S.Defer(); 
			suc && suc(position);
			defer.resolve(position);
			return defer.promise;
		},

	// 	getCurrentPosition2: function(suc, error){
	// 		var defer = S.Defer();  
	// 		geolocation.getCurrentPosition(function(position){
	// 			if(this.getStatus() == BMAP_STATUS_SUCCESS){
	// 				suc && suc(position);
	// 				defer.resolve(position);
	// 			}
	// 			else {
	// 				position = {
	// 					address:{
	// 						city:'北京市'
	// 					},
	// 					city:'北京市'
	// 				};
	// 				suc && suc(position);
	// 				defer.resolve(position);
					 
	// 			}        
	// 		},{enableHighAccuracy: true});
	// 		return defer.promise;
	// 	}
	}
});