KISSY.add(function (S, Node, XTemplate,
	Component,
	FormUtil,
	DateUtil,
	Mask,
	MessageBox,
	Action,
	XTemplateUtil,
	app,
	tpl,
	content_tpl) {
	var param = app.getParam(),
		access_code = param.code;

	/*if(app.isMicroMessenger() && !access_code){
		var fromurl=location.href;  
			var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8a8aaf1f2dc2616d&redirect_uri='+encodeURIComponent(fromurl)+'&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';  
			location.href=url;
	}*/

	var user = app.getSessionUser(),
		mask = new Mask();
 

	var conentTpl = new XTemplate(content_tpl, {});

	function OrderConfirm(config) {

		OrderConfirm.superclass.constructor.call(this, config);

	}

	S.extend(OrderConfirm, Component);

	S.augment(OrderConfirm, {

		initComponent: function () {

			this.el = S.one(tpl);
			console.log('user', user);

			OrderConfirm.superclass.initComponent.apply(this, arguments);
			this.init();
		},
		getBodyContainer: function () {
			return this.el.one('.content');
		},

		init: function () {
			var me = this;
			//我的余额
			var initBalance = function () {
				var balanceEl = me.el.one('[name=balance]');
				if (balanceEl) {
					balanceEl.html('988.0');
				}
			};
			//优惠券
			var initCoupon = function () {
				var coupon = {
					coupon_name: '慢100减50',
					coupon_price: 50
				}
				// me.data_coupons = json;
				me.setCoupon(coupon);
			};

			var pay_way_list = [
				{
					value: "balance",
					title:"我的钱包",
					remark: "",
					logoCls: "mywallet-logo"
				}, {
			  
					value: "",
					title: "百度钱包",
					remark: "",
					logoCls: "baidupay-logo"
				},  {
			 
					value: "",
					title: "银联",
					remark: "",
					logoCls: "unionpay-logo"
				}, 
				{
					value: "alipay_wap",
					title:"支付宝",
					remark: "",
					logoCls: "alipay-logo"
				}, {
					value: "wechat_h5",
					title:"微信",
					remark: "",
					logoCls: "wechatpay-logo"
				}
			];

			me.order = user.order;
			me.getBodyContainer().html(conentTpl.render({
				order: user.order,
				pay_way_list: pay_way_list
			}));
			initBalance();
			initCoupon();

			//S.one("#weixin_iframe").attr("src", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8a8aaf1f2dc2616d&redirect_uri=http://test.weixin.365pp.com/hlj_wx/hlj/getAccess_Token4H5&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect");
		},

		/**
		 * 订单价格
		 */
		setOrderPrice: function () {
			var me = this;
			me.el.one('[name=product_price]').html("￥200.0");
			me.el.one('[name=real_pay]').html("￥300.0");
		},

		/**
		 * 优惠券
		 * @param coupon
		 */
		setCoupon: function (coupon) {
			this.coupon_used = coupon;
			if (coupon && !S.isEmptyObject(coupon)) {
				this.el.one('.coupon-name').html(coupon.coupon_name);
				this.el.one('.coupon-price').html("￥" + coupon.coupon_price);
			} else {
				this.el.one('.coupon-name').html('不使用优惠券');
				this.el.one('.coupon-price').html('');
			}

			this.setOrderPrice();

		},

		/**
		 * 支付
		 * @param order_no
		 * @returns
		 */
		goPay2: function (pay_way, suc, error) {
			var me = this;
			var order_no = me.order.order_no,
				stage = 1,
				price = me.order.should_pay_price;

			if (me.order.extra_fee_price) {
				stage = 2;
				price = me.order.extra_fee_price;
			}
			console.log('=== goPay===')
			if (pay_way == 'balance') {
				//我的钱包支付
				Action.update('/v2/balance_pay', {
					order_type: 1,
					order_number: order_no,
					device_type: 'wap',
					stage: stage
				}, function (json) {
					console.log("balance_pay", json);
					if (json.ret) {
						location.href = app.config.baseUrl + '/red/share.html?order_seq=' + order_no + '&user_id=' + user.user_id;
						suc && suc();
					} else {
						error && error();
						alert(json.msg || JSON.stringify(json));
					}
				});
			} else {
				var return_url = app.config.baseUrl + '/red/share.html?order_seq=' + order_no + '&user_id=' + user.user_id;

				var initServiceParam = {
					order_number: order_no,
					order_type: "1",
					return_url: return_url,
					pay_type: pay_way,
					req_time: DateUtil.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
					stage: stage,
					mobile: user.mobile
				};

				if (param.openid) {
					initServiceParam.openid = param.openid;
				}
				alert("before initService" + JSON.stringify(initServiceParam));

				Action.query("/v2/initService", initServiceParam, function (json) {
					alert("after initService:" + JSON.stringify(json));
					console.log("initService", json);
					if (json.result == "ok") {
						if (pay_way == 'wechat_h5') {
							weichat_pay(json.params, function () {
								alert("支付成功");
								//location.href = return_url;
							});
						} else if (pay_way == "alipay_wap") {
							location.href = json.params.url;
						}
						suc && suc();
					} else {
						error && error();
					}


				});
			}
		},

		goPay: function (pay_way, suc, error) {
			location.href = '../red/redShare.html?order_seq=2347872384&user_id=234737483773';
		},

		/**
		 * 提交订单
		 */
		submitOrder: function (pay_way, suc, error) {
			var me = this;
			var data = {
				latitude: user.order.service_addr.latitude || 40036145823744,
				longitude: user.order.service_addr.longitude || 116455043497984,
				city: user.order.service_addr.city.code,
				address: user.order.address,
				service_address_type: user.order.service_addr.service_address_type || 'home',
				reserve_time: user.order.service_time,
				name: user.nick || user.mobile,
				mobile: user.mobile,
				product_id: user.order.product_id,
				service_type: user.order.service_type || 'artisan_visit',
				is_reserve: true,
				device_type: 'wap'
			};
			console.log("submitOrder data", data);
			if (user.order.service_addr.address_id) {
				data.service_address_id = user.order.service_addr.address_id;
			}
			//console.log('checked', me.el.one('[name=insurance_handle]').attr('checked'));
			if (me.el.one('[name=insurance_handle]').attr('checked')) {
				S.mix(data, FormUtil.getRecord(me.el.one('[name=form_insurance]')));
			}
			me.order.order_no = 2348374;
			app.setSessionUser(user);
			me.goPay(pay_way, suc, error);
			//console.log("pay_way", pay_way);
			// Action.post('/v2/submit_order', data, function(json){
			// 	console.log('submit_order', json);
			// 	if(json && json.ret){
			// 		me.order.order_no = json.data;
			// 		app.setSessionUser(user);
			// 		me.goPay(pay_way, suc, error);
			// 	}else{
			// 		error && error();
			// 		alert(json.msg || JSON.stringify(json));
			// 		return false;
			// 	}
			// });
		},

		addCmpEvents: function () {
			OrderConfirm.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
			/**
			 * 优惠券显示modal
			 */
			this.el.delegate('click tap', '[action=showCouponModal]:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				if (!me.couponModal) {
					S.use('app/coupon/mods/CouponModal,  css/coupon.css', function (S, CouponModal, coupon_css) {
						me.couponModal = new CouponModal();
						me.couponModal.on('select', function (coupon) {
							me.setCoupon(coupon);
						});
						me.couponModal.on('hide', function (event) {
							target.removeAttr('disabled');
						});
						me.couponModal.show();
					});

				} else {
					me.couponModal.show();
				}
				return false;
			});


			var initInsuranceForm = function () {
				/*是否参保*/
				var formInsurance = me.el.one('.form-insurance');
				if (!formInsurance) {
					return;
				}
				var formInsurance_orig_height = formInsurance.innerHeight();

				console.log('formInsurance_orig_height', formInsurance_orig_height);
				formInsurance.css({
					height: 0,
					display: 'none'

				});
				/*保险*/
				me.el.delegate('change', '[name=insurance_handle]', function (event) {
					var target = event.currentTarget;
					if (target.checked) {
						formInsurance.css({
							display: 'block',
							padding: '15px',
							height: 0
						});
						//加动画的写在setTimeout里面
						setTimeout(function () {
							formInsurance.css({
								height: formInsurance_orig_height + "px"
							});
						}, 0);


					} else {
						formInsurance.css({
							height: 0,
							padding: '0 15px'
						});
						//加动画的写在setTimeout里面
						setTimeout(function () {
							formInsurance.css({
								display: 'none'
							});
						}, 300);
					}
				});
			};

			/*去支付*/
			this.el.delegate('tap', '[action=submit-order]', function (event) {
				var target = S.one(event.currentTarget);
				var checkedPaywayEl = me.el.one('input[name=pay_way]:checked'),
					pay_way;
				if (checkedPaywayEl) {
					pay_way = checkedPaywayEl.attr('value');
				} else {
					alert('请选择支付方式!');
					return;
				}

				target.attr("disabled", "disabled");
				mask.show();

				var cbfn = function () {
					target.removeAttr("disabled");
					mask.hide();
				};

				if (!me.order.order_no) {
					me.submitOrder(pay_way, cbfn, cbfn);
				} else {
					me.goPay(pay_way, cbfn, cbfn);
				}
				return false;

			});

			this.on('afterrender', function () {
				initInsuranceForm();
			});


		}

	});

	return OrderConfirm;
}, {
	requires: [
		'node',
		"xtemplate",
		"UFO/Component",
		"UFO/util/Form",
		"UFO/core/lang/Date",
		"UFO/mask/LoadingMask",
		"UFO/popup/MessageBox",
		"../../action/Action",
		"../../util/XTemplateUtil",
		"../../app",
		"../tpl/order-confirm-tpl",
		"../tpl/order-confirm-content-tpl"
	]
});
