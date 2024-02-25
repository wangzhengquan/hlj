KISSY.add(function(S, Node, XTemplate, Modal, ScrollView,tpl,addr_item_tpl){
	 
	var addrItemTpl= new XTemplate(addr_item_tpl);
	var local;
	function SearchAddrModal(config){
		config = S.mix(config || {}, {
			bodyStyle: {
				"background-color": '#f5f5f5'
			}
			
		});
		SearchAddrModal.superclass.constructor.call(this, config);

	}

	S.extend(SearchAddrModal, Modal);

	S.augment(SearchAddrModal, {

		initComponent: function(){
			var me = this;
			var map = new BMap.Map();
			//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

			var options = {
				onSearchComplete: function(results){
					// 判断状态是否正确
					if (local.getStatus() == BMAP_STATUS_SUCCESS){
						var rows=[],
							position;
						me.results = results;
					//console.log('results', results);
						me.scrollContent.html('');
						for (var i = 0; i < results.getCurrentNumPois(); i++){
							position = results.getPoi(i);
							//s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
							var item = S.one(addrItemTpl.render({
								title: position.title,
								address: position.address,
								index: i
							}));
							me.scrollContent.append(item);
							//rows.push(item);

						}
					}
				}
			};
			local = new BMap.LocalSearch(map, options);
			SearchAddrModal.superclass.initComponent.apply(this, arguments);
			 
			this.scrollContent = this.el.one('.scroll-content');
			this.searchTextField =  this.el.one('input[name=addr_search_input_text]');
		},
		
		createModal: function(){
			return tpl;
		},
		
		clear: function(){
			this.searchTextField.val("");
			this.scrollContent.html("");
		},
		
		show: function(){
			this.clear();
			SearchAddrModal.superclass.show.apply(this, arguments);
		},
		
		addCmpEvents: function(){
			SearchAddrModal.superclass.addCmpEvents.apply(this, arguments);
			var me = this,
				doSearch = function(value){
					if(value != ""){
						//alert(me.city);
						var searchText= ( me.city ? (me.city+" ")  : "")+ value;
						//console.log('searchText', searchText);
						local.search(searchText);
					}
				};
			this.el.delegate('click', '.back-button', function(event){
				me.slideOut();
			});

			this.el.delegate('input propertychange', 'input[name=addr_search_input_text]',S.buffer(function(event){
				var text = event.currentTarget,
					value = S.trim(text.value);

				doSearch(value);
			}, 1000));

			this.el.delegate('keyup', 'input[name=addr_search_input_text]', function(event){
				if(event.keyCode === 13){
					var text = event.currentTarget,
						value = S.trim(text.value);

					doSearch(value);

				}
			});

			this.el.delegate('click', '.list .item', function(event){

				var item = event.currentTarget,
					index = S.one(item).attr('data-index');
				me.fire('itemselected', me.results.getPoi(index));
				me.slideOut();

			});

		}


	});

	return SearchAddrModal;
}, {
	requires: ['node', 'xtemplate', 'UFO/modal/Modal', 'UFO/scroll/ScrollView', 
	           './tpl/search-addr-tpl','./tpl/search-addr-item-tpl' ]
});
