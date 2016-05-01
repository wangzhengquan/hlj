KISSY.add(function(S, Node, XTemplate, Component, FormUtil, LoginAction, tpl){
	 
	function LoginPanel(config){
		 
		LoginPanel.superclass.constructor.call(this, config);
		
	}
	
	S.extend(LoginPanel, Component);
	
	UFO.augment(LoginPanel, {
		alias: 'loginpanel',
		
		initComponent: function(){
			this.el = S.one(tpl);
			LoginPanel.superclass.initComponent.apply(this, arguments);
		},
		 
		addCmpEvents: function(){
			LoginPanel.superclass.addCmpEvents.apply(this, arguments);
			
			var me = this;
			//获取验证码
			this.el.delegate('tap click', '[action=get_verify_code]:not([disabled])', function(event){
				var mobile = me.el.one('input[name=mobile]').val();
				if(!mobile){
					alert('请输入手机号码！');
					return false;
				}
				if(!mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)){
					alert('手机号码输入格式有误！');
					return false;
				}
				//alert('ver');
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				
				var countdown = function(){
					var countdown_el = target.one("[name=countdown]");
					countdown_el.css("display", "inline");
					var count = 60;
					
					countdown_el.html("("+count+"s)");
					var interval = setInterval(function(){
						countdown_el.html("("+(--count)+"s)");
						if(count === 0){
							target.removeAttr('disabled');
							countdown_el.css("display", "none");
							clearInterval(interval);
							
						}
					}, 1000);
				};
				countdown();
				
				
				
				LoginAction.getVerifyCode({
					mobile: mobile
				}, function(){
					
				});
				return false;
				
			});
			
			//登录
			this.el.delegate('click', '[action=login]', function(event){
				var record = FormUtil.getRecord(me.el.one('.h_logininput'));
				LoginAction.login(record, function(){
					me.fire('loginsuc');
				}, function(){
					me.fire('loginfail');
				});
				console.log('record', record);
			});
			
			var	verify_code_inputfield = this.el.one('[name=verify_code]');
			verify_code_inputfield.on('input propertychange', function(e){
				var val = verify_code_inputfield.val();
				if(val && val.length===6){
					me.el.one('[action=login]').removeAttr('disabled');
				}
			});
			
			
		}
	 
	});
	
	return LoginPanel;
}, {
	requires: ['node', "xtemplate",  "UFO/Component",  "UFO/util/Form", "../../action/LoginAction", "../tpl/login-tpl"]
});