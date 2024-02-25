KISSY.add(function(S, 
		D,
		Node, 
		XTemplate,
		Datalazyload,
		Slide, 
		LoadingMask,
		Action, 
		XTemplateUtil,
		app,
		tpl){
	var needLogin = false;
	
	var doc = document;
	
	var  mask = new LoadingMask();
	
	var params = app.getParam(),
	  	product_id = params.product_id;
	/**
	 * 创建点击展开功能
	 */
	var initExpandableElem = function(expandElem, minHeight){
		var p = expandElem.one('p'),
			origHeight = p.height();
		if(p.height() > minHeight){
			expandElem.addClass('collapseable collapse');
			p.height(minHeight);
			expandElem.delegate('click tap', 'a.switch', function(e){
				var target = S.one(e.currentTarget),
				  	switches = target.parent('.switches');

				if(expandElem.hasClass('collapse')){
					expandElem.removeClass('collapse');
					expandElem.addClass('expand');
					p.css('height', origHeight);
					//p.css('height', 'auto');

				}else if(expandElem.hasClass('expand')){
					expandElem.removeClass('expand');
					expandElem.addClass('collapse');
					//p.css('height', origHeight);
					p.height(minHeight);
				}
				return false;
			});
		}
	};
	
	var renderLazyData = function(textarea){
		textarea.style.display = 'none';
        textarea.className = ''; // clear hook
        var content = D.create('<div>');
        // textarea 直接是 container 的儿子
        textarea.parentNode.insertBefore(content, textarea);

        var html = textarea.value;

        D.html(content, html, true);
        D.remove(textarea);
	};
	
	/**
	 * 初始化滑动组件
	 */
	var initSlide= function(){
		var product_pic_slides_el = S.one('#product_pic_slides');
		if(product_pic_slides_el){
			 new Slide(product_pic_slides_el,{
				autoSlide:false,
				effect:'hSlide',
				animWrapperAutoHeightSetting: false,
				colspan: 1
			});
		}
		
		var service_items_slides_el = S.one('#service_items_slides');
		if(service_items_slides_el && service_items_slides_el.all('.tab-pannel').length > 1){
			new Slide(service_items_slides_el,{
				autoSlide:false,
				effect:'hSlide',
				animWrapperAutoHeightSetting: false,
				colspan: 2
			});
		}
		
		var material_slides_el = S.one('#material_slides');
		if(material_slides_el){
			new Slide(material_slides_el,{
				autoSlide:false,
				effect:'hSlide',
				animWrapperAutoHeightSetting: false,
				colspan: 1
			});
		}
	};
	
	 /**
	  * 微信分享
	  * @returns
	  */
	var weixinShare = function(){
		
	 
		var configWeixin = function(config){
			console.log(JSON.stringify(config));
			wx.config({
				debug: false,
				appId: config.appid,
				timestamp: config.timestamp,
				nonceStr: config.nonceStr,
				signature: config.signature,
				jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
			});
			wx.ready(function() {
				
				Action.query('/v2/get_share_info', {
					product_id: params.product_id
				}, function(json){
					console.log(JSON.stringify(json));
					var data_friend = json.data.weixin;
					//分享到朋友圈
					wx.onMenuShareTimeline({
						title: data_friend.title, // 分享标题
						link: encodeURI(window.location.href), // 分享链接
						imgUrl: app.config.imgBaseUrl + data_friend.pic, // 分享图标
						success: function() {
							//self.callback && self.callback();
						},
						cancel: function() {}
					});
					
					//分享给好友
					wx.onMenuShareAppMessage({
						title: data_friend.title, // 分享标题
						desc: data_friend.des, // 分享描述
						link: encodeURI(window.location.href), // 分享链接
						imgUrl: app.config.imgBaseUrl + data_friend.pic, // 分享图标
						type: '', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {},
						cancel: function() {}
					});
				});
				
			});
		};
		
		Action.query('/v2/wx/config', {
			'url': window.location.href
		}, function(json) {
			configWeixin(json);
		});
	 };

	 return {
		/**
		 * 初始化
		 * @returns
		 */
		 init: function(){
			 mask.show();
			 var me = this;
			 Action.query('/v2/product_detail.json',{
				 product_id : product_id
			 }, function(json){
				console.log('product_detail', json);
				
				if(json.ret){
					if(!json.data.artisan_visit && !json.data.customer_visit){
						json.data.artisan_visit = true;
					}
					
					if(app.isApp()){
						S.one(doc.body).addClass("app");
					}
					S.one(doc.body).append(new XTemplate(tpl, {
						commands:{
							'calStarWidth': function (scopes, option) {
			                    return Math.round(option.params[0]*.5)*20;
			                }
						}
					}).render(json.data));
					
					var body_width = S.one(doc.body).innerWidth();
					console.log("body_width",body_width);
					S.one('#product_pic_slides').height(body_width);
					
					
					initSlide();
					me.data = json.data;
					
					var datalazyload = new Datalazyload({diff: {bottom: 100}});
					
					S.all('textarea.lazyload').each(function(node, i){
						var domNode = node.getDOMNode(),
							name = node.attr('name');
						
					    if(name=="section-artisan"){
							renderLazyData(domNode);
							initExpandableElem(S.one('.item-district .detail'), 36);
						}else{
							datalazyload.addCallback(domNode, function(){
								renderLazyData(domNode);
							});
						}
					});
					
					
				}else{
					alert(JSON.stringify(json));
				}
				mask.hide();
				
			 });
			//  weixinShare();
			 this.attachEvents();
		 },
		 
		
		 
		 setServiceTime: function(datetime){
			 this.data.service_time = datetime;
			 //target.one('.item-content').html(datetime);
			 S.all('[name=service_time] .item-content').html(datetime);
		 },
		 
		 attachEvents : function(){
			var body = S.one(document.body);
			var me = this;
			
			body.delegate('click tap', '[action=showServiceTimeModal]:not([disabled])', function(event){
				var target = S.one(event.currentTarget);
				target.attr('disabled', 'disabled');
				if(!me.serviceTimeModal){
					KISSY.use("app/widget/servicetime/ServiceTimeModal", function(S, ServiceTimeModal){
						 me.serviceTimeModal = new ServiceTimeModal({
							 param: {
								 product_id: me.data.product_id,
								 artisan_id: me.data.artisan.artisan_id
							 }
						 });
						 me.serviceTimeModal.show();
						 me.serviceTimeModal.on('hide', function(){
							 target.removeAttr('disabled');
						 });
						 me.serviceTimeModal.on('ok', function(datetime){
							me.setServiceTime(datetime);
						 });
					}); 
				}else{
					 me.serviceTimeModal.show();
				}
				return false;
			});
			
			body.delegate('click tap', '[action=buy_confirm]:not([disabled])', function(event){
				var button = S.one(event.currentTarget),
					enableButton = function(){
						button.removeAttr('disabled');
					};
				button.attr('disabled', 'disabled');
				
				var showBuyConfrimModal = function(onhide){
					if(!me.buyConfirmModal){
						S.use("app/product/mods/BuyConfirmModal", function(S, BuyConfirmModal){
							me.buyConfirmModal = new BuyConfirmModal({data: me.data});
							me.buyConfirmModal.show();
							me.buyConfirmModal.setServiceTime(me.data.service_time);
							me.buyConfirmModal.on('hide', onhide);
						});
					}else{
						me.buyConfirmModal.show();
						me.buyConfirmModal.setServiceTime(me.data.service_time);
					}
				};
				
				if(!needLogin || app.isLogined()){
					showBuyConfrimModal(enableButton);
				}else{
					KISSY.use("app/login/mods/LoginModal, css/login.css", function(S, LoginModal, loginCss){
						if(!me.loginModal){
							me.loginModal = new LoginModal();
							me.loginModal.on('hide', enableButton);
							me.loginModal.on("loginsuc", function(){
								me.loginModal.off('hide', enableButton);
								showBuyConfrimModal(enableButton);
								me.loginModal.hide();
							});
						}
						me.loginModal.show();
						
					});
				}
				return false;
			});
			
			body.delegate('click tap', '[action=report]:not([disabled])', function(event){
				var button = S.one(event.currentTarget),
					enableButton = function(){
						button.removeAttr('disabled');
					};
					
				button.attr('disabled', 'disabled');
				
				var afterLogined = function(fun){
					
					var  user = app.getSessionUser();
					
					var order = {
						reserve_time: me.data.product_ext_info_multiple.service_start_time,
						service_time: me.data.product_ext_info_multiple.service_start_time,
					};
					
					var product = me.data;
					var artisan =  product.artisan;
					artisan.artisan_name = artisan.name;
					delete artisan.name;
					artisan.artisan_avatar = product.artisan.avatar;
					S.mix(order, artisan);  
					
					
					product.product_pic = product.pics[0];
					delete product.artisan;
					S.mix(order, product);  
					
					order.service_addr = {
						location: me.data.product_ext_info_multiple.address,
						city: app.getCityByName(artisan.city)
					};
					order.address=order.service_addr.location;
					
					if(user){
						order.user_name = user.nick;
						order.user_mobile = user.mobile;
						user.order = order;
						app.setSessionUser(user);
					}
					
					console.log('me.order==', me.order);
					fun && fun();
					
					//new
					/*if(app.isMicroMessenger()){
					   location.href= app.config.zmwHost + "/hlj_wx/hlj/auth4H5";
					}else{
						location.href="../order/orderConfirm.html";
					}*/
					
					//old
					
					var _param = {
						product_id: order.product_id,
						reserve_time: order.service_time,
						address: order.service_addr,
						service_address_type: "home",
						city: order.city
					};
					
					location.href= app.config.zmwHost + "/hlj_wx/hlj/createOrder?"+encodeURI(encodeURI(decodeURIComponent(S.param(_param))));
				
				};
				
				
				if(!needLogin || app.isLogined()){
					afterLogined(enableButton);
				}else{
					KISSY.use("app/login/mods/LoginModal, css/login.css", function(S, LoginModal, loginCss){
						if(!me.loginModal){
							me.loginModal = new LoginModal();
							me.loginModal.on('hide', enableButton);
							me.loginModal.on("loginsuc", function(){
								me.loginModal.off('hide', enableButton);
								afterLogined(enableButton);
							});
						}
						me.loginModal.show();
					});
				}
				
				return false;
			});
		 }
	 };
	 
}, {
	requires: [
	           'dom',
	           'node', 
	           "xtemplate", 
	           "mui/datalazyload/index",
	           "mui/slider/index",
	           "UFO/mask/LoadingMask",
	           "../../action/Action",
	           "../../util/XTemplateUtil", 
	           "../../app",
	           "../tpl/product-tpl"
	           
	          ]
});
