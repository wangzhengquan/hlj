KISSY.add(function(S, Node, EVENT, XTemplate , Modal){
	var doc = document;
	var tpl = new XTemplate([
			'<div class="slides"> ',
			'	<div class="slides-container tab-content">',
			'	{{#each this}}',
			'		<div class="tab-pannel">',
			'			<a href="#" onclick="">',
			'				<img src="{{this}}" style="width:100%;">',
			'			</a>',
			'		</div>',
			'	{{/each}}',
			'	</div>',
			'</div>'
	        ].join(''));
	 
	function PhotoSliderModal(config){
		config = S.mix(config ||{},{
			bodyCls: 'flex flex-center',
			bodyStyle:{
				'background-color': 'rgba(0, 0, 0, 0.9)',
				padding:'8px'
			}
			
		},false, undefined, true);
		PhotoSliderModal.superclass.constructor.call(this, config);
		
	}
	
	S.extend(PhotoSliderModal, Modal);
	
	UFO.augment(PhotoSliderModal, {
		alias: 'PhotoSliderModal',
		createModal: function(){
			return tpl.render(this.data);
		},
		show: function(){
			var me = this;
			PhotoSliderModal.superclass.show.call(this, function(){
				me.el.delegate('click', undefined, function(event){
					me.hide();
					return false;
				});
			});
		} 
	 
	});
	
	return PhotoSliderModal;
}, {
	requires: ['node', 'event', 'xtemplate',
	           'UFO/modal/Modal'
	          ]
});