KISSY.add(function(S, Node, Xtemplate, Action, app, coupon_list_tpl, MapUtil) {
	return {
		attachEvent: function() {
			S.one("#s-button").on("click", function(event) {
				app.notifyApp('hljclient://', 'helijia://www.helijia.com/artisans');
			});
			var oDiv = S.one('#couponList');
			oDiv.delegate('click', '.fle', function(event) {
				//console.log("click ", event.currentTarget);
				var target = S.one(event.currentTarget);
				var tarLast = target.parent().last();
				if (tarLast.hasClass('shuoming')) {
					S.one('body').css('overflow', 'hidden');
					tarLast.css('-webkit-transform', 'translateY(0%)');
					tarLast.last().on('click', function(event) {
						var target = S.one(event.currentTarget);
						S.one('body').css('overflow', 'auto');
						target.parent().css('-webkit-transform', 'translateY(-100%)');
					});
				};
			});
		},
		renderCouponeList: function() {
			var self = this;
			MapUtil.getCurrentPosition().then(function(json) {
				var city = app.getCityByName(json.address.city);
				Action.query('/v2/receive/getCouponData', {}, function(json) {
					//json.city = city.code;
					console.log(json)
					S.one('#couponList').html(new Xtemplate(coupon_list_tpl, {
						commands: {
							'getProductListHref': function(scopes, option) {	
								var filter_category = option.params[0],
									filter_active = option.params[1],
									type=option.params[2];									 	
								var _param 	= {
									type: 'products',
									city: city.code,
									filter_category: filter_category
								}		
								if(filter_active){
									_param.filter_active = filter_active;
								}	
								if (app.isApp()) {
									return app.config.baseUrl + "/v2/search?"+S.param(_param) ;
								} else if(type) {
									return "http://www.helijia.com/mobile/build/APP/home/index.html?channel=new_weixin";
								}else{									
									return "../products/products_of_active.html?"+S.param(_param) ;
								}

							}
						}
					}).render(json));
				});
			});
			/*var json = {
				data:[{
					couponName: "aaaa",
					type:'1'
				}, {
					couponName: "bbbb",
					type:''
				},{
					couponName: "cccc",
					type:''
				}]
			};*/
		},
		init: function() {
			this.renderCouponeList();
			this.attachEvent();
		}
	}

}, {
	requires: [
		'node',
		"xtemplate",
		"../../action/Action",
		"../../app",
		"../tpl/coupon-list-tpl",
		"../../util/MapUtil"
	]
});
