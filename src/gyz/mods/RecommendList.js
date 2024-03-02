KISSY.add(function(S, Node, DOM, Event, XTemplate, Component, Action, Lazyload, 
		MessageBox, app, XTemplateUtil, tpl, recommend_item_tpl,
		spinner_loading_small_tpl){
	var win = window;
	var loadingMoreMask = S.one(spinner_loading_small_tpl);
	function RecommendList(config){
		RecommendList.superclass.constructor.call(this, config);
	}
	
	S.extend(RecommendList, Component);
	
	UFO.augment(RecommendList, {
		alias: 'recommendList',
		
		initComponent: function(){
			this.el = S.one(tpl);
			this.recommendList = this.el.one('ul');
			
			this.scrollView = this.el;
			this.scrollViewDom = this.scrollView.getDOMNode();
			RecommendList.superclass.initComponent.apply(this, arguments);
		},
		
		/**
		 * 计算作品图片大小
		 * @param cb
		 */
		calcImgSize: function(cb){
			var productImgWidth = this.productImgWidth = this.recommendList.width(),
				productImgHeight = this.productImgHeight = this.productImgWidth*224/300;
			 
			 
			if(!productImgWidth){
				setTimeout(function(){
					calcImgSize(cb);
				}, 2000);
			}else{
				cb && cb(productImgWidth, productImgHeight);
			}
		 
		},
		
		/**
		 * 设置作品图片大小
		 * @param cb
		 */
		setImgSize: function(cb){
			var me = this;
			this.calcImgSize(function(width, height){
				me.el.all('.recommend-list .card .img-wrapper').css({
					width: width,
					height: height
				});
				
				me.el.all('.recommend-list .card .img-wrapper > img').css({
					'min-width': width,
					'min-height': height
				});
				
				cb && cb();
			});
		},
		
		appendLoadingMoreSpinner: function(){
			this.recommendList.append(loadingMoreMask);
		},
		
		removeLoadingMoreSpinner: function(){
			loadingMoreMask.remove();
		},
		
		load: function(params, suc){
			var me = this;
			params.offset = 0;
			this.params = params;
			this.query(params, function(loadFinished){
				me.setImgSize(function(){
					me.actInview();
				});
				if(!loadFinished){
					me.addScrollListener();
				}
				suc && suc(loadFinished);
			});
		},
		
		loadMore: function(suc){
			console.log('loadmore-----');
			var me = this;
			var params = this.params;
			params.offset = params.offset + params.page_size;
			this.query(params, function(loadFinished){
				me.actInview();
				suc && suc(loadFinished);
			});
		},
		
		query: function(params, suc, error){
			var me = this;
			me.appendLoadingMoreSpinner();
			params = this.params = (params || this.params);
			// http://apppub.helijia.com/zmw /v2/beautiful_recommend 
			Action.query('/v2/beautiful_recommend', params, function(json){
				console.log('query', json);
				 
				me.removeLoadingMoreSpinner();
				if(json.ret){
					me.recommendList.append(new XTemplate(
							recommend_item_tpl,
							{
								commands:{
									'getImgAbsolutePath': function (scopes, option) {
					                	return app.config.imgBaseUrl+option.params[0];
					                },
					                'getProductHref': function (scopes, option) {
					                	var product_id = option.params[0];
					                	
					                	return 'http://www.helijia.com/#/product/'+product_id;
					                }
					                
								}
							}
						).render({
							list: json.data, 
							productImgWidth: me.productImgWidth, 
							productImgHeight: me.productImgHeight 
						}));
				
					 
					suc && suc(json.data.length < params.page_size);
				}else{
					error && error();
					console.error('error', json);
				}
			}, function(msg){
				me.removeLoadingMoreSpinner();
				error && error();
				console.log('msg', msg);
			});
		},
		
		actInview: function(){
			var me = this;
			//图片
			if(!me.imgLazyLoad){
				me.imgLazyLoad = new Lazyload({
	                container: me.scrollView,
	                autoDestroy: false
	            });
			}else{
				console.log('container==',me.imgLazyLoad.get('container'));
				me.imgLazyLoad.addElements(me.imgLazyLoad.get('container'));
				me.imgLazyLoad.refresh();
			}
			
			//标签进入可视区动画
			if(!me.labelLazyload){
				me.labelLazyload = new Lazyload({
                    container: me.scrollView,
                    autoDestroy: false,
                    type: 'div'
                });
			}
			
			me.labelLazyload.clear();
			 
			var els = DOM.query('.recommend-list .card .img-wrapper .product-label');
			S.each(els, function (el) {
				me.labelLazyload.addCallback(el, function(el){
					DOM.addClass(el, 'inview');
					
					//console.log('in el', el);
					return false;
				}, function(el){
					DOM.removeClass(el, 'inview');
					
					//console.log('out el', el);
				});
			});
		},
		
		 
		 
		addCmpEvents: function(){
			var me = this;
			
			/**
			 * 滚动条事件
			 */
			this.addScrollListener = function(){
				Event.on(me.scrollViewDom, 'scroll', scrollHandler);
			};
			
			this.removeScrollListener = function(){
				Event.detach(me.scrollViewDom, 'scroll', scrollHandler);
			};

			var scrollHandler = function(e){
				if((me.scrollViewDom.scrollTop + me.scrollViewDom.clientHeight + win.innerHeight>=  me.scrollViewDom.scrollHeight)){
					me.removeScrollListener();
					me.scrollViewDom.scrollTop =  me.scrollViewDom.scrollTop + 28;
					me.loadMore(function(loadFinished){
						if(!loadFinished){
							me.addScrollListener();
						}
					});
				}
				
			};
			
			
			
			this.el.delegate('click', 'a.card', function(event){
				var product_id = S.one(event.currentTarget).attr('data-product_id');
				if(app.isApp()){
					location.href = 'http://www.helijia.com/#/product/'+product_id;
				}else{
					location.href = "../product/index.html?product_id="+product_id;
				}
				return false;
			});
			
			Event.on(win, "resize", function(event){
				me.setImgSize();
			});
			
			
		}
	 
	});
	
	return RecommendList;
}, {
	requires: ['node', 'dom', 'event', "xtemplate",  "UFO/Component",   
	           "../../action/Action",
	           "UFO/lazyload/Lazyload",
	           "UFO/popup/MessageBox",
	           "../../app",
	           "../../util/XTemplateUtil",
	           "../tpl/recommend-tpl",
	           "../tpl/recommend-item-tpl",
	           "../../tpl/spinner-loading-small-tpl"]
});
