/**
 */
KISSY.add(function(S, Node, Event, XTemplate,  TabSlider, XTemplateUtil,   
		app,
		CommentList){
	
	var body = document.body,
		PARAMS = app.getParam(),
		total = PARAMS.total || 0,
		excited = PARAMS.excited || 0,
		good = PARAMS.good || 0,
		normal = PARAMS.normal || 0,
		bad = PARAMS.bad || 0;
		
		 
	function CommentListTabSlider(config){
		 
		CommentListTabSlider.superclass.constructor.call(this, config);
	}
	
	S.extend(CommentListTabSlider, TabSlider);
	
	UFO.augment(CommentListTabSlider, {
		alias: 'commentListTabSlider',
		
		initComponent: function(){
			this.autoSlide = false;
			this.loop =false;
			this.lazyLoad = true;
			
			this.items=[
	            {title:'<span>全部</span><span>('+total+')</span>', type: "commentlist", param: {star: '0', artisan_id:PARAMS.artisan_id}},
	            {title:'<span>超出期待</span><span>('+excited+')</span>', type: "commentlist", param: {star: '10', artisan_id:PARAMS.artisan_id}},
	            {title:'<span>很满意</span><span>('+good+')</span>', type: "commentlist", param: {star: '5', artisan_id:PARAMS.artisan_id}},
	            {title:'<span>基本满意</span><span>('+normal+')</span>', type: "commentlist", param: {star: '3', artisan_id:PARAMS.artisan_id}},
	            {title:'<span>不满意</span><span>('+bad+')</span>', type: "commentlist", param: {star: '1', artisan_id:PARAMS.artisan_id}}
	        ];
			
			CommentListTabSlider.superclass.initComponent.apply(this, arguments);
		},
		
		/*load: function(slide, realIndex, item){
			 //console.log('item', item);
			slide.append(UFO.createItem(item).getEl());
			this.lazyLoadArr[realIndex].loaded = true;
		},*/
		
		addCmpEvents: function(){
			CommentListTabSlider.superclass.addCmpEvents.apply(this, arguments);
		}
	 
	});
	
	return CommentListTabSlider;
}, {
	requires: ["node", "event", "xtemplate",   
	           "UFO/slider/TabSlider",
	           "../../util/XTemplateUtil",
	           "../../app",
	           "./CommentList"
	           ]
});