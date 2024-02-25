KISSY.add(function(S, Node, Event, XTemplate,Container, OrderListTabSlider){
	
	function OrderTab(config){
		OrderTab.superclass.constructor.call(this, config);
	}
	
	S.extend(OrderTab, Container);
	
	UFO.augment(OrderTab, {
		alias: 'ordertab',
		
		initComponent: function(){
			var me = this;
			 
			/*this.navBar = {
    		  title: '订单', 
    		  barCls: 'bar-love'
       		};*/
			this.items = [{
				type: 'orderListTabSlider'
			}];
			OrderTab.superclass.initComponent.apply(this, arguments);
		},
		 
		
		addCmpEvents: function(){
			OrderTab.superclass.addCmpEvents.apply(this, arguments);
		}
		
	});
	
	return OrderTab;
}, {
	requires: [
	   "node", "event", "xtemplate", "UFO/container/Container", "../../order/mods/OrderListTabSlider"
	]
});