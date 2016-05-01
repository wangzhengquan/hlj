KISSY.add(function(S, Node,Event, XTemplate, Component,
		MessageBox,
		Action, XTemplateUtil, 
		tpl, item_tpl,
		spinner_loading_small_tpl){
	var win = window;
	var itemTpl = new XTemplate(item_tpl);
	var loadingMoreMask = S.one(spinner_loading_small_tpl);

	function CommentList(config){
		CommentList.superclass.constructor.call(this, config);
	}
	
	S.extend(CommentList, Component);
	
	UFO.augment(CommentList, {
		alias: 'commentlist',
		
		initComponent: function(){
			var me = this;
			this.el = S.one(tpl);
			this.scrollView = this.el.getDOMNode();
			CommentList.superclass.initComponent.apply(this, arguments);
			this.load();
		},
		
		/**
		 * size:20,
	     * artisan_id: '6f40c6bf7b9e4008b26f5554f18626d8',
		 * offset:0,
		 * star:0
		 * @param param
		 */
		load: function(param){
			var me = this;
			
			this.param = param = param || this.param;
			param.offset = 0;
			param.size = 20;
			this.query(param, function(loadFinished){
				if(!loadFinished) me.addScrollListener();
					
			});
		},
		
		loadMore: function(cb){
			this.param.offset = this.param.offset + 20;
			this.query(this.param, cb);
		},
		 
		query: function(param, cb){
			var me = this;
			var timeout = S.later(me.appendLoadingMoreSpinner, 500, false, me)
			Action.query("/user/artisan_common_list.json", param , function(json){
				console.log('comment', json);
				timeout.cancel()
				me.removeLoadingMoreSpinner();
				if(json.result == 'ok'){
					me.getBodyContainer().append(itemTpl.render(json));
					cb && cb(json.comments.length < param.size);
				} 
			}, function(msg){
				me.removeLoadingMoreSpinner();
				//me.addScrollListener();
			});
		},
		
		appendLoadingMoreSpinner: function(){
			this.getBodyContainer().append(loadingMoreMask);
		},
		
		removeLoadingMoreSpinner: function(){
			loadingMoreMask.remove();
		},
		
		addCmpEvents: function(){
			var me = this;
			/**
			 * 滚动条事件
			 */
			var scrollHandler = function(e) {
				if(me.scrollView.scrollTop + me.scrollView.clientHeight + win.innerHeight + (47+60) >=  me.scrollView.scrollHeight){
					me.removeScrollListener();
					me.scrollView.scrollTop =  me.scrollView.scrollTop + (24+10);
					me.loadMore(function(loadFinished){
						if(!loadFinished){
							me.addScrollListener();
						}
					});
				}
			}
			
			this.addScrollListener = function(){
				Event.on(me.scrollView, 'scroll', scrollHandler);
			};
			
			this.removeScrollListener = function(){
				Event.detach(me.scrollView, 'scroll', scrollHandler);
			};
		}
	 
	});
	
	return CommentList;
}, {
	requires: [
       'node',
       'event',
       "xtemplate", 
       "UFO/Component", 
       "UFO/popup/MessageBox", 
       "APP/action/Action",
       'APP/util/XTemplateUtil',
       "../tpl/comment-list-tpl",
       "../tpl/comment-item-tpl",
       "APP/widget/tpl/spinner-loading-small-tpl"
       ]
});
