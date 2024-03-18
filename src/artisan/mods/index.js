/*
		 http://www.helijia.com/mobile/build/APP/artisan/index.html?
	artisan=5cafd5966eb74a5e8b5352e5ec6a46b3&from_type=app&device_type=ios&version=0.0.1&sign=5143382d30892c5828f5dfb0b83c5efc&channel=artisan&user_id=123
	参数说明：
	 **
	 * user_id (用户唯一标示)
	 * from_type(app , html5)
	 * device_type(android , ios)
	 * channel(artisan 代表商家端app进入 ,helijia 代表顾客端app进入)
	 * sign(验证发布权限的证书)
	 * token 验证登录状态
	 */
KISSY.add(function (S, Node, Event, XTemplate, DataLazyload, Container,
	PhotoBrowserModal, MessageBox, LoadingMask,
	Action,
	StarIntroModal,
	XTemplateUtil,
	ParamUtil,
	app,
	artisan_tpl,
	screen1_tpl,
	artisan_screen2_tpl,
	product_list_tpl,
	artisanintro_tpl) {
	var win = window;
	var mask = new LoadingMask();

	var params = app.getParam(),
		preview = params.preview,
		artisanId = params.artisan || params.artisan_id,
		from_type = params.from_type || "",
		device_type = params.device_type || "",
		channel = params.channel || 'helijia',
		isApp = app.isApp(),
		isCustomerApp = (channel == 'helijia' && app.isApp());

	params.artisan_id = artisanId;

	var artisan_thumbnail_width = 0,
		artisan_thumbnail_height = 0;
	/*
	 * 计算手艺人头像缩略图的大小
	 */
	var calcArtisanPhotoSize = function () {
		var width = (document.documentElement.offsetWidth - 15 - 3 * 5) / 3;
		artisan_thumbnail_width = width;
		artisan_thumbnail_height = width;
	};
	/*
	 * 设置手艺人头像缩略图的大小
	 */
	var setArtisanPhotoSize = function () {
		calcArtisanPhotoSize();
		S.all(".item-photo li a").css({
			width: artisan_thumbnail_width,
			height: artisan_thumbnail_height
		});
	};

	XTemplate.addCommand('isCustomerApp', function (scopes, option) {
		return isCustomerApp ? option.fn(scopes) : '';
	});

	var tpl = new XTemplate(artisan_tpl, {
		commands: {
			'getAppClass': function (scopes, option) {
				return from_type ? from_type : "";
			},
			'getTitle': function (scopes, option) {
				return (preview ? '预览' : '');
			},
			'getAction': function (scopes, option) {
				return (preview ? 'edit' : 'back');
			}
		}
	}).render({});


	var screen2tpl = new XTemplate(artisan_screen2_tpl, {
		commands: {
			'getSeeAllProductHref': function (scopes, option) {
				var _param = {
					artisan_id: artisanId
				}
				if (params.city) {
					_param.city = params.city;
				}
				if (isCustomerApp) {
					//http://www.helijia.com/#/artisanProduct/artisan_id=
					return 'http://www.helijia.com/#/artisanProduct/artisan_id=' + artisanId;
				} else {
					return "../products/products_of_artisan.html?" + S.param(_param);
				}
			}
		}
	});

	var productListTpl = new XTemplate(product_list_tpl, {
		commands: {
			'getProductHref': function (scopes, option) {
				var product_id = option.params[0];
				if (isCustomerApp) {
					return 'http://www.helijia.com/#/product/' + product_id;
				} else {
					var href = params.productHref || '../product/index.html',
						_param = {
							product_id: product_id,
						};
					params.channel && (_param.channel = params.channel);
					params.from_type && (_param.channel = params.from_type);
					return href + '?' + S.param(_param);
				}
			}

		}
	});


	var artisanIntroTpl = new XTemplate(artisanintro_tpl, {
		commands: {
			'getAdvancedAuthTitle': function (scopes, option, isq) {
				var artisan_type = option.params[0],
					isq = option.params[1];

				if (artisan_type === 1) {
					return '高级职业美甲师认证';
				} else if (artisan_type === 2) {
					return '高级职业造型师认证';
				} if (artisan_type === 3) {
					return '高级职业美容师认证';
				}
			}
		}
	});


	//38c40bfaaddf4829a2ddfdd3416134cf
	var datalazyload = new DataLazyload();
	function Artisan() {
		Artisan.superclass.constructor.apply(this, arguments);
	}

	KISSY.extend(Artisan, Container);
	KISSY.augment(Artisan, {

		initComponent: function () {
			var me = this;
			this.el = S.one(tpl);

			this.header = this.el.one('.header');
			this.content = this.el.one('.content');
			this.rightButtons = this.el.one('.buttons-right');

			if (isCustomerApp) {
				//message button
				me.header.hide();
				me.content.removeClass('has-header');
				me.rightButtons.append('<a href="http://www.helijia.com/v2/#/artisanSendMessage" class="button button-clear icon iconfont" action="message" style="font-size: 25px;">&#xe619;</a>');
			} else if (isApp && device_type != "android") {
				S.one(document.body).addClass('app');
			}
			

			Artisan.superclass.initComponent.apply(this, arguments);
			this.init();
		},

		init: function () {
			var me = this;
			mask.show();
			// 触发一次
			me.one("artisan_products_loaded", function(){
				mask.hide()
			})
			Action.query('/v2/artisan_detail.json', params, function (json) {

				var artisanData = me.artisanData = json.data;
				S.one('title').text(json.data.name);

				if (preview) {
					artisanData.decor = me.shopData = localStorage.getItem(artisanId + "shopdata");
				}
				if (artisanData.decor) {
					artisanData.decor = JSON.parse(artisanData.decor);
				}

				me.content.append(new XTemplate(screen1_tpl, {
					commands: {
						'isApp': function () { return isApp },
						'getServiceRange': function (scopes, option) {
							return option.params[0].join(',');
						},

						'calWidth': function (scopes, option) {
							return Math.round(option.params[0] * .5) * 20;
						},
						'notEmpty': function (scopes, option) {
							return S.isEmptyObject(option.params[0]) ? '' : option.fn(scopes);
						},

						'getCommentHref': function (scopes, option) {
							var artisan_id = option.params[0];
							if (params.from_type == 'app') {
								return 'http://www.helijia.com/#/artisanComment/artisan_id=' + artisan_id;
							} else {
								var param = {
									artisan_id: artisan_id,
									total: artisanData.reviews,
									excited: artisanData.excited,
									good: artisanData.good,
									normal: artisanData.normal,
									bad: artisanData.bad
								};
								return '../comment/index.html?' + S.param(param);
							}
						},

						'getProductLink': function (scopes, option) {
							var link = option.params[0];
							//S.unparam(decodeURIComponent(location.search.slice(1))),
							if (link) {
								var product_id = link;
								if (link.indexOf('?') != -1) {
									var params = S.unparam(link.substr(link.indexOf('?') + 1));
									product_id = params.product_id;
								}
								if (isCustomerApp) {
									return 'http://www.helijia.com/#/product/' + product_id;
								} else {
									var productParam = {
										'product_id': product_id,
										'from_type': params['from_type'],
										channel: params.channel
									};
									return '../product/index.html?' + S.param(productParam);
								}

							} else {
								return 'javascript:;';
							}
						}


					}
				}).render(artisanData));

				var screen2 = me.screen2 = S.one(screen2tpl.render({}));
				me.content.append(screen2);
				me.productListTabContent = me.screen2.one('[name=product_list_tab_content]');
				me.introTabContent = me.screen2.one('[name=intro_tab_content]');
				//me.setActiveTab(0);
				datalazyload.addCallback(screen2.getDOMNode(), function () {
					me.setActiveTab(0);
				});
				//'	<button class="button button-clear button-right" action="'+(preview ? 'publish': 'edit')+'">'+(preview ? '发布': '编辑')+'</button>',
				if (preview) {
					me.setTitle('预览');
				} else {
					me.setTitle(artisanData.name);
				}
				if (channel == 'artisan' && params.sign) {
					if (preview) {
						me.rightButtons.append('<button class="button button-clear " action="publish">发布</button>');
					} else {
						me.rightButtons.append('<button class="button button-clear " action="edit">编辑</button>');

					}
				}

				me.initExpandableElem(me.content.one('.item-district .detail'), 36);
			}, function (msg) {
				console.error(msg);
			}, params.need_refresh);

			delete params.need_refresh;
			delete params.preview;
		},


		setActiveTab: function (tabItem) {
			var me = this,
				index = 0,
				tabItems = me.screen2.all('.x-tab-nav  .x-tab-item'),
				tabContents = me.screen2.all('.x-tab-content');

			if (S.isNumber(tabItem)) {
				index = tabItem;
				tabItem = me.screen2.one('.x-tab-nav  .x-tab-item:nth-child(' + (index + 1) + ')');
			} else {
				index = tabItem.attr('data-index');
			}

			index = parseInt(index);
			if (!tabItem.hasClass('active')) {

				tabItems.removeClass('active');
				tabItem.addClass('active');
				tabContents.hide();
				S.one(tabContents[index]).show();

				if (!tabItem.data('inited')) {
					tabItem.data('inited', true);
					if (index == 0) {
						this.createProductListContent();
					} else {
						this.createArtisanIntroContent();
					}
				}
			}

			
		},

		createProductListContent: function () {
			this.loadProductList();
		},
		/**
		 * 个人介绍
		 */
		createArtisanIntroContent: function () {
			this.introTabContent.html(artisanIntroTpl.render(this.artisanData));
			setArtisanPhotoSize();
			this.initExpandableElem(this.introTabContent.one('.item-intro'), 44);
		},

		loadProductList: function () {
			this.productListTabContent.html('');
			this.queryProducts(artisanId);
		},

		queryProducts: function (artisanId, suc, error) {
			var me = this;
			Action.query("/v2/get_artisan_products_six.json", params, function (json) {
				var products = json.data;
				me.productListTabContent.append(productListTpl.render(products));
				new DataLazyload({
						container: me.screen2.one('.list-product'),
						autoDestroy: false,
						placeholder: "../resources/images/default_product.png"
				});
				suc && suc();
				S.buffer(function(){
					me.fire('artisan_products_loaded');
				}, 200)()
			}, function (msg) {
				console.error('list error=', msg);
				error && error(msg);
			});
		},
		setTitle: function (title) {
			this.header.one('.title').html(title);
		},

		getBodyContainer: function () {
			return this.content;
		},

		initExpandableElem: function (expandElem, minHeight) {
			var p = expandElem.one('p'),
				origHeight = p.height();
			if (p.height() > minHeight) {
				expandElem.addClass('collapseable collapse');
				p.height(minHeight);
				expandElem.delegate('click tap', 'a.switch:not([disabled])', function (e) {
					var target = S.one(e.currentTarget);
					target.attr('disabled', 'disabled');
					if (expandElem.hasClass('collapse')) {
						expandElem.removeClass('collapse');
						expandElem.addClass('expand');
						p.css('height', origHeight);
						//p.css('height', 'auto');

					} else if (expandElem.hasClass('expand')) {
						expandElem.removeClass('expand');
						expandElem.addClass('collapse');
						//p.css('height', origHeight);
						p.height(minHeight);
					}
					setTimeout(function () {
						target.removeAttr('disabled');
					}, 300);

					return false;
				});
			}
		},

		/**
		 * 注册事件
		 */
		addCmpEvents: function () {
			var me = this;
			/**
			 * 点击回退按钮
			 */
			me.el.delegate('tap', 'button[action=back]', function (event) {
				me.fire('clickbackbutton');
				var target = S.one(event.currentTarget),
					action = target.attr('action');

				if (from_type == 'app') {
					location.href = '/#/shopFitmentBack';
				} else {
					history.go(-1);
				}

			});
			/**
			 * 点击两个选项卡
			 */
			me.el.delegate('tap click', '.x-tab-nav .x-tab-item a:not([disabled])', function (event) {
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				me.setActiveTab(target.parent());
				target.removeAttr('disabled');
				return false;
			});
			/**
			 * 点击编辑
			 */
			me.el.delegate('click', 'button[action=edit]', function (event) {
				//delete params.preview;
				location.href = './shopDecorate.html?' + S.param(params);
				return false;
			});
			/**
			 * 点击发布
			 */
			me.el.delegate('click', 'button[action=publish]', function (event) {
				Action.update("/v2/update_artisan_decor", {
					sign: params.sign,
					artisan_id: artisanId,
					content: me.shopData
				}, function (json) {
					if (json.ret) {
						//delete params.preview;
						var _params = S.merge({}, params);
						_params.need_refresh = 1;
						location.href = '?' + S.param(_params);
						localStorage.removeItem(artisanId + "shopdata");
					} else {
						alert(JSON.stringify(json));
					}

				}, function (msg) {
					console.error(msg);
					alert('网络错误');

				});

				return false;

			});
			/**
			 * 点击收藏手艺人
			 */
			me.el.delegate('click', 'a[action=collect]', function (event) {
				var target = S.one(event.currentTarget),
					isCollected = target.hasClass('collected');

					if (isCollected) {
						target.removeClass('collected');
						target.one('span').text('收藏手艺人');
					} else {
						target.addClass('collected');
						target.one('span').text('已收藏');
					}

			});
			/**
			 * 点击星级
			 */
			me.el.delegate('click', 'a.star-info', function (event) {
				if (isCustomerApp) {
					location.href = './star-intro.html';
				} else {
					if (!me.starIntroModal) {
						me.starIntroModal = new StarIntroModal();
					}
					me.starIntroModal.show();
				}
			});

			/**
			 * 点击手艺人头像
			 */
			me.el.delegate('click', '.item-header a.item-image', function (event) {
				var url = app.config.imgBaseUrl + S.one(event.currentTarget).attr('data-url');
				if (!me.headerImgModal) {
					me.headerImgModal = new PhotoBrowserModal({
						animation: 'scale-in',
						data: [{ url: url }],
						autoSlide: false,
						loop: false
					});
				}

				me.headerImgModal.show();
			});
			/**
			 * 点击手艺人缩略图
			 */
			me.el.delegate('click', '.item-photo a', function (event) {
				//console.log('click', event.currentTarget);
				var index = me.el.all('.item-photo a').index(event.currentTarget);
				var images = '',
					data = [];
				if (typeof me.artisanData.large_photos == 'undefined') {
					images = me.artisanData.photos;
				} else {
					images = me.artisanData.large_photos;
				}

				for (var i = 0, len = images.length; i < len; i++) {
					data.push({
						url: app.config.imgBaseUrl + images[i]
					});
				}

				if (!me.PhotoBrowserModal) {
					me.PhotoBrowserModal = new PhotoBrowserModal({
						animation: 'scale-in',
						data: data,
						defaultIndex: index,
						autoSlide: false,
						loop: false
					});
				}

				me.PhotoBrowserModal.setDefaultIndex(index);
				me.PhotoBrowserModal.show();

			});

			Event.on(win, "resize", function (event) {
				setArtisanPhotoSize();
			});

		}

	});

	return Artisan;
}, {
	requires: ["node", "event", "xtemplate",
		"MUI/datalazyload/index",
		"UFO/container/Container",
		'UFO/modal/PhotoBrowserModal',
		'UFO/popup/MessageBox',
		"UFO/mask/LoadingMask",
		"APP/action/Action",
		'./StarIntroModal',
		"APP/util/XTemplateUtil",
		"APP/util/ParamUtil",
		"APP/app",
		"../tpl/artisan-tpl",
		"../tpl/artisan-screen1-tpl",
		"../tpl/artisan-screen2-tpl",
		"../tpl/artisan-product-list-tpl",
		"../tpl/artisan-artisanintro-tpl"
	]
});
