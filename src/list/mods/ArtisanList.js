KISSY.add(function (S, Node, IO, Event, DOM, XTemplate, Action, Component,
	DataLazyload, Mask, XTemplateUtil, spinnerLoadingSmallTpl, tpl, item_tpl) {
	var page_size = 20;

	var loadingTip = S.one(spinnerLoadingSmallTpl);

	var itemTpl = new XTemplate(item_tpl, {
		commands: {
			'calStarWidth': function (scopes, option) {
				return Math.round(option.params[0] * .5) * 20;
			},
			'getDistance': function (scopes, option) {
				return Math.round(option.params[0] * 1000);
			}
		}
	});


	function ArtisanList() {
		ArtisanList.superclass.constructor.apply(this, arguments);
	}
	KISSY.extend(ArtisanList, Component);
	UFO.augment(ArtisanList, {

		alias: 'artisanlist',
		initComponent: function () {
			this.el = S.one(new XTemplate(tpl).render({ hideTabNavSort: this.hideTabNavSort }));
			this.queryUrl = "/v2/artisans.json";
			this.artisanListContent = this.el.one('[name=artisan_list_content]');
			ArtisanList.superclass.initComponent.apply(this, arguments);
		},

		showSortNavTab: function (show) {
			if (show === false) {
				this.el.one('.sort-nav-tab').hide();
			} else {
				this.el.one('.sort-nav-tab').css('display', '');
			}

		},

		setActiveSortTab: function (tabItem) {
			var me = this;
			if (S.isNumber(tabItem)) {
				tabItem = this.el.one('.sort-nav-tab .sort-tab-item:nth-child(' + (tabItem + 1) + ')');
			}

			var orderBy = tabItem.attr('data-order_by');

			this.el.all('.sort-nav-tab .sort-tab-item').removeClass('active');
			this.el.one('.sort-nav-tab .price-tab-item').one('.sort-tag').removeClass('desc').removeClass('asc');
			tabItem.addClass('active');

			delete me.artisanParams.order_by;

			if (orderBy) {
				me.artisanParams.order_by = orderBy;
				if (orderBy == "price_up") {
					tabItem.attr('data-order_by', 'price_down');
					tabItem.one('.sort-tag').addClass('asc');
				} else if (orderBy == "price_down") {
					tabItem.attr('data-order_by', 'price_up');
					tabItem.one('.sort-tag').addClass('desc');
				}
			}

			me.load();
		},

		setQueryUrl: function (url) {
			this.queryUrl = url;
		},
		setQueryParams: function (params) {
			this.artisanParams = params;
		},
		getQueryParams: function () {
			return this.artisanParams;
		},

		load: function (artisanParams) {
			var me = this,
				mask = new Mask({ text: '正在加载...' });
			artisanParams = this.artisanParams = (artisanParams || this.artisanParams);
			this.fire('beforeload');
			mask.show();
			this.loadFinished = false;
			this.artisanListContent.html('');
			this.artisanParams.offset = 0;
			this.artisanParams.page_size = page_size;
			this.query(artisanParams, function (json) {
				me.fire('afterload');
				if (!json.ret) {
					mask.setText('加载出错了');
					setTimeout(function () {
						mask.hide();
					}, 2000);
					return;
				}
				if (!json.data || !json.data.length) {
					mask.setText('没有找到相关查询!');
					setTimeout(function () {
						mask.hide();
					}, 2000);
				} else {
					mask.hide();
				}


			}, function () {
				mask.setText('加载出错了');
				setTimeout(function () {
					mask.hide();
				}, 2000);
			});
		},

		loadMore: function (suc) {
			var me = this;
			this.artisanParams.offset = this.artisanParams.offset + page_size;

			this.query(this.artisanParams, function () {
				suc && suc();
			});
		},

		query: function (artisanParams, suc, error) {
			var me = this;

			artisanParams = this.artisanParams = (artisanParams || this.artisanParams);
			Action.query(this.queryUrl, artisanParams, function (json) {
				if (!json.ret) {
					alert(JSON.stringify(json));
					error && error(json);
					return;
				}
				var artisans = json.data;
				artisans.showDistance = me.showDistance;
				//console.log('artisans', artisans);
				me.artisanListContent.append(itemTpl.render(artisans));
				if (artisans.length < page_size) {
					me.loadFinished = true;
				}
				if (!me.artisanDataLazyload) {
					me.artisanDataLazyload = new DataLazyload({
						container: me.el.one('.artisan-list-content'),
						autoDestroy: false
					});

				} else {
					var dataLazyload = me.artisanDataLazyload;
					dataLazyload.addElements(dataLazyload.get('container'));
					dataLazyload._loadFn();
				}

				suc && suc(json);
			}, function (msg) {
				console.log('msg', msg);
				error && error(msg);
			});
		},
		maskLoadingMore: function () {
			this.artisanListContent.append(loadingTip);
		},
		removeLoadingMoreMask: function () {
			loadingTip.remove();
		},
		addCmpEvents: function () {
			var me = this;

			this.el.delegate('click', '.sort-nav-tab .sort-tab-item a', function (event) {
				me.setActiveSortTab(S.one(DOM.parent(event.currentTarget, '.sort-tab-item')));
			});

			this.el.delegate('click', 'a.item-artisan', function (event) {
				var artisanId = DOM.attr(event.currentTarget, 'data-id'),
					params = {
						artisan: artisanId
					};
				if (me.productHref) {
					params.productHref = encodeURIComponent(me.productHref);
				}
				location.href = "../artisan/artisanDetail.html?" + S.param(params) + (location.search ? "&" + location.search.slice(1) : "");
			});
			//../business/view/shopView.html?artisan={{artisan_id}}
		}

	});
	return ArtisanList;
}, {
	requires: ["node", "io", "event", "dom", "xtemplate",
		"../../action/Action",
		"UFO/Component",
		"mui/datalazyload/index",
		"UFO/mask/Mask",
		"../../util/XTemplateUtil",
		"../../tpl/spinner-loading-small-tpl",
		"../tpl/artisan-list-tpl",
		"../tpl/artisan-list-item-tpl"
	]
});