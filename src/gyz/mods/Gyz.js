KISSY.add(function(S, Node, XTemplate, Component, app, GyzTabSlider, app, MapUtil, tpl){
	
	var PARAMS = app.getParam();
	
	function Gyz(config){
		 
		Gyz.superclass.constructor.call(this, config);
		
	}
	
	S.extend(Gyz, Component);
	
	S.augment(Gyz, {
		
		initComponent: function(){
			
			this.el = S.all(new XTemplate (tpl).render({
				isApp: app.isApp()
			}));
			
			Gyz.superclass.initComponent.apply(this, arguments);
			this.init();
		},
		init: function(){
			var me = this;
			if(PARAMS.city){
				this.getBodyContainer().append(new GyzTabSlider({
					param: PARAMS
				}).getEl());
				me.city = app.getCity(PARAMS.city);
			}else{
				MapUtil.getCurrentPosition(function(position){
					console.log('position',position);
					var city = app.getCityByName(position.address.city);
					me.city = city;
					PARAMS.city=city.code;
					me.getBodyContainer().append(new GyzTabSlider({
						param: PARAMS
					}).getEl()); 
					app.setPosition({
						city: position.address.city,
						point:  position.point,
						address: position.address.city+position.address.street+position.address.street_number
					});
				});
			}
		},
		getBodyContainer: function(){
			 return this.el.one('.content');
		},
		addCmpEvents: function(){
			var me = this;
			Gyz.superclass.addCmpEvents.apply(this, arguments);
			
			/**
			 * search modal
			 */
			me.el.delegate('click', 'button[name=button_search]:not([disabled])', function(event){
				 if(!me.searchModal){
					 S.use('APP/widget/search/SearchModal', function(S, SearchModal){
						 me.searchModal = new SearchModal({
							 animation: 'slide-in-up'
						 });
						 me.searchModal.on('hide', function(){
							 
						});
						me.searchModal.on('beforeshow', function(){
							 
						});
						 
						 me.searchModal.setParams({
							filter_type: "6,7,8,9",
							city: me.city.code
							
						 });
						// me.searchModal.setCity(city);
						 me.searchModal.show();
					 });
					
				 }else{
					 
					 me.searchModal.show();
				 }
				
				 
				 return false;
			});
		}
	 
	});
	
	return Gyz;
}, {
	requires: ['node', "xtemplate",  "UFO/Component", "../../app", "../mods/GyzTabSlider",
	           '../../app',
	           '../../util/MapUtil',
	           "../tpl/gyz-tpl"]
});
