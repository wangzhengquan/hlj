KISSY.add(function(S, Node, XTemplate, Modal, 
		XTemplateUtil,
		Action,
		app,
		tpl
	){
 
	function CouponModal(config){
		CouponModal.superclass.constructor.call(this, config);
	}
	
	S.extend(CouponModal, Modal);
	
	S.augment(CouponModal, {
		
		initComponent: function(){
			var me = this;
			CouponModal.superclass.initComponent.apply(this, arguments);
			 
			this.init();
			 
		},
		 
		init: function(){
			var me = this;
			/*me.param = {
				user_id:'25aa15ef06a44695ab4880bfeb511db7',
				token: 'SqBBEc7Yqeo15Rkhi0ga', 
				product_id: '163e9d6fe75349a39f607577d96e0bca'
			};*/
			if(this.data){
				me.getBodyContainer().html(new XTemplate(tpl).render(json));
			}else{
				Action.query('/user/search_coupon_use', me.param, function(json){
					console.log('json', json);
					me.data = json;
					me.getBodyContainer().html(new XTemplate(tpl).render(json));
				}, function(msg){
					console.log('msg', msg);
				});
			}
			
		},
		
		addCmpEvents: function(){
			CouponModal.superclass.addCmpEvents.apply(this, arguments); 
			var me = this;
			this.el.delegate('click tap', '[action=select_coupon]', function(event){
				var target = S.one(event.currentTarget),
					index = target.attr('data-index');
				
				if(index !== undefined){
					me.fire('select', me.data.coupons[index]);
				}else{
					me.fire('select');
				}
				me.hide();
				return false;
			});
		}
		 
	});
	
	return CouponModal;
}, {
	requires: ['node', 'xtemplate', 
	           'UFO/modal/Modal',
	           "../../util/XTemplateUtil", 
	           "../../action/Action",
	           "../../app",
	           '../tpl/coupon-tpl',
	           
	          ]
});