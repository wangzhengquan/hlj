KISSY.add(function (S, Node, Event, XTemplate, TabPanel, HomeTab, app) {


	function HomeTabPanel(config) {
		HomeTabPanel.superclass.constructor.call(this, config);
	}

	S.extend(HomeTabPanel, TabPanel);

	UFO.augment(HomeTabPanel, {
		alias: 'hometabpanel',

		initComponent: function () {
			this.items = [
				{
					title: '首页',
					iconCls: 'icon-home',
					iconInCls: 'icon-home-in',
					name: 'home',
					type: "hometab"
				}, {
					title: '订单',
					iconCls: 'icon-order',
					iconInCls: 'icon-order-in',
					name: 'order',
					navBar: { title: '订单', barCls: 'bar-love' },
					type: "ordertab",
					//有path参数可以实现按需加载
					path: "app/home/mods/OrderTab"
				}
			];
			HomeTabPanel.superclass.initComponent.apply(this, arguments);
		},

		addCmpEvents: function () {
			var me = this;
			HomeTabPanel.superclass.addCmpEvents.apply(this, arguments);
			this.on('tabclick', function (index, tab) {

				if (tab.attr('name') == 'order' && !app.isLogined()) {
					if (!me.loginModal) {
						S.use("app/login/mods/LoginModal", function (S, LoginModal) {
							me.loginModal = new LoginModal({
								animation: 'slide-in-up'
							});
							me.loginModal.one('loginsuc', function () {
								me.loginModal.hide();
								me.setActiveTab(index);
							});
							me.loginModal.show();
							tab.removeAttr('disabled');
						});
					} else {
						me.loginModal.show();
						tab.removeAttr('disabled');
					}
					//if(app.getSession().get('user'))
					return false;
				}
			});

		}
	});

	return HomeTabPanel;
}, {
	requires: [
		"node", "event", "xtemplate",
		"UFO/tab/TabPanel",
		"./HomeTab",
		"../../app"
	]
});