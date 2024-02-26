KISSY.add(function(S, Node,Event, XTemplate, Component,MessageBox,app, Action, tpl, data){
	function PersonList(config){
		 
		PersonList.superclass.constructor.call(this, config);
		
	}
	
	S.extend(PersonList, Component);
	
	UFO.augment(PersonList, {
		alias: 'personList',
		
		initComponent: function(){
			var me = this;
			this.el = S.all(new XTemplate(tpl, {
				commands:{
	                'getPersonHref': function (scopes, option) {
	                	var label_code = option.params[0],
	                		type_code = option.params[1],
	                		params = {
	                			city: me.city_code,
	                			filter_type: type_code
	                		};
	                	if(label_code){
	                		params.filter_product_tag = label_code;
	                	}
	                	
	                	var url = app.config.baseUrl+"/v2/search?type=artisans&city="+me.city_code+"&filter_type="+type_code;
	                	if(label_code){
	                		url = url + "&filter_product_tag="+label_code;
	                	}
	                	return url;
	                }
				}
				
			}).render(data.personData));
			PersonList.superclass.initComponent.apply(this, arguments);
		},
		
		doSearchArtisan: function(keyword){
			if(keyword==""){
				return;
			}
			var me = this,
				queryParams ={
					keyword : keyword,
					filter_type: "6,7,8,9",
					city: me.city_code
				};
		 
			var urlParams = {
				queryParams: encodeURIComponent(JSON.stringify( queryParams))
			};
			
			if(me.position){
				urlParams.position =  encodeURIComponent(JSON.stringify({
					address: me.position.address,
					addrDetail: me.position.addrDetail,
					city:  me.position.city,
					point: me.position.point
				}));
			}
			
			var url = "../../customer/view/artisan_products_of_search.html?".concat(S.param(urlParams));
			if(location.search){
				url = url.concat("&"+location.search.slice(1));
			}
			location.href = url;
		},
		
		addCmpEvents: function(){
			var me = this;
			//搜素
			/*this.el.one('form.form-search').on('submit', function(event){
				var text = S.one(event.currentTarget).one('input[type=search]').getDOMNode(),
					 value = S.trim(text.value);
				text.blur();
				me.doSearchArtisan(value); 
			});*/
			
			
			this.el.delegate('click', '.artisan-list a.item', function(event){
				var target = S.one(event.currentTarget),
					label_code = target.attr('data-label_code'),
					type_code = target.attr('data-type_code');
				
				var search = "?type=artisans&city="+me.city_code+"&filter_type="+type_code;
				if(label_code){
					search = search + "&filter_product_tag="+label_code;
            	}
				if(app.isApp()){
					location.href =  app.config.baseUrl+"/v2/search"+search; 
				}else{
					location.href = "../list/ArtisanList4Active.html"+search;
				}
				return false;
			});
		}
	 
	});
	
	return PersonList;
}, {
	requires: ['node','event', "xtemplate",  "UFO/Component", 
	           "UFO/popup/MessageBox",
	           "../../app",
	           "../../action/Action", 
	           "../tpl/person-tpl", "./data"
	           ]
});
