KISSY.add(function (S, Node, Event, XTemplate, 
	TabPanel, HomeTab, app) {

	var LoginModalConstructor = undefined;
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
					path: "APP/orders/mods/OrderListTabs"
				}
			];
			HomeTabs.superclass.initComponent.apply(this, arguments);
		},

		openLoginModal: function (index, tab) {
			var me = this;
			var loginModal = new LoginModalConstructor({
				animation: 'slide-in-up'
			});
			loginModal.one('loginsuc', function () {
				loginModal.hide();
				me.setActiveTab(index);
			});
			loginModal.show();
			tab.removeAttr('disabled');
		},

		addCmpEvents: function () {
			var me = this;
			HomeTabs.superclass.addCmpEvents.apply(this, arguments);
			this.on('tabclick', function (index, tab) {

				if (tab.attr('name') == 'order' && !app.isLogined()) {
					if (LoginModalConstructor) {
						me.openLoginModal(index, tab);
						
					} else {
						S.use('APP/login/mods/LoginModal', function(S, OrderListTabs, LoginModal){
					 		LoginModalConstructor = LoginModal;
					 		me.openLoginModal(index, tab);
						});
					}
					return false;
				}
			});

			this.on('afterrender', function () {
			 	S.use('APP/orders/mods/OrderListTabs, APP/login/mods/LoginModal', function(S, OrderListTabs, LoginModal){
			 		LoginModalConstructor = LoginModal;
					console.log('预加载完成');
				});
			});

		}

	});

	return HomeTabs;
}, {
	requires: [
		"node", "event", "xtemplate",
		"UFO/tab/TabPanel",
		"./Home",
		"../../app"
	]
});
