KISSY.add(function (S, Node, Event, XTemplate, 
	TabPanel, HomeTab,  OrderListTabs, LoginModal, app) {
	function HomeTabs(config) {
		HomeTabs.superclass.constructor.call(this, config);
	}

	S.extend(HomeTabs, TabPanel);

	UFO.augment(HomeTabs, {
		alias: 'hometabs',

		initComponent: function () {
			this.items = [
				{
					title: '首页',
					iconCls: 'icon-home',
					iconInCls: 'icon-home-in',
					name: 'home',
					type: "home"
				}, {
					title: '订单',
					iconCls: 'icon-order',
					iconInCls: 'icon-order-in',
					name: 'order',
					navBar: { title: '订单', barCls: 'bar-love' },
					type: "orderListTabs",
					//有path参数可以实现按需加载
					// path: "APP/orders/mods/OrderListTabs"
				}
			];
			HomeTabs.superclass.initComponent.apply(this, arguments);
		},

		addCmpEvents: function () {
			var me = this;
			HomeTabs.superclass.addCmpEvents.apply(this, arguments);
			this.on('tabclick', function (index, tab) {

				if (tab.attr('name') == 'order' && !app.isLogined()) {
					if (!me.loginModal) {
						me.loginModal = new LoginModal({
							animation: 'slide-in-up'
						});
						me.loginModal.one('loginsuc', function () {
							me.loginModal.hide();
							me.setActiveTab(index);
						});
						me.loginModal.show();
						tab.removeAttr('disabled');
					} else {
						me.loginModal.show();
						tab.removeAttr('disabled');
					}
					return false;
				}
			});

		}
	});

	return HomeTabs;
}, {
	requires: [
		"node", "event", "xtemplate",
		"UFO/tab/TabPanel",
		"./Home",
		"APP/orders/mods/OrderListTabs",
		"APP/login/mods/LoginModal",
		"../../app"
	]
});
