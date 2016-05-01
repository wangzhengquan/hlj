KISSY.add(function (S, Cookie, ShowList, HomeAction, app) {
	var queryParams = app.getParam();
	var showList = null;

	queryParams.name = queryParams.name || '美甲';
	S.one('title').html(queryParams.name);

	var _PARAMS = {
		offset: 0,
		page_size: 20

	};
	return {
		init: function () {
			this.initShowList();
			// this.createChannelCookie();
		},

		initShowList: function () {
			var me = this;
			showList = new ShowList();
			showList.set('params', _PARAMS);
			showList.render(S.one(document.body));
			if (queryParams.city) {
				showList.setCity(app.getCity(queryParams.city));
			}

			var city = showList.get('city');
				_PARAMS['city'] = city.code;
			 
			HomeAction.getConfigByCityAndName(queryParams.from, city.code, queryParams.name).then(function (block) {
				showList.block = block;
				if (showList.headerTabIndex === undefined) {
					showList.setActiveHeaderTab(0);
				}
			});
		}
		 
		 
	};

}, {
	requires: ['cookie', './ShowList', "../../action/HomeAction", "../../app"]
});