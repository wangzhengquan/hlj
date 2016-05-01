/**
 * 城市选择组件
 */
KISSY.add(function (S, Node, DOM, XTemplate, Modal, app, serviceCityModalTpl) {

	function ServiceCityModal(config) {
		ServiceCityModal.superclass.constructor.call(this, config);
	}

	S.extend(ServiceCityModal, Modal);

	S.augment(ServiceCityModal, {

		initComponent: function () {
			this.cityList = app.getCityList();
			ServiceCityModal.superclass.initComponent.apply(this, arguments);

		},

		setCurCity: function (city) {
			var me = this,
				cityItem,
				code = city;
			if (S.isObject(city)) {
				code = city.code;
			}
			for (var i = 0, len = this.cityList.length; i < len; i++) {
				cityItem = this.cityList[i];
				if (cityItem.code == code) {
					this.curIndex = i;
					this.city = cityItem;
					this.el.one('[name=service-city-list] .item-radio:nth-child(' + (this.curIndex + 1) + ') input[type=radio]').attr('checked', true);
					me.el.one('[name=cur-city]').html(this.city.name);
					return;
				}
			}
		},

		createModal: function () {
			return new XTemplate(serviceCityModalTpl).render(this.cityList);
		},

		addCmpEvents: function () {
			var me = this;
			this.el.delegate('tap click', '[action=close]:not([disabled])', function (e) {
				me.hide();
				return false;
			});

			this.el.delegate('change', '[name=service-city-list] .item-radio input[type=radio]', function (e) {
				var itemRadio = S.one(e.currentTarget).parent('.item-radio'),
					index = me.el.all('[name=service-city-list] .item-radio').index(itemRadio);

				console.log('===cityselected====', index)
				me.city = me.cityList[index];
				me.fire('cityselected', me.city);
				me.hide();
				return false;
			});
		},

		setCity: function (city) {
			this.city = city;
		}

	});

	return ServiceCityModal;
}, {
	requires: ['node', 'dom', 'xtemplate', 'UFO/modal/Modal',
		"APP/app",
		'./tpl/service-city-modal-tpl'
	]
});