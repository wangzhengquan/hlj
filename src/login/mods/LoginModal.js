KISSY.add(function(S, Node, XTemplate, Modal,LoginPanel ){
	 
	function LoginModal(config){
		 
		LoginModal.superclass.constructor.call(this, config);

	}

	S.extend(LoginModal, Modal);

	S.augment(LoginModal, {

		initComponent: function(){
			var me = this;
			this.loginPanel = new LoginPanel();
			this.items = [this.loginPanel];
			LoginModal.superclass.initComponent.apply(this, arguments);
		},
		 
		clear: function(){
			 
		},
		show: function(){
			this.clear();
			LoginModal.superclass.show.apply(this, arguments);
		},
		
		addCmpEvents: function(){
			LoginModal.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
			this.el.delegate('click tap', '.button-back', function(event){
				me.hide();
			});
			this.loginPanel.on('loginsuc', function(){
				me.hide();
				me.fire('loginsuc');
			});

		}


	});

	return LoginModal;
}, {
	requires: ['node', 'xtemplate', 'UFO/modal/Modal' ,"./LoginPanel" ]
});
