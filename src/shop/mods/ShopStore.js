KISSY.add(function(S, Store, Action){
	 
	function ShopStore(config){
		this.pageSize = 50;
		ShopStore.superclass.constructor.apply(this, arguments);
		
		 
			
	}
	KISSY.extend(ShopStore, Store);
	
	UFO.augment(ShopStore, {
		alias:'shopstore',
		
		load: function(artisanId, cb){
			var me = this;
			var shopdata = localStorage.getItem(artisanId+"shopdata");
			if(shopdata){
				var data = JSON.parse(shopdata);
				cb && cb(data);
				this.insert(data);
			}else{
				Action.query('/v2/artisan_detail', {artisan_id: artisanId}, function(json){
					if(json.data.decor){
						var data = JSON.parse(json.data.decor);
						cb && cb(data);
						me.insert(data);
					}else{
						cb && cb();
					}
					
				}, function(msg){
					console.error(msg);
				});
			}
		}
	});
	
	 return ShopStore;
}, {
	requires: [ 
	           'UFO/data/Store',  "../../action/Action", 
	          ]
});