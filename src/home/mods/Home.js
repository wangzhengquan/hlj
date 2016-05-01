KISSY.add(function (S, Node, Event, XTemplate, Component, 
	ImageSlider, ServiceCityModal,
	HomeAction, app, MapUtil, XTemplateUtil, tpl, homeCardItemTpl) {

	function Home(config) {

		Home.superclass.constructor.call(this, config);
	}

	S.extend(Home, Component);

	UFO.augment(Home, {
		alias: 'home',

		initComponent: function () {
			var me = this;
			
			this.el = S.one(tpl);
			this.sliderContainer = this.el.one('#slider_container');
			this.cardContainer = this.el.one('#card_container');
			var cityButton = this.cityButton = UFO.create('button', {
				text: '',
				cls: 'button-clear',
				iconCls: 'ion-arrow-down icon-popup-city',
				handler: function () {
					console.log('---show---')
					me.serviceCityModal.show();
					// return false
				}
			});

			this.navBar = {
				title: '河狸家',
				barCls: 'bar-love',
				leftButtons: [cityButton],
				rightButtons: [{
					style: { 'font-size': '23px' },
					cls: 'button-clear',
					iconCls: 'icon-call',
					iconStyle: { color: '#fff' },
					handler: function () {
						location.href = "tel:4000088311";
					}
				}]
			};
			Home.superclass.initComponent.apply(this, arguments);
			this.init();
		},

		initSlider: function (city_code) {
			var me = this;
			HomeAction.getBannerConfigOfCity(city_code).then(function (data) {
				var images = [],
					item,
					param;

				for (var i = 0, len = data.length; i < len; i++) {
					item = data[i];
					param = {
						name: item.name,
						city: me.city.code
					};
					images.push({
						url: item.img_url,
						href: '../list/index.html?' + S.param(param)
					});
				}
				var slider = new ImageSlider({
					data: images,
					autoSlide: true,
					loop: true,
					lazyLoad: true,
					sliderContainer: me.sliderContainer

				});
				me.sliderContainer.html('');
				slider.render(me.sliderContainer);
			});

		},

		initCardItems: function (city_code) {
			var me = this;
			HomeAction.getHomeConfigOfCity(city_code, function (data) {
				var homeConfigOfCiy = [];
				//homeConfigOfCiy[0].background_normal = 14540253;
				console.log('data', data);
				for (var i = 1, len = data.block.length; i < len; i++) {

					if (i === 1) {
						data.block[i].rowspan = 2;
					} else {
						data.block[i].rowspan = 1;
					}
					homeConfigOfCiy.push(data.block[i]);

				}
				//console.log('homeConfigOfCiy', S.one("#card_item_template").html());

				me.cardContainer.html(new XTemplate(homeCardItemTpl, {
					commands: {
						'toHex': function (scopes, option) {
							return option.params[0].toString(16);
						},

						'underLine': function (scopes, option) {
							var description = option.params[0];
							return (description && description.length) ? 'has-line' : '';
						},

						'getHref': function (scopes, option) {
							var jump_type = option.params[0],
								name = option.params[1];

							var param = {
								name: name,
								city: me.city.code
							};

							return '../list/index.html?' + S.param(param);
						}

					}
				}).render(homeConfigOfCiy));
			});
		},

		setCity: function (_city) {
			this.city = _city;
			this.initSlider(_city.code);
			this.initCardItems(_city.code);
			this.cityButton.setText(_city.name);
			app.setPosition({
				city: _city.name,
				city_code: _city.code
			});

		},

		changeCity: function (city) {
			// console.log('city==', city);
			this.setCity(city);
		},

		init: function () {
			var me = this;
			me.setCity(app.getCityList()[0]);
			me.serviceCityModal = new ServiceCityModal({
				animation: 'slide-in-up'
			});

			me.serviceCityModal.setCurCity(me.city.code);
			me.serviceCityModal.on('cityselected', function (city) {
				me.changeCity(city);
			});
		},

		addCmpEvents: function () {
			Home.superclass.addCmpEvents.apply(this, arguments);
			/*this.el.delegate('tap', '[action=show-citys-modal]', function(event){
				if(!me.serviceCityModal){
					me.serviceCityModal = new ServiceCityModal({
						animation: 'slide-in-up'
					});
					me.serviceCityModal.setCurCity(city.code);
					me.serviceCityModal.on('cityselected', function(city){
						me.changeCity(city);
					});
					
				}
				me.serviceCityModal.show();
			});*/
		}

	});

	return Home;
}, {
	requires: [
		"node", "event", "xtemplate", 
		"UFO/Component", 
		"UFO/slider/ImageSlider", 
		"APP/widget/servicecity/ServiceCityModal",
		"APP/action/HomeAction", 
		"APP/app", 
		"APP/util/MapUtil",
		"APP/util/XTemplateUtil",
		"../tpl/home-tpl", 
		"../tpl/home-card-item-tpl"
	]
});
