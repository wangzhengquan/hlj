/*
	http://www.helijia.com/mobile/build/APP/customer/view/orderDetail.html?
		order_id=1493170&user_id=4f7f2c8710e244d1a9ead71bbc4beed3&token=kZ6JJVOyapTNdww8wfPF&from_type=app
	参数说明：
	 **
	 *  order_id:  订单id,
	 *	user_id: 用户id,
	 *	token: 验证登录状态,
	 *  from_type: 从app进入还是h5进入(app , html5)
	 */
KISSY.add(function (S, node, XTemplate, 
	Action, 
	Component, 
	MessageBox,
	ORDER_STATUS,
	app,
	tpl, 
	content_tpl) {
	
	var ORDER_STATUS_MAP = ORDER_STATUS.status_map;
	
	var params = app.getParam(),
		fromApp = app.isApp();
		 
	var user = app.getSessionUser();
	if(user){
		params.user_id = user.user_id;
		params.token = user.token;
	}
	           
	/*params = {
		order_id: '1493170',
		user_id: '4f7f2c8710e244d1a9ead71bbc4beed3',
		token: 'kZ6JJVOyapTNdww8wfPF'
	}*/
	
	function OrderDetail(config){
		
		OrderDetail.superclass.constructor.call(this, config);
		
	}
	
	S.extend(OrderDetail, Component);
	
	S.augment(OrderDetail, {
		
		initComponent: function(){
			this.el = S.one(new XTemplate(tpl).render({
				fromApp: fromApp
			}));
			 
		
			OrderDetail.superclass.initComponent.apply(this, arguments);
			this.init();
		},
		getBodyContainer: function(){
			return this.el.one('.content');
		},
		init: function(){
			var me = this;
			Action.query("/v2/order_detail.json", params, function(json){
				console.log('json', json);
				var data = me.data = json.data;
				//data.status = String(parseInt(data.status));
				 
				me.getBodyContainer().html(new XTemplate(content_tpl,{
						commands:{
							'getPic': function (scopes, option) {
								return app.config.imgBaseUrl + option.params[0];
			                },
			                
			                'getCustomerMobile': function (scopes, option) {
								return  option.params[0];
			                },
			                'getOrderStatusName': function (scopes, option) {
								var code = option.params[0];
								return ORDER_STATUS_MAP[code].name;
			                },
			                'getArtisanHref': function (scopes, option) {
								var artisan_id = option.params[0];
									
								return "../artisan/index.html"+location.search+"&channel=helijia&artisan="+artisan_id;
			                },
			                
			                'shouldShowContactArtisan': function (scopes, option) {
			                	return (option.params[0] != '00' &&  option.params[0] != '20' && option.params[0] != '90') ? option.fn(scopes) : "";
			                },
			                'formatPrice': function(scopes, option){
			                	return Number(option.params[0]).toFixed(2);
			                },
			                'getProductHref': function(scopes, option){
			                	if(params.from_type == 'app'){
			                		return 'http://www.helijia.com/#/product/'+option.params[0];
			                	}else{
			                		return '../product/index.html?product_id='+option.params[0];
			                	}
			                }
			                
						}
					}
				).render(data));
				
				var operateButtons = me.el.one('[name=operate-buttons]');
//取消订单 、去支付、 联系TA、 再次预约、  删除订单 、联系客服 、 支付附加费、 确认完成 、去评价、 追加评价
				if(data.status == ORDER_STATUS.kOrderStatusNeedPay){
					////等待支付  0
					operateButtons.append('<button action="cancel" class="button">取消订单</button>');
					operateButtons.append('<button action="goPay" class="button">去支付</button>');
				}else if(data.status == ORDER_STATUS.kOrderStatusIsPay//订单已经支付  10
					|| data.status == ORDER_STATUS.kOrderStatusDoingTwo//40  已出发
					|| data.status == ORDER_STATUS.kOrderStatusDoingThree//50    已到达
				){
					operateButtons.append('<button action="cancel"  class="button">取消订单</button>');
					//operateButtons.append('<a href="tel:'+me.data.artisan_mobile+'" telPhone="'+me.data.artisan_mobile+'" class="button">联系TA</a>');
					
				}else if(data.status == ORDER_STATUS.kOrderStatusIsCancel){
					//订单已取消   20
					operateButtons.append('<button action="againOrder" class="button">再次预约</button>');
					operateButtons.append('<button action="delete" class="button">删除订单</button>');
				}else if(data.status == ORDER_STATUS.kOrderStatusDoing){
					//30  服务进行中
					operateButtons.append('<a href="tel:4000088311" class="button">联系客服</a>');
				}else if(data.status == ORDER_STATUS.kOrderStatusNeedSure){
					//待确认 60
					if(data.extra_fee_price>0){
						operateButtons.append('<button action="payAdditionFei" class="button">支付附加费</button>');
					}else{
						operateButtons.append('<button action="sureCompleted" class="button">确认完成</button>');
					}
				}else if(data.status == ORDER_STATUS.kOrderStatusComplate){
					//服务完成    90
					operateButtons.append('<button action="againOrder" class="button">再次预约</button>');
					if(!data.comment_id){
						operateButtons.append('<button action="goComment" class="button">去评价</button>');
					}else if(data.can_comment){
						operateButtons.append('<button action="addComment" class="button">追加评价</button>');
					}
					operateButtons.append('<button action="delete" class="button">删除订单</button>'); 
				}
				
			}, function(msg){
				console.log('error', msg);
			});
		},
		addCmpEvents: function(){
			var me = this;
			this.el.delegate('click', 'button[action]', function(event){
				var btn = S.one(event.currentTarget),
					telPhone = btn.attr('telPhone'),
					action= btn.attr('action');
				if(action == 'cancel'){
					//取消订单
					var param = {
						order_id: me.data.order_id,
						order_no: me.data.order_no,
						user_id: params.user_id,
						token: params.token,
						from_type: params.from_type,
						status:  me.data.status
						//artisan_mobile: me.data.artisan_mobile
					};
					if(!fromApp){
						param.back_url = location.href;
					}
					location.href='./orderCancel.html?'+S.param(param);
				}else if(action == 'againOrder'){
					//再次预约
					if(fromApp){
						location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
					}else{
						location.href = "../product/index.html?product_id="+me.data.product_id;
					}
				}else if(action == 'delete'){
					//删除订单
					if(fromApp){
						location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
					}else{
						MessageBox.confirm('确认删除订单？', '删除之后将无法恢复。', { 
			               ok: "确定删除", 
			               cancel: "取消" 
			            }).done(function(confirm){
			        	   if(confirm ===  MessageBox.OK){
			        		   
			        		   Action.update('/v2/delete_order', {
			        			   order_id:  me.data.order_id
			        		   }, function(json){
			        			   console.log("删除成功", json);
			        			   location.href="../home/index.html#order";
			        		   });
			        	   }
			            });
					}
				}else if(action == "goPay"){
					//去支付
					if(fromApp){
						location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
					}else{
						location.href="../order/orderConfirm.html?order_id=" + me.data.order_id;
					}
				} else if(action=="sureCompleted"){
					//确认完成
					if(fromApp){
						location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
					}else{
						Action.update('/user/edit_order', {
							//order_id: me.data.order_id,
							order_number: me.data.order_no,
							status: '90'
						}, function(json){
							if(json.result=='fail'){
								alert(JSON.stringify(json));
							}else{
								me.init();
							}
						});
					}
				}else if(action=="goComment" || action=="addComment"){
					if(fromApp){
						location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
					}else{
						var _param = {
							artisan_id: me.data.artisan_id,
							order_id: me.data.order_id,
							order_number: me.data.order_seq
						};
						if(me.data.comment_id){
							_param.comment_id = me.data.comment_id;
						}
						location.href= '../comment/addComment.html?'+S.param(_param);
						
					}
				}
				else{
					location.href="http://app.helijia.com/zmw/v2/htmlParams?btnType="+action;
				}
				
				//console.log('action', action);
				
			});
			
			S.one(document).delegate('click', '.button-back', function(){
				location.href="http://app.helijia.com/zmw/v2/orderdetail?btnType=closeWebView";
			});
		}
	 
	});
	
	return OrderDetail;
},{
	requires: ["node", "xtemplate", 
	           "../../action/Action",
	           "UFO/Component", 
	           "UFO/popup/MessageBox", 
	           "./ORDER_STATUS" ,
	           ,"../../app", 
	           "../tpl/order-detail-tpl", 
	           "../tpl/order-detail-content-tpl"]
});
