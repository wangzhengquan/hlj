KISSY.add(function (S, Node, XTemplate, HomeAction,
	ImageSlider,
	homeCardItemTpl, MapUtil, XTemplateUtil, app) {

	var city;
	var sliderContainer = S.one('#slider_container'),
		cardContainer = S.one('#card_container');

	var initCardItems = function (city_code) {
		HomeAction.getHomeConfigOfCity(city_code, function (data) {

			var homeConfigOfCiy = [];
			for (var i = 1, len = data.block.length; i < len; i++) {
				var card_item = data.block[i];
				//置灰
				if (card_item.jump_type == "") {
					card_item.background_normal = 14606046;
					card_item.background_highlighted = 14606046;
				}

				if (i === 1) {
					card_item.rowspan = 2;
				} else {
					card_item.rowspan = 1;
				}
				homeConfigOfCiy.push(card_item);

			}

			cardContainer.html(new XTemplate(homeCardItemTpl, {
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
							city: city.code
						};

						return '../list/index.html?' + S.param(param);

					}

				}
			}).render(homeConfigOfCiy));
		});
	};

	var initSlider = function (city_code) {

		HomeAction.getBannerConfigOfCity(city_code).then(function (data) {
			var images = [],
				item,
				param;

			for (var i = 0, len = data.length; i < len; i++) {
				item = data[i];
				param = {
					name: item.name,
					city: city.code
				};
				images.push({
					url:  item.img_url,
					href: '../list/index.html?' + S.param(param)
				});
			}
			var slider = new ImageSlider({
				data: images,
				autoSlide: true,
				loop: true,
				lazyLoad: true,
				sliderContainer: sliderContainer

			});
			sliderContainer.html('');
			slider.render(sliderContainer);
		});

	};

	/**
	 * @param _city {
	 * 	code,
	 *  name
	 * }
	 */
	var setCity = function (_city) {
		city = _city;
		initSlider(city.code);
		initCardItems(city.code);

		S.one("#city_name").html(city.name);
		app.setPosition({
			city: city.name,
			city_code: city.code
		});

	};

	var changeCity = function (city) {
		setCity(city);
	};



	var addCmpEvents = function () {
		var me = this;
		S.one(document).delegate('tap click', '[action=show-citys-modal]:not([disabled])', function (event) {
			var target = S.one(event.currentTarget);
			target.attr('disabled', 'disabled');
			if (!me.serviceCityModal) {
				S.use("APP/widget/servicecity/ServiceCityModal", function (S, ServiceCityModal) {
					me.serviceCityModal = new ServiceCityModal({
						animation: 'slide-in-up'
					});
					me.serviceCityModal.on('hide', function () {
						target.removeAttr('disabled');
					});
					me.serviceCityModal.setCurCity(city.code);
					me.serviceCityModal.on('cityselected', function (city) {
						changeCity(city);
					});

					me.serviceCityModal.show();
				});
			} else {
				me.serviceCityModal.show();
			}

			return false;
		});

		/*S.one(document).delegate('touchstart', 'a.card-item:not([disabled])', function(event){
			var target = S.one(event.currentTarget);
			//target.addClass('enter-active');
		});
		S.one(document).delegate('touchend', 'a.card-item:not([disabled])', function(event){
			var target = S.one(event.currentTarget);
			//target.removeClass('enter-active');
		});*/
	}

	return {

		init: function () {
			MapUtil.getCurrentPosition(function (position) {
				var city = app.getCityByName(position.address.city);
				setCity(city);
			});
			addCmpEvents();
		}
	}
}, {
	requires: ['node', "xtemplate", "../../action/HomeAction",
		"UFO/slider/ImageSlider",
		"../tpl/home-card-item-tpl",
		"../../util/MapUtil", "../../util/XTemplateUtil", "../../app"]
});
