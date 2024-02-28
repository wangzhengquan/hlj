/*
   position={
	   addrDetail: "",
	   address: "广州市天河区天河路208号天河城(北门)1层",
	   city: "广州市",
	   point{
	   	lat: 23.136192,
	  	lng: 113.332193
	   },
	   title: "三元桥"
  }
 */
KISSY.add(function(S, Node,  Event, XTemplate, Container, ArtisanList){
	 
	var tpl = new XTemplate([
	           ' <div>',
	           '    <header class="bar-love header bar">',
	           '	   	<a class="button button-clear back-button icon iconfont icon-back" href="javascript:history.go(-1);"> </a>',
	           '	   	<h1 class="title">',
	           '	   		{{title}}',
	           '	   	</h1>',
	           '    </header>',
	           '	<div class="content has-header">',
	           '	</div>',
	           ' </div>',
	           ].join(''));
	function ArtisanListWithHeader(){
		ArtisanListWithHeader.superclass.constructor.apply(this, arguments);
	}
	
	KISSY.extend(ArtisanListWithHeader, Container);	
	
	UFO.augment(ArtisanListWithHeader, {
	 
		initComponent: function(){
			var me = this;
			this.scrollView = document.body;
			this.el = S.all(tpl.render({
				title: this.title || ""
			}));
			this.header = this.el.one('.header');
			this.footer = this.el.one('.footer');
			this.items = this.artisanList = UFO.create('artisanlist', this.config);
			this.artisanList.on('beforeload', function( ){
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.removeScrollListener();
			});
			this.artisanList.on('afterload', function( ){
				//me.scrollView.setScrollIndicatorSizeAndPos();
				me.addScrollListener();
			});
			this.createHeader && this.setHeader(this.createHeader());
			
			 
			ArtisanListWithHeader.superclass.initComponent.apply(this, arguments);
		},
		doSearch: function(params){
			this.artisanList.load(params);
		},
		 
		
		setTitle: function(title){
			this.header.one('.title').html(title);
		},
		
		 
		getBodyContainer: function(){
			return this.el.one('.content');
		},
		
		addScrollListener: function(){
			Event.on(window, 'scroll', this.scrollHandler)
		},
		
		removeScrollListener: function(){
			Event.detach(window, 'scroll', this.scrollHandler);
			//this.scrollView.detach('scroll', this.scrollHandler);
		}, 
		 
		setCity: function(city){
			this.city = city;
		},
		
		addCmpEvents: function(){
			ArtisanListWithHeader.superclass.addCmpEvents.apply(this, arguments);
			var me = this;
		 
			me.scrollHandler = function(){
				//console.log('scroll', me.scrollView.scrollTop + me.scrollView.clientHeight);
				if(me.scrollView.scrollTop + me.scrollView.clientHeight + (47) >= me.scrollView.scrollHeight){
					me.removeScrollListener();
					if(!me.artisanList.loadFinished){
						var timeout = S.later(me.artisanList.appendLoadingMoreSpinner,  500, false, me.artisanList);
						// me.artisanList.appendLoadingMoreSpinner();
						me.scrollView.scrollTop =  me.scrollView.scrollTop + (24+10);
						me.artisanList.loadMore(function() {
							timeout.cancel()
							me.artisanList.removeLoadingMoreSpinner();
							me.addScrollListener();
						});
					}
				}
			};
			 
		}
		
	});
	
	return ArtisanListWithHeader;
},{
	requires: [ "node", "event", "xtemplate", 
	            "UFO/container/Container",
	            "./ArtisanList"
	          ]
});
