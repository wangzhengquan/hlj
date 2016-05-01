KISSY.add(function(S, Node, XTemplate, Viewport, MessageBox, Action, 
		OrderCancelRuleModal, 
		app,
		tpl){
	var doc = document;
	var params = app.getParam();
	function OrderCancel(config){
		config = S.mix({
			title:'取消订单',
			no_header: app.isApp(),
			bodyCls: 'background',
			leftButtons:[{
				iconCls: "icon-back",
				cls:"button-back",
				href: "javascript:history.go(-1);"
				
			}]
		}, config);
		OrderCancel.superclass.constructor.call(this, config);
	}
	
	S.extend(OrderCancel, Viewport);
	
	S.augment(OrderCancel, {
		
		initComponent: function(){
			 
			OrderCancel.superclass.initComponent.apply(this, arguments);
			this.init();
		},
		
		init: function(){
			var me = this;
			Action.query("/v2/cancel_reason.json", {}, function(json){
				console.log(json);
				me.dataReasons = json.data;
				me.getBodyContainer().html(new XTemplate(tpl).render({
					reasons: json.data
				}));
				
			} );
		},
		/**
		 * 提交
		 */
		submit: function(){
			var me = this;
			var cancelReasonIndex = Number(me.el.one('input[name=reason]:checked').val()),
				cancelReason = me.dataReasons[(cancelReasonIndex)];
			var data = {
				order_id: params.order_id,
				order_number: params.order_no,
				status: 20,
				cancel_reason: cancelReason
			};
			if(params.user_id){
				data.user_id = params.user_id;
				data.token = params.token;
			}
			
			if(cancelReasonIndex === 6){
				var other_reason= me.el.one('textarea[name=other_reason]').val();
				
				if(!other_reason || S.trim(other_reason) == ""){
					MessageBox.alert('', '请填写取消原因');
					return;
				}else{
					data.other_reason = S.trim(other_reason);
				}
			}
			location.href="./orderCancelSuc.html"+location.search;
		},
		
		addCmpEvents: function(){
			var me = this;
			/**
			 * textarea输入字数限制提示
			 */
			this.el.delegate('input propertychange', 'textarea[name=other_reason]', function(event){
				var target = event.currentTarget,
					maxLength = 200;
				if(target.value.length > maxLength) {
					target.value = target.value.substr(0,maxLength);
				}
				
				S.one('.max-input-tip .hightlight').html(maxLength-target.value.length);
				/*var regC = /[^ -~]+/g; 
				var regE = /\D+/g; 
				var str = target.value; 

				if (regC.test(str)){ 
					target.value = target.value.substr(0,maxLength/2); 
				} 

				if(regE.test(str)){ 
					target.value = target.value.substr(0,maxLength); 
				} */
			});
			/* select change*/
			this.el.delegate('change', 'input[name=reason]', function(event){
				var target = event.currentTarget,
					$target = S.one(target),
					index = Number($target.val());
				if(index === 6 && target.checked){
					me.el.one('section.section-reason-input').css({
						display:'block'
					});
					doc.body.scrollTop = doc.body.scrollHeight - doc.body.clientHeight;
				}else{
					me.el.one('section.section-reason-input').css({
						display:'none'
					});
				}
				
				me.el.one('button.button-commit').removeAttr('disabled');
				 
			});
			
			/*查看订单规则*/
			this.el.delegate('click', 'a[action=check_rule]', function(event){
				if(!(app.isApp())){
					if(!me.orderCancelRuleModal){
						me.orderCancelRuleModal = new OrderCancelRuleModal();
						
					}
					me.orderCancelRuleModal.show();
				}else{
					location.href='./orderCancelRule.html';
				}
				
			});
			
			/*联系手艺人*/
			var confirmContactArtisan= function(){
				MessageBox.show({
				   title: '',
		           msg: '是否需要客服帮助您联系手艺人？',
		           buttons: MessageBox.YESNO,
		           buttonText:{ 
		        	   no: "不用了",
		               yes: "联系客服"
		           }
		          
				}).then(function(chose){
					if(chose === MessageBox.YES){
						location.href="tel:4000088311";
					}else{
						me.submit();
					}
					
				});
			};
			
			/*追责手艺人*/
			var confirmBlameArtisan = function(){
				MessageBox.show({
				   title: '',
		           msg: '是否确认提交？一经查实，将会直接影响手艺人的信用等级。',
		           buttons: MessageBox.OKCANCEL,
		           buttonText:{ 
		               cancel: "取消",
		               ok: "确认"
		           }
		          
				}).then(function(chose){
					if(chose === MessageBox.OK){
						me.submit();
					} 
				});
			};
			
			/*修改订单*/
			var confirmModifyOrder = function(){
				MessageBox.show({
				   title: '',
		           msg: '是否需要客服帮助您修改订单信息？',
		           buttons: MessageBox.YESNO,
		           buttonText:{ 
		               no: "不用了",
		               yes: "联系客服"
		           }
		          
				}).then(function(chose){
					if(chose === MessageBox.YES){
						location.href="tel:4000088311";
					}else{
						me.submit();
					}
					
				});
			};
			/**
			 * 点击提交
			 */
			this.el.delegate('click', 'button.button-commit', function(event){
				var cancelReasonIndex = Number(me.el.one('input[name=reason]:checked').val()),
					cancelReason = me.dataReasons[(cancelReasonIndex)];
				me.submit();
				//console.log('cancelReasonIndex', cancelReason);
				/*switch(cancelReasonIndex){
				case 0:
					confirmContactArtisan();
					break;
				case 2:
				case 3:
					confirmBlameArtisan();
					break;
					
				case 4:
					confirmModifyOrder();
					break;
					
				default:
					me.submit();
					break;
						
				}*/
			});
		}
	 
	});
	
	return OrderCancel;
}, {
	requires: ['node', "xtemplate",  "../../viewport/mods/index",  "UFO/popup/MessageBox",
	           "../../action/Action" ,
	           "./OrderCancelRuleModal",
	           "../../app",
	           "../tpl/order-cancel-tpl"]
});