KISSY.add(function(S, Node, XTemplate , Modal, ScrollView, Action, DataLazyload){
	var tpl = [
	       ' <div class="" style="width:100%; height:100%; background-color:#f5f5f5;">',
           '    <header class="bar-love header bar">',
           '	   	<a class="button button-clear  button-back icon icon-back" href="javascript:;"> </a>',
           '	   	<h1 class="title">',
           '	   		选择要跳转的商品',
           '	   	</h1>',
           '		<div class="buttons buttons-right" style="-webkit-transition-duration: 0ms; transition-duration: 0ms;">',
		   '			<button class="button button-clear button-ok"> 确定</button>',
		   '    	</div>',
           '    </header>',
           '	<div class="pane  has-header">',
           '		<div class="scroll-content">',
           '		</div>', 
           '	</div>', 
           '</div>'
           ].join('');
	
	var listProductTpl = new XTemplate([
		'<ul class="list-product">',
		'	{{#each this}}',
		'	<li class="item-product">',
		'		<a class="card-item" href="javascript:;" data-id="{{product_id}}">',
		'			<img data-src="../resources/images/default_product.png" src="http://hlj-img.b0.upaiyun.com/zmw/{{image}}" width="100%"> ',
		'			<span class="item-info"> ',
		'				<span class="desc">{{name}}</span> ',
		'				<span class="flex row-center detail">',
		'					<font class="price">￥{{price}}</font> ',
		'					<span class="times">{{sold_amount}}人做过</span>',
		'				</span>',
		'			</span>',
		'		</a>',
		'	</li>',
		'	{{/each}}',
		'</ul>'].join(''));
	
	function ArtisanProductsModal(config){
		ArtisanProductsModal.superclass.constructor.call(this, config);
	}
	
	S.extend(ArtisanProductsModal, Modal);
	
	UFO.augment(ArtisanProductsModal, {
		alias: 'artisanProductsModal',
		
		initComponent: function(){
			this.mainBody = S.one(tpl);
			 
			this.content = this.mainBody.one('.scroll-content');
		 
			ArtisanProductsModal.superclass.initComponent.apply(this, arguments);
			
			this.modal.append(this.mainBody);
		},
		 
		load: function(params){
			var me = this;
			params = params || this.params;
			Action.query("/v2/products", params, function(json){
				console.log('suc', json);
				me.getBodyContainer().append(listProductTpl.render(json.data));
			
				//DataLazyload(me.getBodyContainer().one('.list-product'));
				
			}, function(msg){
				 
			});
		},
		
		setParams: function(params){
			this.params  = params;
		},
		
		
		getBodyContainer: function(){
			 return this.content;
		},
		
		reset: function(){
			this.el.all('.list-product .item-product a').removeClass('select');
		},
		
		addCmpEvents: function(){
			var me = this;
			ArtisanProductsModal.superclass.addCmpEvents.apply(this, arguments);
			this.el.delegate('click', '.button-back', function(event){
				me.slideOut();
			});
			
			this.el.delegate('click', '.list-product .item-product a', function(event){
				var target = S.one(event.currentTarget);
				me.el.all('.list-product .item-product a').removeClass('select');
				target.addClass('select');
			});
			
			this.el.delegate('click', 'button.button-ok', function(event){
				var selectItem = S.one('.list-product .item-product a.select');
				me.fire('ok', selectItem.attr('data-id'), me.index);
				me.slideOut();
			});
			
		}
		 
		
	 
	});
	
	return ArtisanProductsModal;
}, {
	requires: ['node', 'xtemplate',
	           'UFO/modal/Modal', 
	           'UFO/scroll/ScrollView', 
	           '../../../action/Action',
	           "MUI/datalazyload/index"
	          ]
});
