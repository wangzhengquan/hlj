KISSY.add(function(S, Node, XTemplate, Container){
	 
	var tpl = new XTemplate([
	           ' <div class="edit-text-panel" style="width:100%; height:100%; background-color:#f5f5f5;">',
	           '    <header class="bar-love header bar">',
	           '	   	<a class="button button-clear  button-back icon icon-back" href="javascript:;"> </a>',
	           '	   	<h1 class="title">',
	           '	   		{{title}}',
	           '	   	</h1>',
	           '		<div class="buttons buttons-right" style="-webkit-transition-duration: 0ms; transition-duration: 0ms;">',
			   '			<button class="button button-clear button-ok"> 确定</button>',
			   '    	</div>',
	           '    </header>',
	           '	<div class="content has-header has-footer">',
	           '		<textarea class="text-input-area" placeholder="输入文字..." ></textarea>',
	           '	</div>',
	           ' </div>'
	           ].join(''));
	
	function EditTextPanel(){
		EditTextPanel.superclass.constructor.apply(this, arguments);
	}
	
	KISSY.extend(EditTextPanel, Container);	
	//jump_type=pros_arts&city=110100
	//name%3D美甲%26city%3D110100
	KISSY.augment(EditTextPanel, {
	 
		initComponent: function(){
			var me = this;
			this.el = S.all(tpl.render({
				title: this.title || "发表文字"
			}));
			
			this.scrollView = document.body;
			this.header = this.el.one('.header');
			this.textarea = me.el.one('textarea');
			EditTextPanel.superclass.initComponent.apply(this, arguments);
		},
		 
		setTitle: function(title){
			this.header.one('.title').html(title);
		},
		setIndex: function(index){
			this.index = index;
		}, 
		setText: function(text){
			this.textarea.val(text);
		},
		
		clear: function(){
			this.setText('');
		},
		
		getBodyContainer: function(){
			return this.el.one('.content');
		},
		
		addCmpEvents: function(){
			var me = this;
			me.el.delegate('click', '.button-back', function(){
				me.fire('back');
			});
			me.el.delegate('click', '.button-ok', function(event){
				me.fire('ok', me.textarea.val(), me.index, me.action);
				
			});
		}
		
	});
	
	return EditTextPanel;
},{
	requires: [ "node", "xtemplate", 
	            "UFO/container/Container"
	          ]
});