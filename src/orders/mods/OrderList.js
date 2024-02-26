KISSY.add(function (S, Node, Event, XTemplate, Component,
	MessageBox, Action, XTemplateUtil,
	tpl, item_tpl, ORDER_STATUS,
	spinner_loading_small_tpl) {

	var win = window;
	var loadingMoreMask = S.one(spinner_loading_small_tpl),
		page_size = 10;

	var itemTpl = new XTemplate(item_tpl, {
		commands: {
			'getOrderStatusName': function (scopes, option) {
				return ORDER_STATUS.status_map[option.params[0]].name;
			}
		}
	});

	function OrderList(config) {
		OrderList.superclass.constructor.call(this, config);
	}

	S.extend(OrderList, Component);

	UFO.augment(OrderList, {
		alias: 'orderlist',

		initComponent: function () {
			this.el = S.one(tpl);
			this.orderlistEl = this.el.one('.order-list');
			this.scrollViewDom = this.el.getDOMNode();
			OrderList.superclass.initComponent.apply(this, arguments);
			this.load();
		},

		appendLoadingMoreSpinner: function () {
			this.orderlistEl.append(loadingMoreMask);
		},

		removeLoadingMoreSpinner: function () {
			loadingMoreMask.remove();
		},

		load: function (params, suc) {
			var me = this;
			//var params = params || {};
			params = S.mix(this.params, {
				offset: 0,
				page_size: page_size
			});


			this.params = params;
			me.orderlistEl.html("");
			this.query(params, function (loadFinished) {

				if (!loadFinished) {
					me.addScrollListener();
				}
				suc && suc(loadFinished);
			});
		},

		loadMore: function (suc) {
			console.log('loadmore-----');
			var me = this;
			var params = this.params;
			params.offset = params.offset + params.page_size;
			this.query(params, function (loadFinished) {
				suc && suc(loadFinished);
			});
		},

		query: function (params, suc, error) {
			var me = this;

			me.appendLoadingMoreSpinner();

			me.scrollViewDom.scrollTop = me.scrollViewDom.scrollTop + 28;

			params = this.params = (params || this.params);
			// http://apppub.helijia.com/zmw /v2/beautiful_recommend 
			Action.query('/v2/orders.json', params, function (json) {
				console.log("orders", json);
				me.removeLoadingMoreSpinner();
				if (json.ret) {
					json.ORDER_STATUS = ORDER_STATUS;
					//json.data.status = String(parseInt(json.data.status));
					me.orderlistEl.append(itemTpl.render(json));
					suc && suc(json.data.length < params.page_size);
				} else {
					// location.href = "../login/index.html";
					// alert(json.msg || JSON.stringify(json));
					//me.fire('needlogin');
				}

			}, function (msg) {
				me.removeLoadingMoreSpinner();
				error && error();
				console.log('msg', msg);
			});
		},

		addCmpEvents: function () {
			var me = this;

			var scrollHandler = function (e) {
				if ((me.scrollViewDom.scrollTop + me.scrollViewDom.clientHeight + win.innerHeight >= me.scrollViewDom.scrollHeight)) {
					me.removeScrollListener();
					me.loadMore(function (loadFinished) {
						if (!loadFinished) {
							me.addScrollListener();
						}
					});
				}
			};

			this.addScrollListener = function () {
				Event.on(me.scrollViewDom, 'scroll', scrollHandler);
			};

			this.removeScrollListener = function () {
				Event.detach(me.scrollViewDom, 'scroll', scrollHandler);
			};

			/**
			 * 确认完成
			 */
			this.el.delegate('click', '[action=sureCompleted]', function (event) {
				var target = S.one(event.currentTarget),
					item = target.parent('.order-item'),
					order_id = item.attr('data-order_id'),
					order_seq = item.attr('data-order_seq');

				Action.update('/user/edit_order', {
					//order_id: order_id,
					order_number: order_seq,
					status: '90'
				}, function (json) {
					if (json.result == 'fail') {
						alert(JSON.stringify(json));
					} else {
						me.load();
					}


				});
			});

			/**
			 * 删除订单
			 */
			this.el.delegate('click', 'button[action=delete]', function (event) {
				var target = S.one(event.currentTarget);
				MessageBox.confirm('确认删除订单？', '删除之后将无法恢复。', {
					ok: "确定删除",
					cancel: "取消"
				}).done(function (confirm) {
					if (confirm === MessageBox.OK) {
						var item = target.parent('.order-item'),
							order_id = item.attr('data-order_id');
						Action.update('/v2/delete_order', {
							order_id: order_id
						}, function (json) {
							console.log(json);
							if (json.ret) {
								item.remove();
							} else {
								alert('删除失败');
							}

							//me.load();
						});
					}
				});
			});

			//再次预约againOrder
			this.el.delegate('click', 'button[action=againOrder]', function (event) {
				location.href = "../product/index.html?product_id=" + product_id;
			});
		}

	});

	return OrderList;
}, {
	requires: ['node', 'event',
		"xtemplate",
		"UFO/Component",
		"UFO/popup/MessageBox",
		"../../action/Action",
		'../../util/XTemplateUtil',
		"../tpl/order-list-tpl",
		"../tpl/order-list-item-tpl",
		"../../order/mods/ORDER_STATUS",
		"../../tpl/spinner-loading-small-tpl"

	]
});
