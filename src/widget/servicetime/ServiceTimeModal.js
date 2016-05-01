KISSY.add(function(S, Node, XTemplate, Modal,
		Action, 
		UFODate,
		Cookie,
		tpl, day_cell_tpl, time_cell_tpl){
	 
	var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	var timeCellTpl = new XTemplate(time_cell_tpl);
	function ServiceTimeModal(config){
		
		ServiceTimeModal.superclass.constructor.call(this, config);
	}
	
	S.extend(ServiceTimeModal, Modal);
	
	UFO.augment(ServiceTimeModal, {
		
		initComponent: function(){
			 
			ServiceTimeModal.superclass.initComponent.apply(this, arguments);
			this.bar_day_inner = this.el.one('.bar-day-inner');
			this.time_wrapper = this.el.one('.time-wrapper');
			this.init();
		},
		
		createDateBar: function(data){
			var days = [];
		
			var i =0;
			for(var key in data){
				var that_day = new Date();
					that_day.setDate(that_day.getDate()+i);
				
				var	week_str = week[that_day.getDay()],
					day_str = UFODate.format(that_day, 'MM/dd');
				
				if(i===0){
					week_str = '今天';
				}else if(i===1){
					week_str = '明天';
				}
				
				days.push({
					key: key,
					day: day_str,
					week: week_str,
					value: UFODate.format(that_day, 'yyyy-MM-dd')
				});
				i++;
			}
			
			var width = this.el.one('.bar-day').innerWidth(),
				cell_width = width/7;
			
			this.bar_day_inner.width(cell_width*i + 65);
			this.bar_day_inner.html(new XTemplate(day_cell_tpl).render(days));
			this.bar_day_inner.all('li').css('width', cell_width+"px");  
		},
		
		init: function(){
			var me = this;
			
			Action.query('/v2/artisan_customer_date_list.json',{
				service:'artisan_customer_date_list_one',
				product_id: me.param.product_id,
				artisan_id: me.param.artisan_id
			}, function(json){
				console.log(json);
				if(json.ret){
					me.data = json.data;
					me.createDateBar(me.data);
					me.setActiveTab(0);
				}
				
			}, function(msg){
				alert('网络错误');
			});
		},
		
		createModal: function(){
			var isFirstTime = !Cookie.get('service_time_widget_used');
			if(isFirstTime){
				Cookie.set('service_time_widget_used', '1', 1);
			}
			isFirstTime = true;
			return new XTemplate(tpl).render({
				isFirstTime: isFirstTime
			});
		},
		
		renderTimeWrapperByKey: function(key, date){
			var me = this;
			me.time_wrapper.html(timeCellTpl.render({
				date: date,
				times: me.data[key]
			}));
			
			
		},
		
		setActiveTab: function(tab){
			var me = this;
			if(S.isNumber(tab)){
				tab = this.el.one('ul.bar-day-inner li:nth-child('+(tab+1)+') .button-day');
			}
			 
			var	key = tab.attr('data-key'),
				value= tab.attr('data-value');
			
			me.el.all('.button-day').removeClass('active');
			tab.addClass('active');
			me.renderTimeWrapperByKey(key, value);
		},
		
		addCmpEvents: function(){
			ServiceTimeModal.superclass.addCmpEvents.apply(this, arguments);
			
			var me = this;
			this.el.delegate('click tap', '.button-day', function(event){
				me.setActiveTab(S.one(event.currentTarget));
				return false;
			});
			this.el.delegate('click tap', '.time-cell:not([disabled])', function(event){
				var target =  S.one(event.currentTarget);
				me.el.all('.time-cell').removeClass('select');
				target.addClass('select');
				return false;
			});
			this.el.delegate('click tap', '.button-ok', function(event){
				 
				var datetime = 	me.el.one('.time-cell.select').attr('data-value');
				//alert(datetime);
				me.fire('ok', datetime);
				me.hide();
				return false;
			});
			
			var picTimeGuidEl = this.el.one('.pic-time-guid');
			if(picTimeGuidEl){
				picTimeGuidEl.on('click tap', function(){
					picTimeGuidEl.remove();
					return false;
				});
			}
			
			var handImg = this.el.one('.pic-time-hand');
			if(handImg){
				me.on('show', function(){
					handImg.addClass('hand-move');
				});
			}
		}
	 
	});
	
	return ServiceTimeModal;
}, {
	requires: ['node', 'xtemplate', 'UFO/modal/Modal',  '../../action/Action',
	           'UFO/core/lang/Date',
	           'cookie',
	           './tpl/service-time-tpl',
	           './tpl/day-cell-tpl',
	           './tpl/time-cell-tpl']
});