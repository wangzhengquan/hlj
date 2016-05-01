KISSY.add(function(S, Node, XTemplate, ShowListFrame, ProductList, HomeAction, app, MapUtil){
	var page_size = 20;
	 
	var	params = app.getParam();
	//console.log("params.position==", params.position);
	var	queryParams =params;
	
	queryParams	 = queryParams || {};
	queryParams.page_size = page_size;
	queryParams.offset=0;
	
	function ProductListWithHeaderAndPosFooter(config){
		ProductListWithHeaderAndPosFooter.superclass.constructor.call(this, config);
	}
	
	S.extend(ProductListWithHeaderAndPosFooter, ShowListFrame);
	
	UFO.augment(ProductListWithHeaderAndPosFooter, {
		alias: 'searchListProduct',
		initComponent: function(){
			ProductListWithHeaderAndPosFooter.superclass.initComponent.apply(this, arguments);
			
		},
		init: function(){
			var me = this;
			this.setTitle(params.title );
			if(params.city){
				this.setCity(app.getCity(params.city));
				this.doSearch(queryParams);
			}else{
				MapUtil.getCurrentPosition(function(position){
					console.log('position',position);
					var city = app.getCityByName(position.address.city);
					queryParams.city=city.code;
					me.doSearch(queryParams);
					me.setCity(city);
					me.setPosition({
						city: position.address.city,
						point:  position.point,
						address: position.address.city+position.address.street+position.address.street_number
					});
				});
			}
		},
		
		createContent: function(){
			var me = this;
			this.productList  = new ProductList({
				scrollView: me.scrollView
			});
			this.productList.on('loaded', function( ){
				 
			});
			return this.productList;
		},
		setQueryUrl: function(url){
			this.productList.setQueryUrl(url);
		},
		
		doSearch: function(params){
			this.productList.setQueryParams(params);
			this.productList.setActiveSortTab(0);
		},
		 
		addCmpEvents: function(){
			ProductListWithHeaderAndPosFooter.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
			me.scrollHandler = function(){
				if(me.scrollView.scrollTop + me.scrollView.clientHeight + (47+60) >= me.scrollView.scrollHeight){
					me.removeScrollListener();
					if(!me.productList.loadFinished){
						var timeout = S.later(me.productList.appendLoadingMoreSpinner, 500, false, me.productList)
						me.scrollView.scrollTop =  me.scrollView.scrollTop + (24+10);
						me.productList.loadMore(function(){
							timeout.cancel()
							me.productList.removeLoadingMoreSpinner();
							me.addScrollListener();
						});
					}
				}
			};
			//card-item
			me.el.delegate('click', 'a.card-item', function(event){
				var product_id = S.one(event.currentTarget).attr('data-id'),
					params= {
						product_id: product_id
					};
				
				/*if(me.position){
					params.address = me.position.address;
					params.addrDetail = me.position.addrDetail;
					params.lat = me.position.point.lat;
					params.lng = me.position.point.lng;
					params.title = me.position.title;
					params.city = me.position.city;
				}*/
				
				window.location.href="../product/index.html?"+S.param(params);
			});
			
			me.on('changeDistrict', function(district_ids){
				var district_ids_str = "";
				
				if(district_ids && district_ids.length > 0){
					district_ids_str = district_ids[0];
				}
				var params = me.productList.getQueryParams();
				params.business_district_ids= district_ids_str;
				me.productList.setQueryParams(params);
				me.productList.load();
				 
				 
			});
			
			 
			me.addScrollListener();
		}
	
	 
	});
	
	return ProductListWithHeaderAndPosFooter;
}, {
	requires: ['node', "xtemplate",  
						"APP/list/mods/ShowListFrame" ,
						"./ProductList",
	          "APP/action/HomeAction",
	          "APP/app",
	          "APP/util/MapUtil"]
});
