KISSY.add(function (S, Node, Event, DOM, XTemplate,
	Action, ShowListFrame,
	ProductList, ArtisanList, SearchModal) {

	var productTagItemTpl = new XTemplate([
		'<li class="tag-item col"> ',
		'<a>{{name}}</a>',
		'</li>'].join(''));

	function ShowList(config) {
		
		config = config || {};
		S.mix(config, {
			productTypeName: 'filter_category',
			artisanTypeName: 'filter_type'
		}, false, undefined, true);
		ShowList.superclass.constructor.call(this, config);
	}

	KISSY.extend(ShowList, ShowListFrame);

	KISSY.augment(ShowList, {

		initComponent: function () {
			
			var me = this;
			ShowList.superclass.initComponent.apply(this, arguments);
			this.artisanList = new ArtisanList(this.config);
			this.artisanList.on('beforeload', function () {
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.removeScrollListener();
			});
			this.artisanList.on('afterload', function () {
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.addScrollListener();
			});
			this.productList = new ProductList(this.config);
			this.productList.on('beforeload', function () {
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.removeScrollListener();

			});
			this.productList.on('afterload', function () {
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.addScrollListener();
			});

			this.header = this.el.one('.header');
			this.headerTabItems = this.header.all('.tab-item');
			this.headerNavTabBodyItems = this.el.all('.header-nav-tab-body-item');



			this.el.one('.product-tab-body-item').append(this.productList.toEl());
			this.el.one('.artisan-tab-body-item').append(this.artisanList.toEl());
		},

		createContent: function () {
			return [
				'<div class="header-nav-tab-body-item product-tab-body-item">',
				'</div>',
				'<div class="header-nav-tab-body-item artisan-tab-body-item"  style="padding:0; display:none;">',
				'</div>'
			].join('');
		},
		createHeader: function () {
			return [
				'<a class="button button-clear back-button icon iconfont icon-back" href="javascript:;" onclick="history.go(-1);"> </a>',
				'<div class="tab-nav tabs title">',
				'   <a class="tab-item" data-index="0">作品</a>',
				'   <a class="tab-item" data-index="1">手艺人</a>',
				'</div>',
				'<div class="buttons buttons-right" style="-webkit-transition-duration: 0ms; transition-duration: 0ms;">',
				'	<button name="button_search" class="button button-clear icon iconfont icon-search">  </button>',
				'</div>'
			].join('');
		},
		/**
		 * 选中 header选项卡
		 * @param tabItem
		 */
		setActiveHeaderTab: function (tabItem) {
			var me = this,
				index = 0;
			
			if (S.isNumber(tabItem)) {
				index = tabItem;
				tabItem = this.el.one('.header .tab-item:nth-child(' + (index + 1) + ')');
			} else {
				index = tabItem.attr('data-index');
			}

			index = parseInt(index);

			if (!tabItem.hasClass('active')) {
				this.headerTabIndex = index;

				me.headerTabItems.removeClass('active');
				tabItem.addClass('active');
				me.headerNavTabBodyItems.hide();
				S.one(me.headerNavTabBodyItems[index]).show();

				if (!tabItem.data('inited')) {
					tabItem.data('inited', true);
					if (index == 0) {
						this.createProductTabBodyItem();
					} else {
						this.createArtisanTabBodyItem();
					}
				}
			}
		},

		createArtisanTabBodyItem: function () {
			this.createArtisanTypeTabNav();
		},

		createArtisanTypeTabNav: function () {
			var me = this;
			var block = me.block;
			var search_types = block.search_types2,
				search_types_dom = [],
				artisanTabBody = me.el.one('.artisan-tab-body-item');
			if (search_types.length > 1) {
				var serviceTabNavTpl = new XTemplate([
					'<ul class="tab-nav-type flex">',
					'{{#each this}}',
					'<li class="tab-item-type col " data-key="' + this.artisanTypeName + '" data-value={{value}}>',
					'<a style="background:{{background background_normal img_url}}; background-size: 30px 30px;">',
					'<i class="arrow"></i>',
					'{{name}}',
					//'<img src="../resources/images/{{img_type}}.png">',
					'</a>',
					'</li>',
					'{{/each}}',
					'</ul>'
				].join(''), {
					commands: {
						'background': function (scopes, option) {
							return "#" + option.params[0].toString(16) + " url(" + option.params[1] + ") no-repeat center 5px";
						}
					}
				});
				DOM.insertBefore(S.one(serviceTabNavTpl.render(search_types)), this.artisanList.getEl());
				me.setArtisanActiveTypeTab(0);
			} else if (search_types.length == 1) {
				this.filterArtisanByType(search_types[0].value);
			} else {
				console.error('search_types.length == 0')
			}
		},

		setArtisanActiveTypeTab: function (tabItem) {
			var me = this;
			if (S.isNumber(tabItem)) {
				tabItem = me.el.one('.artisan-tab-body-item .tab-nav-type .tab-item-type:nth-child(' + (tabItem + 1) + ')');
			}

			if (!tabItem.hasClass('active')) {
				me.el.all('.artisan-tab-body-item .tab-nav-type .tab-item-type').removeClass('active');
				tabItem.addClass('active');
				var value = tabItem.attr('data-value'),
					key = tabItem.attr('data-key');
				this.filterArtisanByType(value);

			}
		},

		filterArtisanByType: function (type) {
			var parmas = S.clone(this.params);
			this.artisanType = type;
			parmas[this.artisanTypeName] = type;
			this.artisanList.setQueryParams(parmas);
			this.artisanList.setActiveSortTab(0);
		},

		/**
		 * 创建作品选项卡的body
		 */
		createProductTabBodyItem: function () {
			this.createProductServiceTabNav();
		},

		/**
		 * 创建作品类型选项卡导航条
		 */
		createProductServiceTabNav: function () {
			var me = this;
			var block = me.block;
			var search_types1 = block.search_types1;
			if (search_types1.length > 1) {
				var serviceTabNavTpl = new XTemplate([
					'<ul class="tab-nav-type flex">',
					'{{#each this}}',
					'<li class="tab-item-type col " data-key="' + this.productTypeName + '" data-value={{value}}>',
					'<a style="background:{{background background_normal img_url}}; background-size: 30px 30px;">',
					'<i class="arrow"></i>',
					'{{name}}',
					'</a>',
					'</li>',
					'{{/each}}',
					'</ul>'
				].join(''), {
					commands: {
						'background': function (scopes, option) {
							return "#" + option.params[0].toString(16) + " url(" + option.params[1] + ") no-repeat center 5px";
						}
					}
				});
				DOM.insertBefore(S.one(serviceTabNavTpl.render(search_types1)), this.productList.getEl());

				me.setProductActiveTypeTab(0);
			} else if (search_types1.length == 1) {

				me.filterProductByType(search_types1[0].value);
			} else {
				console.log('createProductServiceTabNav search_types1.length == 0')
			}

		},

		/**
		 * 设置选中的作品类型选项卡
		 * @param tabItem
		 */
		setProductActiveTypeTab: function (tabItem) {
			var me = this;
			if (S.isNumber(tabItem)) {
				tabItem = me.el.one('.product-tab-body-item .tab-nav-type .tab-item-type:nth-child(' + (tabItem + 1) + ')');
			}

			if (!tabItem.hasClass('active')) {
				me.el.all('.product-tab-body-item .tab-nav-type .tab-item-type').removeClass('active');
				tabItem.addClass('active');

				me.filterProductByType(tabItem.attr('data-value'));
			}
		},

		/**
		 * 用作品类型过滤作品
		 * @param productType
		 */
		filterProductByType: function (productType) {
			this.productType = productType;
			this.createProductTagPanel(productType);
			var params = S.clone(this.params);
			params[this.productTypeName] = productType;
			console.log('params==', params);
			this.productList.setQueryParams(params);
			this.productList.setActiveSortTab(0);
		},

		//get_product_tags?city=110100&category=tag_mei_jia
		/**
		 * 创建作品标签面板
		 */
		createProductTagPanel: function (productType) {
			var me = this;
			me.productTagPanel && me.productTagPanel.remove();
			Action.query( "/v2/get_product_tags.json", {
				city: me.city.code,
				category: productType,
				referer_page: 'products'
			}, function (json) {
				var productTagsData = json.data;
				if (productTagsData && productTagsData.length) {
					me.productTagPanel = S.one('<div class="tag-panel"></div>');
					var colIndex = 0;
					S.each(productTagsData, function (tag) {
						if (colIndex % 3 === 0 || tag.length === 3) {
							row = S.one('<ul class="flex tag-row"></ul>');
							me.productTagPanel.append(row);
						}
						colIndex = colIndex + tag.length;
						var col = S.one(productTagItemTpl.render({ name: tag.name }));
						var searchCondition = {};
						searchCondition[tag.search_conditions1[0].key] = tag.search_conditions1[0].value;
						col.data('searchCondition', searchCondition);
						row.append(col);

					});
					DOM.insertBefore(me.productTagPanel, me.productList.getEl());
				}

			}, function (msg) {
				console.log('error', msg);
			});
		},


		addCmpEvents: function () {
			ShowList.superclass.addCmpEvents.apply(this, arguments);

			var me = this;
			me.scrollHandler = function () {
				//console.log('scroll', me.scrollView.scrollTop + me.scrollView.clientHeight);
				if (me.scrollView.scrollTop + me.scrollView.clientHeight + (47 + 60) >= me.scrollView.scrollHeight) {

					if (me.headerTabIndex == 0) {
						if (!me.productList.loadFinished) {
							me.removeScrollListener();
							// me.productList.appendLoadingMoreSpinner();
							var timeout = S.later(me.productList.appendLoadingMoreSpinner,  500, false, me.productList)
							me.scrollView.scrollTop = me.scrollView.scrollTop + (24 + 10);
							me.productList.loadMore(function () {
								timeout.cancel()
								me.productList.removeLoadingMoreSpinner();
								me.addScrollListener();
							});
						}
					} else if (me.headerTabIndex == 1) {
						if (!me.artisanList.loadFinished) {
							me.removeScrollListener();
							// me.artisanList.appendLoadingMoreSpinner();
							var timeout = S.later(me.artisanList.appendLoadingMoreSpinner,  500, false, me.artisanList)
							me.scrollView.scrollTop = me.scrollView.scrollTop + (24 + 10);
							me.artisanList.loadMore(function () {
								timeout.cancel()
								me.artisanList.removeLoadingMoreSpinner();
								me.addScrollListener();
							});
						}

					}
				}

			};

			me.header.delegate('tap click', '.tab-item:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				me.setActiveHeaderTab(S.one(event.currentTarget));
				target.removeAttr("disabled");
				return false;
			});

			Event.delegate(document, 'tap click', '.product-tab-body-item .tab-nav-type .tab-item-type a:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				var curTabItem = S.one(DOM.parent(event.currentTarget, '.tab-item-type'));
				me.setProductActiveTypeTab(curTabItem);
				target.removeAttr("disabled");
				return false;
			});

			Event.delegate(document, 'tap click', '.artisan-tab-body-item .tab-nav-type .tab-item-type a:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				var curTabItem = S.one(DOM.parent(event.currentTarget, '.tab-item-type'));
				me.setArtisanActiveTypeTab(curTabItem);
				target.removeAttr("disabled");
				return false;
			});

			Event.delegate(document, 'tap click', '.product-tab-body-item .tag-panel .tag-item a:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				var curItem = S.one(DOM.parent(event.currentTarget, '.tag-item')),
					searchCondition = curItem.data('searchCondition');
				if (!curItem.hasClass('active')) {

					var params = S.clone(me.params);
					params[me.productTypeName] = me.productList.getQueryParams().filter_category;
					S.mix(params, searchCondition, true);
					me.productList.setQueryParams(params);

					S.all('.tag-item').removeClass('active');
					curItem.addClass('active');
					me.productList.setActiveSortTab(0);
				}
				target.removeAttr("disabled");
				return false;

			});


			/**
			 * search modal
			 */
			me.el.delegate('tap click', 'button[name=button_search]:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				if (!me.searchModal) {
					me.searchModal = new SearchModal({
						animation: 'slide-in-up'
					});
					me.searchModal.on('hide', function () {
						me.addScrollListener && me.addScrollListener();
						target.removeAttr("disabled");
					});
					me.searchModal.on('beforeshow', function () {
						me.removeScrollListener && me.removeScrollListener();
					});

					// var _params = S.clone(me.params);
					var _params = {
						filter_type: me.artisanType || me.block.search_types2[0].value,
						city: me.city.code
					};

					me.searchModal.setParams(_params);

					if (me.headerTabIndex === 0 && me.productType.indexOf('tag_mei_jia') > -1) {
						me.searchModal.showProductLabels();
					}
					me.searchModal.show();
				} else {
					if (me.headerTabIndex === 0 && me.productType.indexOf('tag_mei_jia') > -1) {
						me.searchModal.showProductLabels();
					}
					me.searchModal.show();
				}
				return false;
			});

			//card-item
			me.el.delegate('tap click', 'a.card-item', function (event) {
				var product_id = S.one(event.currentTarget).attr('data-id'),
					params = {
						product_id: product_id
					},
					href = me.productHref || "../product/index.html";

				params.city = me.city.name;

				window.location.href = href + "?" + S.param(params);
				return false;
			});

			me.on('changeDistrict', function (district_ids) {
				var district_ids_str = "";

				if (district_ids && district_ids.length > 0) {
					district_ids_str = district_ids[0];
				}
				me.params.business_district_ids = district_ids_str;
				if (me.artisanList.getQueryParams()) {
					var params = me.artisanList.getQueryParams();
					params.business_district_ids = district_ids_str;
					me.artisanList.setQueryParams(params);
				}

				if (me.productList.getQueryParams()) {
					var params = me.productList.getQueryParams();
					params.business_district_ids = district_ids_str;
					me.productList.setQueryParams(params);
				}
				if (me.headerTabIndex == 0) {
					me.productList.load();
				} else if (me.headerTabIndex == 1) {
					me.artisanList.load();
				}

			});

			me.addScrollListener();
		}
	});

	return ShowList;
}, {
	requires: [
		"node", "event", "dom", "xtemplate",
		"APP/action/Action",
		"./ShowListFrame",
		"APP/products/mods/ProductList",
		"APP/artisans/mods/ArtisanList",
		"APP/widget/search/SearchModal"
	]
});
