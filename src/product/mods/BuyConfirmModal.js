KISSY.add(function(S, Node, XTemplate, Modal, 
		XTemplateUtil,
		Action,
		app,
		buy_confirm_tpl){
 
	function BuyConfirmModal(config){
		BuyConfirmModal.superclass.constructor.call(this, config);
	}
	
	S.extend(BuyConfirmModal, Modal);
	
	S.augment(BuyConfirmModal, {
		
		initComponent: function(){
			BuyConfirmModal.superclass.initComponent.apply(this, arguments);
			this.init();
			 
		},
		/**
		 * 
		 * @param service_addr{
		 * 	address,
		 *  city{
		 *  	code,
		 *  	name
		 *  },
		 *  latitude,
		 *  longitude,
		 *  location,
		 *  service_address_type
		 * }
		 */
		setServiceAddr: function(service_addr){
			this.service_addr = service_addr;
		},
		/**
		 * 获取user里的保存的地址
		 */
		initAddress: function(){
			var me = this;
			var user = app.getSessionUser();
		// console.log("user" , user);
			if(user){
				var addressList = user.user_address;
				if(addressList && addressList.length){
					var addr = addressList[0];
					//addr.city = app.getCity(addr.city);
					me.setServiceAddr(addr);
					this.el.all('[name=address] [name=value]').html(addressList[0].address);
				}
			}
			
			
			/*Action.query('/user/get_addresses',{
				user_id: user.user_id,
				token: user.token,
				size:1
			}, function(json){
				var addressList = json.addresses;
				console.log('addressList', addressList);
				if(addressList){
					me.service_addr = addressList[0];
					S.all('[name=address] [name=value]').html(addressList[0].address);
				}
				
				console.log('json', json);
			}, function(msg){
				console.log('msg', msg);
			});*/
		},
		
		setServiceTime: function(datetime){
			if(datetime){
				 this.data.service_time = datetime;
				 this.service_time = datetime;
				 S.all('[name=service_time] .item-content').html(datetime);
			}
		},
		
		init: function(){
			this.initAddress();
		},
		
		createModal: function(){
			return new XTemplate(buy_confirm_tpl, {
				commands:{
					'getProductPic': function (scopes, option) {
						return app.config.imgBaseUrl + option.params[0][0];
	                }
				}
			}).render(this.data);
		},
		
		addCmpEvents: function(){
			BuyConfirmModal.superclass.addCmpEvents.apply(this, arguments);
			
			 var me = this,
			 	addressEl = this.el.one('[name=address]'),
			 	shopAdressEl = this.el.one('[name=shop-address]'),
			 	priceEl = this.el.all('[name=price]');
			 
			 this.el.delegate('click tap', '.button-back', function(e){
				 me.hide();
				 return false;
			 });
			 
			 /*手艺人上门，地址选择*/
			 this.el.delegate('click tap', '[name=address]:not([disabled])', function(e){
				 var target = S.one(e.currentTarget);
				 target.attr('disabled', 'disabled');
				 
				 if(!me.serviceAddrModal){
					S.use('APP/widget/serviceaddr/ServiceAddrModal', function(S, ServiceAddrModal){
						me.serviceAddrModal = new ServiceAddrModal({allowBlank: false});
						me.serviceAddrModal.on('ok', function(addr){
							 console.log('addr' , addr);
							 S.one(e.currentTarget).one('[name=value]').html(addr.city+addr.address+(addr.addrDetail?addr.addrDetail: ""));
							 var city =  app.getCityByName(addr.city);
							 addr.city_code = city.code;
							 
							 me.setServiceAddr ({
								city: city,
								address: addr.title + (addr.addressDetail || ""),
								location: addr.address + addr.title,
								latitude: addr.point.lat*10e6,
								longitude: addr.point.lng*10e6
							 });
							 app.setPosition(addr);
						});
						
						me.serviceAddrModal.on('hide', function(event){
							 target.removeAttr('disabled');
						});
						me.serviceAddrModal.show();
				   });
			     }else{
			    	 me.serviceAddrModal.show();
			     }
				
				return false;
			 });
			 
			 /*顾客到店地址选择*/
			 this.el.delegate('click tap', '[name=shop-address]:not([disabled])', function(e){
				 var target = S.one(e.currentTarget);
				 target.attr('disabled', 'disabled');
				 
				 if(!me.data.service_time){
					 alert('请选择服务时间');
					 target.removeAttr('disabled');
					 return false;
				 }
				 var target = S.one(e.currentTarget);
				 if(!me.shopAddrModal){
					S.use('APP/product/mods/ShopAddrModal', function(S, ShopAddrModal){
						me.shopAddrModal = new ShopAddrModal({
							param: {
								product_id: me.data.product_id,
								service_time: me.data.service_time
							}
						});
						
						me.shopAddrModal.on('hide', function(event){
							target.removeAttr('disabled');
						});
						
						me.shopAddrModal.on('ok', function(addr){
							 console.log('addr' , addr);
							 S.one(e.currentTarget).one('[name=value]').html(addr.location||addr.address);
							 me.service_addr =  addr;
							 
						});
						me.shopAddrModal.show();
				   });
			     }else{
			    	 me.shopAddrModal.show();
			     }
				return false;
			 });
			 
			 /**
			  * 服务类型
			  * 手艺人上门/顾客到店
			  */
			 this.el.delegate('click tap', '.service-type', function(event){
				 var target = S.one(event.currentTarget),
				 	service_type = target.attr('data-service_type');
				 
				 me.service_type = service_type;
				 me.el.all('.service-type').removeClass('select');
				 target.addClass('select');
				 if(service_type=="artisan_visit"){
					 //手艺人上门
					 priceEl.html("￥"+me.data.price);
					 addressEl.show();
					 shopAdressEl.hide();
				 }else{
					 //顾客到店
					 priceEl.html("￥"+me.data.customer_visit_price);
					 addressEl.hide();
					 shopAdressEl.show();
				 }
				 
				 return false;
			 });
		 
			 /**
			  * 时间选择
			  */
			 this.el.delegate('click tap', '[action=showServiceTimeModal2]:not([disabled])', function(event){
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				
				if(!me.serviceTimeModal){
					KISSY.use("APP/widget/servicetime/ServiceTimeModal", function(S, ServiceTimeModal){
						 me.serviceTimeModal = new ServiceTimeModal({
							 param: {
								 product_id: me.data.product_id,
								 artisan_id: me.data.artisan.artisan_id
							 }
						 });
						 me.serviceTimeModal.show();
						 me.serviceTimeModal.on('hide', function(event){
							target.removeAttr('disabled');
						 });
						 me.serviceTimeModal.on('ok', function(datetime){
							 //target.one('.item-content').html(datetime);
							 me.setServiceTime(datetime);
							
						 });
					}); 
				}else{
					 me.serviceTimeModal.show();
				}
				return false;
			});
			 
			/*确认购买*/
			this.el.delegate('click tap', '[action=buy]', function(event){
				
				if(!me.data.service_time){
					alert('请选择服务时间');
					return false;
				}
				if(!me.service_addr){
					alert('请选择服务地址');
					return false;
				}
				
				var user = app.getSessionUser();
				
				var order = {
						reserve_time: me.data.service_time,
						service_time: me.data.service_time,
						service_addr: me.service_addr,
						service_type:  me.service_type || 'artisan_visit',
						//product: me.data
					};
				
				var product = me.data;
				var artisan =  product.artisan;
				artisan.artisan_name = artisan.name;
				delete artisan.name;
				artisan.artisan_avatar = product.artisan.avatar;
				S.mix(order, artisan);  
				delete product.artisan;
				
				product.product_pic = product.pics[0];
				S.mix(order, product);  
				order.address = order.service_addr.location;
				
				if(user){
					order.user_name = user.nick;
					order.user_mobile = user.mobile;
					user.order = order;
					app.setSessionUser(user);
				}else{
					console.log('未登录');
				}
				
				//new
				/*if(app.isMicroMessenger()){
				   location.href= app.config.zmwHost + "/hlj_wx/hlj/auth4H5";
				}else{
					location.href="../order/orderConfirm.html";
				}*/
				
				//old
				var _param = {
					product_id: order.product_id,
					reserve_time: order.service_time,
					address: order.service_addr.location,
					latitude:order.service_addr.latitude,
					longitude:order.service_addr.longitude,
					address_id: order.service_addr.address_id,
					service_address_type: order.service_addr.service_address_type || "home",
					service_type:  me.service_type || 'artisan_visit'
					
				};
 
				if(order.service_addr.city){
					_param.city = app.getCity(order.service_addr.city).name;
				}
				location.href=  "../order/orderConfirm.html?"+S.param(_param);
				// location.href=  "../order/orderConfirm.html?"+encodeURI(decodeURIComponent(S.param(_param)));
				return false;
			});
		 
		}
		 
	});
	
	return BuyConfirmModal;
}, {
	requires: ['node', 'xtemplate', 
	           'UFO/modal/Modal',
	           "../../util/XTemplateUtil", 
	           "../../action/Action",
	           "../../app",
	           '../tpl/buy-confirm-tpl'
	           
	          ]
});
