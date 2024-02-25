KISSY.add(function(S, Node, XTemplate , Modal, ScrollView, tpl){
	 
	
	 
	
	function OrderCancelRuleModal(config){
		//animation: 'slide-in-right'
	    //animation: 'slide-in-up'
		OrderCancelRuleModal.superclass.constructor.call(this, config);
	}
	
	S.extend(OrderCancelRuleModal, Modal);
	
	UFO.augment(OrderCancelRuleModal, {
		alias: 'OrderCancelRuleModal',
		
		initComponent: function(){
			 
			OrderCancelRuleModal.superclass.initComponent.apply(this, arguments);
			
			this.modal.append(tpl);
		},
		 
		
		addCmpEvents: function(){
			var me = this;
			
			this.el.delegate('click', '.button-back', function(event){
				me.slideOut();
			});
			
		}
		 
		
	 
	});
	
	return OrderCancelRuleModal;
}, {
	requires: ['node', 'xtemplate',
	           'UFO/modal/Modal', 
	           'UFO/scroll/ScrollView',
	           "../tpl/order-cancel-rule-tpl"
	          ]
});