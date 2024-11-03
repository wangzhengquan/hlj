/**
 * http://www.stg.helijia.com/mobile/build/APP/gyz/view/index.html?city=110100&from_type=app
 * city
 * from_type
 * version
 * device_type
 */
KISSY.add(function (S, Node, Event, XTemplate, TabSlider, XTemplateUtil, OrderList) {
	var body = document.body,
			PARAMS = S.unparam(decodeURIComponent(location.search.slice(1)));

	function OrderListTabs(config) {

		OrderListTabs.superclass.constructor.call(this, config);
	}

	S.extend(OrderListTabs, TabSlider);

	UFO.augment(OrderListTabs, {
		alias: 'orderListTabs',

		initComponent: function () {
			this.autoSlide = false;
			this.loop = false;
			this.lazyLoad = true;

			this.items = [
				{ title: '全部', type: "orderlist", params: { type: 'total' } },
				{ title: '进行中', type: "orderlist", params: { type: 'doing' } },
				{ title: '待评价', type: "orderlist", params: { type: 'un_comment' } }
			];
			OrderListTabs.superclass.initComponent.apply(this, arguments);
		},

		load: function (slide, realIndex, item) {
			//console.log('item', item);
			slide.append(UFO.createItem(item).getEl());
			this.lazyLoadArr[realIndex].loaded = true;
		},

		addCmpEvents: function () {
			OrderListTabs.superclass.addCmpEvents.apply(this, arguments);
		}

	});

	return OrderListTabs;
}, {
	requires: ["node", "event", "xtemplate",
		"UFO/slider/TabSlider",
		"../../util/XTemplateUtil",
		"./OrderList"
	]
});
