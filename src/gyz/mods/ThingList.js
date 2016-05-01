KISSY.add(function(S, Node,Event, XTemplate, Component, MessageBox, app,
		Action, tpl, data){
	
	var win = window;
	var img_width =0,
		img_height =0;

	/**
	 * 计算图片大小
	 * @returns {Number}
	 */
	var calcImgSize= function(){
		var width= (win.innerWidth - 7*2 - 3*4)/2;
		img_width = width,
		img_height = img_width*105/147;
		return {
			width: img_width,
			height: img_width
		};
	};
	
	 
	function ThingList(config){
		ThingList.superclass.constructor.call(this, config);
	}
	
	S.extend(ThingList, Component);
	
	UFO.augment(ThingList, {
		alias: 'thingList',
		
		/**
		 * 设置图片大小
		 */
		setImgSize: function(){
			calcImgSize();
			this.el.all(".thing-list .card-item img").css({
				width: img_width,
				height: img_height
			});
		},
		
		initComponent: function(){
			var me = this;
			this.el = S.all(new XTemplate(tpl, {
				commands:{
	                'getTingHref': function (scopes, option) {
	                	var label_code = option.params[0],
	                		category_code = option.params[1];
	                	var params = {
                			filter_category: category_code,
                			filter_label: label_code,
                			city: me.city_code
	                	};
	                	//return "http://app.helijia.com/zmw/v2/search?type=products&filter_category=tag_mei_shu&filter_label=228,229,232&city=110100";
	                	return  app.config.baseUrl+'/v2/search?type=products&filter_category='+category_code+'&filter_label='+label_code+'&city='+me.city_code;
	                }
				}
				
			}).render(data.thingsData));
			this.setImgSize();
			ThingList.superclass.initComponent.apply(this, arguments);
		},
		 
		addCmpEvents: function(){
			var me = this;
			this.el.delegate('click', '.thing-list a.card-inner', function(event){
				var target = S.one(event.currentTarget),
					label_code = target.attr('data-label_code'),
					category_code = target.attr('data-category_code');
			
				var search = '?type=products&filter_category='+category_code+'&filter_label='+label_code+'&city='+me.city_code;
				if(app.isApp()){
					location.href =  app.config.baseUrl+"/v2/search"+search; 
				}else{
					location.href = "../products/products_of_active.html"+search;
				}
				return false;
			});
			
			Event.on(win, "resize", function(event){
				me.setImgSize();
			});
		}
	 
	});
	
	return ThingList;
}, {
	requires: ['node','event', "xtemplate",  "UFO/Component", "UFO/popup/MessageBox", 
	           "../../app",
	           "../../action/Action",
	           "../tpl/things-tpl", "./data"
	           ]
});
