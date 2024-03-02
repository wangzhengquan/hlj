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
KISSY.add(function(S, Node,  Event, XTemplate, Container, 
		MapUtil, 
		Action, 
		app,
		tpl,
		ServiceAddrModal){
	 
	function ShowListFrame(){
		ShowListFrame.superclass.constructor.apply(this, arguments);
	}
	
	KISSY.extend(ShowListFrame, Container);	
	//jump_type=pros_arts&city=110100
	//name%3D美甲%26city%3D110100
	KISSY.augment(ShowListFrame, {
	 
		initComponent: function(){
			var me = this;
			this.el = S.all(new XTemplate(tpl).render({
				title: this.title || "",
				hasFooter: this.config.hasFooter
			}));
			this.scrollView = document.body;
			this.header = this.el.one('.header');
			this.footer = this.el.one('.footer');
			this.items = this.createContent();
			this.createHeader && this.setHeader(this.createHeader());
			 
			ShowListFrame.superclass.initComponent.apply(this, arguments);
		},
		
		setTitle: function(title){
			this.header.one('.title').html(title);
			//console.log('head title==', S.one('head title'));
			S.one('head title').html(title);
		},
		
		setHeader: function(header){
			this.header.html('');
			this.header.append(header);
		},
		 
		getBodyContainer: function(){
			return this.el.one('.content');
		},
		
		addScrollListener: function(){
			Event.on(window, 'scroll', this.scrollHandler);
			//this.scrollView.on('scroll', this.scrollHandler);
		},
		
		removeScrollListener: function(){
			Event.detach(window, 'scroll', this.scrollHandler);
			//this.scrollView.detach('scroll', this.scrollHandler);
		}, 
		//定位商圈
		locationBusinessDistrict: function(suc, error){
			var me = this;
			var defer = S.Defer();  
			MapUtil.getCurrentPosition().then(function(position){
				if(!me.city ){
					me.setCity(app.getCityByName(position.address.city));
					
				}
				if( position.address.city ==  me.city.name){
					return me.getBusinessDistrict(position)
				}else{
					return false;
				}
				
			}).then(function(district_ids){
				console.log('locationBusinessDistrict arguments==',  district_ids);
				
				suc && suc(district_ids);
				defer.resolve(district_ids);
			}, function(msg){
				
				error && error(msg);
				defer.reject(msg);
			});
			return defer.promise;
		},
		
		getBusinessDistrict: function(position, suc, error){
			var defer = S.Defer();  
			var me = this;
			if(!position){
				suc && suc();
				defer.resolve();
				return defer.promise;
			}
			if(position.address && !S.isString(position.address)){
				position.city =  position.address.city;
				position.address = position.address.city.concat(position.address.street).concat(position.address.street_number);
			} 
			
			if(position.point){
				Action.query("/resources/data/exchange.json", {
					city: me.city.code,
					longitude: position.point.lng * 10e7,
					latitude:  position.point.lat * 10e7
				}, function(json){
					var district_ids = json.data;
				//console.log('district_ids', district_ids);
					if(district_ids && district_ids.length > 0){
						me.setPosition(position);
					}
					else{
						me.setFooterText("选择的位置超出服务范围，请重新选择"); 
					}
					suc && suc(district_ids);
					defer.resolve(district_ids);
					
				}, function(msg){
					console.error('error', msg);
					me.setFooterText("设置服务地址失败"); 
					error && error(msg);
					defer.reject(msg);
				});
			}else{
				suc && suc();
				defer.resolve();
			}
			
			return defer.promise;
		},
		
		setFooterText: function(val){
			this.el.one('.footer [name=address]').html(val);
		},
		 
		setCity: function(city){
			this.city = city;
		},
		setPosition: function(position){
			
			this.position = position;
			if(position){
				this.setFooterText(position.address.concat(position.title ? position.title : "").concat(position.addrDetail ? position.addrDetail : ""));
			}
			app.setPosition(position);
			
		},
		addCmpEvents: function(){
			var me = this;
			 
			this.el.delegate('click', 'a[name=set_location]:not([disabled])', function(event){
				 var target = S.one(event.currentTarget);
				 target.attr("disabled", "disabled");
				//me.css('top', (-body.scrollTop)+"px");
				if(!me.serviceAddrModal){
					me.serviceAddrModal = new ServiceAddrModal({allowBlank: false});
					me.serviceAddrModal.on('hide', function(){
						me.addScrollListener && me.addScrollListener();
						target.removeAttr("disabled");
					});
					me.serviceAddrModal.on('beforeshow', function(){
						me.removeScrollListener && me.removeScrollListener();
					});
					
					me.serviceAddrModal.on('ok', function(addr){
						//console.log('addr==', addr);
						me.getBusinessDistrict(addr).done(function(district_ids){
							me.fire('changeDistrict', district_ids);
						});
					});
					
					if( me.position){
						me.serviceAddrModal.setPosition(me.position);
					}else{
						//alert(me.city.name);
						me.serviceAddrModal.set('city', me.city.name);
					}
					me.serviceAddrModal.show();
				} else {
					me.serviceAddrModal.show();
				}
				
				
			});
			
			this.el.delegate('click', 'a[name=refresh_location]', function(event){
				me.locationBusinessDistrict().then(function(district_ids){
					me.fire('changeDistrict', district_ids);
					
				});
			});
			
			me.el.delegate('click', '.back-button', function(){
				me.fire('clickbackbutton');
			});
		}
		
	});
	
	return ShowListFrame;
},{
	requires: [ "node", "event", "xtemplate", 
	            "UFO/container/Container",
	            "APP/util/MapUtil",
	            "APP/action/Action",
	            "APP/app",
	            "../tpl/showlist-frame-tpl",
							"APP/widget/serviceaddr/ServiceAddrModal"
	          ]
});
