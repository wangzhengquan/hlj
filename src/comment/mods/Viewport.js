KISSY.add(function(S, Node, XTemplate, MainViewport, CommentListTabSlider){
	 
	function Viewport(config){
		config = S.mix({
			cls: 'background',
			title: '顾客评价',
			leftButtons: [{
				cls:'button-back',
				iconCls: 'icon-back',
				href:'javascript:history.go(-1);'
			}]
		}, config, true);
		Viewport.superclass.constructor.call(this, config);
		
	}
	
	S.extend(Viewport, MainViewport);
	
	S.augment(Viewport, {
		
		initComponent: function(){
			this.items = [new CommentListTabSlider()];
			Viewport.superclass.initComponent.apply(this, arguments);
		},
		 
		addCmpEvents: function(){
			Viewport.superclass.addCmpEvents.apply(this, arguments);
		}
	 
	});
	
	return Viewport;
}, {
	requires: ['node', "xtemplate",  "../../viewport/mods/index" , "./CommentListTabSlider"]
});
