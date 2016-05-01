KISSY.add(function(S, Node, XTemplate, Modal, 
		XTemplateUtil,
		Action,
		app,
		tpl,
		item_tpl){
 
	function ShopAddrModal(config){
		ShopAddrModal.superclass.constructor.call(this, config);
	}
	
	S.extend(ShopAddrModal, Modal);
	
	S.augment(ShopAddrModal, {
		
		initComponent: function(){
			var me = this;
			ShopAddrModal.superclass.initComponent.apply(this, arguments);
			this.shop_addr_list = this.el.one('.shop-addr-list');
			this.init();
			 
		},
		 
		init: function(){
			var me = this;
			// console.log("========= init ShopAddrModal =====")
			Action.query('/v2/get_service_addresses', me.param, function(json){
				if(json.ret){
					var studio_list = json.studio_list;
					if(json.city && studio_list){
						var city_code = app.getCityByName(json.city);
						for(var i=0, len = studio_list.length; i<len; i++){
							studio_list[i].city = city_code;
						}
					}
					me.studio_list = json.studio_list;
					me.shop_addr_list.append(new XTemplate(item_tpl).render(json));
				}
				
				console.log('json', json);
			}, function(msg){
				console.log('msg', msg);
			});
			
		},
		createModal: function(){
			return tpl;
		},
		
		addCmpEvents: function(){
			ShopAddrModal.superclass.addCmpEvents.apply(this, arguments);
			 var me = this;
			 this.el.delegate('click tap', '.button-back', function(e){
				 me.hide();
				 return false;
			 });
			 
			 this.el.delegate('click tap', '.button-ok', function(e){
				 var checkbox = me.shop_addr_list.one('.checkbox input:checked');
				 if(!checkbox){
					 alert('请选择店铺地址!');
					 return false;
				 }
				 var index = checkbox.parent('.item').index();
				// alert(index);
				 me.fire('ok', me.studio_list[index]);
				 me.hide();
				 return false;
			 });
		}
		 
	});
	
	return ShopAddrModal;
}, {
	requires: ['node', 'xtemplate', 
	           'UFO/modal/Modal',
	           "../../util/XTemplateUtil", 
	           "../../action/Action",
	           "../../app",
	           '../tpl/shop-addr-tpl',
	           '../tpl/shop-addr-list-item-tpl'
	          ]
});