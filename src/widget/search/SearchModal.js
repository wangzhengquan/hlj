KISSY.add(function(S, Node, DOM, XTemplate, Modal, Action, tpl, product_label_tpl){
	var win = window;
	
	var productLabelTpl = new XTemplate(product_label_tpl);
 
	function SearchModal(config){
		SearchModal.superclass.constructor.call(this, config);
	}
	
	S.extend(SearchModal, Modal);
	
	S.augment(SearchModal, {
		
		initComponent: function(){
			SearchModal.superclass.initComponent.apply(this, arguments);
			this.el.one('input[type=search]').getDOMNode().focus();
		},
		showProductLabels: function(){
			var productLabelList = this.el.one('.product-label-list');
			Action.query('/user/get_product_label_list.json',{}, function(data){
				var labels = data.labels;
				productLabelList.html(productLabelTpl.render(labels));
			});
		},
		createModal: function(){
			return tpl;
		},
	
		
		doSearchArtisan: function(keyword){
			var me = this,
				queryParams = S.clone(me.params);
			
			queryParams.keyword = keyword;
			
			/*queryParams['filter_type'] = me.artisanType || queryParams.artisanType;
			var urlParams = {
				queryParams: encodeURIComponent(JSON.stringify( queryParams)),
				city: encodeURIComponent(JSON.stringify(me.city)) ,
			};
			if(me.position){
				urlParams.position =  encodeURIComponent(JSON.stringify({
					address: me.position.address,
					addrDetail: me.position.addrDetail,
					city:  me.position.city,
					point: me.position.point
				}));
			}*/
			win.location.href = "../artisans/artisans_of_search.html?".concat(S.param(queryParams));
		},
		
		doSearchProduct: function(filter_label, filter_label_name){
			var me = this,
				queryParams = S.mix({
					filter_label: filter_label,
					title: filter_label_name
				}, me.params);
			
			queryParams.filter_label = filter_label;
			
			
			/*var urlParams = {
				queryParams: encodeURIComponent(JSON.stringify( queryParams)),
				title: filter_label_name
			};*/
			 
			win.location.href = "../products/products_of_search.html?".concat(S.param(queryParams));
		},
		
		setParams: function(params){
			this.params = params;
		},
		
		/**
		 * 
		 * @param city String(code) || Object
		 */
		setCity: function(city){
			if(S.isString(city)){
				city = app.getCity(city);
			}
			this.city = city;
		},
		setPosition: function(position){
			//console.log('position', position);
			this.position = position;
		},
		 
		/*setArtisanType: function(artisanType){
			this.artisanType = artisanType;
		},*/
		addCmpEvents: function(){
			SearchModal.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
			/*this.el.delegate('keyup', 'form input[type=search]', function(event){
				if(event.keyCode === 13){
					var text = event.currentTarget,
						value = S.trim(text.value);
					
					me.hide();
					text.blur();
					me.doSearchArtisan(value);
				}
			});*/
			this.el.delegate('submit', 'form', function(event){
				 var text = S.one(event.currentTarget).one('input[type=search]').getDOMNode(),
					 value = S.trim(text.value);
				
				text.blur();
				me.hide();
				me.doSearchArtisan(value); 
			});
			
			this.el.delegate('tap click', 'button[name=button_cancel]', function(event){
				me.hide();
				return false;
			});
			this.el.delegate('tap click', 'a.product-label', function(event){
				var filter_label_value = DOM.attr( event.currentTarget, 'data-value'),
					filter_label_label = DOM.attr( event.currentTarget, 'data-label');
				me.hide();
				me.doSearchProduct(filter_label_value, filter_label_label);
				return false;
			});
		}
	});
	
	return SearchModal;
}, {
	requires: ['node', 'dom', 'xtemplate', 'UFO/modal/Modal',
	           "../../action/Action",
	           "./tpl/search-modal-tpl",
	           "./tpl/product-label-tpl"]
});
