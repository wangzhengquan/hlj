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
			me.data = {
				coupons:[
					{
						coupon_name: '满100减50',
						coupon_price: 50,
						use_over_date: new Date().getTime()
					},
					{
						coupon_name: '十.一大促',
						coupon_price: 100,
						use_over_date: new Date().getTime()
					},
					{
						coupon_name: '新人优惠',
						coupon_price: 150,
						use_over_date: new Date().getTime()
					},
	
				]
			}
			
			me.getBodyContainer().html(new XTemplate(tpl).render(me.data));
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