/**
 * http://www.stg.helijia.com/mobile/build/APP/gyz/view/index.html?city=110100&from_type=app
 * city
 * from_type
 * version
 * device_type
 */
KISSY.add(function(S, Node, Event, XTemplate,  TabSlider, XTemplateUtil, RecommendList, PersonList, ThingList){
	var body = document.body;
	 
		
	var page_size = 5;
	
	 
	
	function GyzTabSlider(config){
		 
		GyzTabSlider.superclass.constructor.call(this, config);
	}
	
	S.extend(GyzTabSlider, TabSlider);
	
	UFO.augment(GyzTabSlider, {
		alias: 'gyztabslider',
		
		initComponent: function(){
			this.autoSlide = false;
			this.loop =false;
			this.lazyLoad = true;
			
			this.items=[
	            {title:'推荐', type: "recommendList", city_code: this.param.city},
	            {title:'人儿', type: "personList", city_code: this.param.city},
	            {title:'事儿', type: "thingList", city_code: this.param.city}
	        ];
			GyzTabSlider.superclass.initComponent.apply(this, arguments);
		},
		
		load: function(slide, realIndex, item){
			 //console.log('item', item);
			if(realIndex===0){
				this.recommendList = UFO.createItem(item);
				var param =S.mix({page_size: page_size},this.param);
				this.recommendList.load(param);
				slide.append(this.recommendList.getEl());
				
			}else{
				slide.append(UFO.createItem(item).getEl());
			}
			this.lazyLoadArr[realIndex].loaded = true;
			
		},
		
		addCmpEvents: function(){
			GyzTabSlider.superclass.addCmpEvents.apply(this, arguments);
		}
	 
	});
	
	return GyzTabSlider;
}, {
	requires: ["node", "event", "xtemplate",   
	           "UFO/slider/TabSlider",
	           "../../util/XTemplateUtil",
	           "./RecommendList",
	           "./PersonList",
	           "./ThingList"
	           ]
});
