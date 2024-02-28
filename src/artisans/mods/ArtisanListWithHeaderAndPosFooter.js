KISSY.add(function (S, Node, XTemplate, ShowListFrame, ArtisanList, HomeAction, app, MapUtil) {

	var params = app.getParam();
	params.page_size = 20;
	params.offset = 0;

	function ArtisanListWithHeaderAndPosfooter(config) {
		ArtisanListWithHeaderAndPosfooter.superclass.constructor.call(this, config);
	}

	S.extend(ArtisanListWithHeaderAndPosfooter, ShowListFrame);

	UFO.augment(ArtisanListWithHeaderAndPosfooter, {
		alias: 'artisanListWithHeaderAndPosfooter',
		initComponent: function () {
			var me = this;
			//this.el = S.all(tpl);
			ArtisanListWithHeaderAndPosfooter.superclass.initComponent.apply(this, arguments);
		},

		init: function () {
			var me = this;
			this.setTitle(params.keyword);
			if (params.city) {
				this.setCity(app.getCity(params.city));
				this.doSearch(params);
			} else {
				MapUtil.getCurrentPosition(function (position) {
					console.log('position', position);
					var city = app.getCityByName(position.address.city);
					params.city = city.code;
					me.doSearch(params);
					me.setCity(city);
					me.setPosition({
						city: position.address.city,
						point: position.point,
						address: position.address.city + position.address.street + position.address.street_number
					});
				});
			}
		},
		createContent: function () {
			var me = this;
			this.artisanList = new ArtisanList({
				scrollView: me.scrollView
			});

			this.artisanList.on('loaded', function () {

			});

			return this.artisanList;
		},

		doSearch: function (params) {
			this.artisanList.setQueryParams(params);
			this.artisanList.setActiveSortTab(0);
		},

		addCmpEvents: function () {
			ArtisanListWithHeaderAndPosfooter.superclass.addCmpEvents.apply(this, arguments);
			var me = this;

			me.scrollHandler = function () {
				//console.log('scroll', me.scrollView.scrollTop + me.scrollView.clientHeight);
				if (me.scrollView.scrollTop + me.scrollView.clientHeight + (47 + 60) >= me.scrollView.scrollHeight) {
					me.removeScrollListener();
					if (!me.artisanList.loadFinished) {
						// me.artisanList.appendLoadingMoreSpinner();
						var timeout = S.later(me.artisanList.appendLoadingMoreSpinner,  500, false, me.artisanList);
						me.scrollView.scrollTop = me.scrollView.scrollTop + (24 + 10);
						me.artisanList.loadMore(function () {
							timeout.cancel()
							me.artisanList.removeLoadingMoreSpinner();
							me.addScrollListener();
						});
					}
				}
			};

			me.on('changeDistrict', function (district_ids) {
				var district_ids_str = "";

				if (district_ids && district_ids.length > 0) {
					district_ids_str = district_ids[0];
				}
				var params = me.artisanList.getQueryParams();
				params.business_district_ids = district_ids_str;
				me.artisanList.setQueryParams(params);
				me.artisanList.load();


			});

			me.addScrollListener();
		}


	});

	return ArtisanListWithHeaderAndPosfooter;
}, {
	requires: ['node', "xtemplate",
		"APP/list/mods/ShowListFrame", 
		"./ArtisanList",
		"APP/action/HomeAction",
		"APP/app",
		"APP/util/MapUtil"]
});
