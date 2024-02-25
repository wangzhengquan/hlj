KISSY.add(function(S, Node, Modal, SearchAddrModal, tpl){
	 
	function ServiceAddrModal(config){
		config = S.mix(config || {}, {
			bodyStyle: {
				"background-color": '#f5f5f5'
			}
		});
		
		ServiceAddrModal.superclass.constructor.call(this, config);
	}
	
	S.extend(ServiceAddrModal, Modal);
	
	S.augment(ServiceAddrModal, {
		
		initComponent: function(){
			//this.el = S.one(tpl);
			
			ServiceAddrModal.superclass.initComponent.apply(this, arguments);
		},
		createModal: function(){
			return tpl;
		},
		setPosition: function(position){
			/*if(position.point){
				this.position = position;
			}*/
			this.position = position;
			this.city = position.city;
			if(position && position.address){
				this.el.one('.serviceAddr span[name=address]').html(position.address.concat(position.title || ""));
			}
		},
		
		onAddrItemSelected: function(position){
			
			this.setPosition(position);
		},
		
		addCmpEvents: function(){
			ServiceAddrModal.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
			this.el.delegate('click', '.back-button', function(event){
				//alert('click');
				if(me.fire('clickBackButton') !== false){
					me.slideOut();
				}
			});
			
			this.el.delegate('click', '.general-address', function(event){
				//searchAddrModal.slideIn();
				if(!me.searchAddrModal){
					me.searchAddrModal = new SearchAddrModal();
					if(me.city){
						me.searchAddrModal.set('city', me.get('city'));
					}
					me.searchAddrModal.on('itemselected', S.bind(me.onAddrItemSelected, me));
					me.searchAddrModal.slideIn();
					
				}else{
					me.searchAddrModal.slideIn();
				}
			});
			
			this.el.delegate('click', 'button[name=ok]', function(event){
				var addrDetail = S.one('input[name=addrDetail]').val();
				me.position && (me.position.addrDetail = addrDetail);
				//console.log('clickOk', me.position);
				if(me.allowBlank === false && !me.position){
					alert('请选择服务地址!');
				}else{
					var position = S.mix({}, me.position, true, ['addrDetail', 'address', 'city', 'point', 'postcode', 'province', 'title'], true);
					if( me.fire('ok', position)!== false){
						me.slideOut();
					}
				}
			});
			
		}
	 
	});
	
	return ServiceAddrModal;
}, {
	requires: ['node', 'UFO/modal/Modal', './SearchAddrModal',
	           './tpl/service-addr-tpl'
	           ]
});