KISSY.add(function (S, Node, Event, XTemplate, 
	Action, Component, 
	Mask, Util,
	XTemplateUtil,
	spinnerLoadingSmallTpl,
	tpl,
	list_item_tpl) {
// console.log('list_item_tpl====', list_item_tpl)
	var win = window,
		page_size = 20;

	var loadingTip = S.one(spinnerLoadingSmallTpl),
		listItemTpl = new XTemplate(list_item_tpl);


	var p_img_width = 0,
		p_img_height = 0;

	/**
	 * 计算作品图片
	 * @returns {Number}
	 */
	var calcProductImgSize = function () {
		var width = (document.documentElement.offsetWidth - 4 * 6) / 2;
		p_img_width = width,
			p_img_height = width;
		return {
			width: p_img_width,
			height: p_img_height
		};
	};
	/*
	 * 设置作品图片大小
	 */
	var setProductImgSize = function () {
		calcProductImgSize();
		S.all(".product-item .card-item .product-img").attr({
			width: p_img_width,
			height: p_img_height
		});
		// S.all(".product-item .card-item .product-img").css({
		// 	width: p_img_width,
		// 	height: p_img_height
		// });
	};

	function ProductList() {
		ProductList.superclass.constructor.apply(this, arguments);
	}
	KISSY.extend(ProductList, Component);
	KISSY.augment(ProductList, {

		initComponent: function () {
			this.el = S.one(new XTemplate(tpl).render({ hideTabNavSort: this.hideTabNavSort }));
			// this.queryUrl = "/resources/data/product_list_meirong.json?";
			this.productListContent = this.el.one('.list-content');
			calcProductImgSize();
			ProductList.superclass.initComponent.apply(this, arguments);
		},

		/**
		 * 
		 * @param tabItem
		 */
		setActiveSortTab: function (tabItem) {
			var me = this;
			if (S.isNumber(tabItem)) {
				tabItem = this.el.one('.sort-nav-tab .sort-tab-item:nth-child(' + (tabItem + 1) + ')');
			}

			var orderBy = tabItem.attr('data-order_by');

			this.el.all('.sort-nav-tab .sort-tab-item').removeClass('active');
			this.el.one('.sort-nav-tab .price-tab-item').one('.sort-tag').removeClass('desc').removeClass('asc');
			tabItem.addClass('active');

			delete me.productParams.order_by;

			if (orderBy) {
				me.productParams.order_by = orderBy;
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
			this.productParams = params;
		},
		getQueryParams: function () {
			return this.productParams;
		},

		load: function (productParams) {
			var me = this,
				mask = new Mask({ text: '正在加载...' });
			me.fire('beforeload');
			var timeout = S.later(mask.show, 500, false, mask);
			// await new Promise(r => setTimeout(r, 2000));
			this.loadFinished = false;
			this.productListContent.html('');
			this.productParams.offset = 0;

			this.query(productParams, function (json) {
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
					timeout.cancel()
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

			this.productParams.offset = this.productParams.offset + page_size;

			this.query(this.productParams, suc);
		},

		/**
		 * 查询作品并渲染
		 * @param productParams
		 * @param suc
		 * @param error
		 */
		query: function (productParams, suc, error) {

			var me = this;

			productParams = this.productParams = (productParams || this.productParams);
			Action.query("/v2/products.json", productParams, function (json) {
				suc && suc(json);
				var products = json.data;
				me.productListContent.append(listItemTpl.render({
					products: products,
					p_img_width: p_img_width,
					p_img_height: p_img_height
				}));

				if (products && products.length < page_size) {
					me.loadFinished = true;
				}
				var imgs = me.el.getDOMNode().querySelectorAll('ul.list-content > li:nth-last-child(-n +' + products.length+ ')  > a > img');
				Util.loadImages(imgs);
				 
			}, function (msg) {
				console.error('Action.list error=', msg);
				error && error(msg);
			});
		},

		appendLoadingMoreSpinner: function () {
			this.productListContent.append(loadingTip);
		},

		removeLoadingMoreSpinner: function () {
			loadingTip.remove();
		},

		/**
		 * 注册事件
		 */
		addCmpEvents: function () {
			var me = this;

			this.el.delegate('click', '.sort-nav-tab .sort-tab-item a', function (event) {
				//me.setActiveSortTab(S.one(DOM.parent(event.currentTarget, '.sort-tab-item')));
				me.setActiveSortTab(S.one(event.currentTarget).parent('.sort-tab-item'));
			});

			Event.on(win, "resize", function (event) {
				setProductImgSize();
			});

		}

	});
	return ProductList;
}, {
	requires: ["node", "event", "xtemplate",
		"APP/action/Action",
		"UFO/Component",
		"UFO/mask/Mask",
		"APP/common/Util",
		"APP/util/XTemplateUtil",
		"APP/widget/tpl/spinner-loading-small-tpl",
		"../tpl/product-list-tpl",
		"../tpl/product-list-item-tpl"
	]
});
