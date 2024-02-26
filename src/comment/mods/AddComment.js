/**
 * http://172.16.116.219:8081/src/APP/comment/addComment.html?artisan_id=9e7199db91984a63b510a872c3a632f0&order_id=2263641&order_number=151125171439698&comment_id=744a9350d634435aa34e8849f4974e18
 */
KISSY.add(function(S, Node, XTemplate,FormUtil, MainViewport, XTemplateUtil, Action, tpl, app){
	var param = app.getParam(),
		artisan_id = param.artisan_id;
	
	function AddComment(config){
		config = S.mix({
			cls: 'background',
			title: '发表评价',
			leftButtons: [{
				cls:'button-back',
				iconCls: 'icon-back',
				href:'javascript:history.go(-1);'
			}],
			rightButtons: [{
				cls: 'button-clear',
				attributes:{
					action: 'publish'
				},
				text:'发表'
			}]
		}, config, true);
		AddComment.superclass.constructor.call(this, config);
		
	}
	
	S.extend(AddComment, MainViewport);
	
	S.augment(AddComment, {
		
		initComponent: function(){
			 
			AddComment.superclass.initComponent.apply(this, arguments);
			this.init();
		},
		
		init: function(){
			var me = this;
			var data = {
				stars:[0,1,2,3,4]
			};
			if(param.comment_id){
				Action.query("/v2/order_detail", {
					comment_id: param.comment_id,
					order_id: param.order_id
				}, function(json){
					console.log("order_detail", json);
					data.data = json.data;
					data.data.photos = S.mix(new Array(3), data.data.photos);
					me.getBodyContainer().html(new XTemplate(tpl).render(data));
					
				});
			}else{
				data.data = {
					score_skill: 0,	
					score_communication: 0,
					score_punctuality:0,
					photos: new Array(3)
				};
				this.getBodyContainer().html(new XTemplate(tpl).render(data));
			}
			
		},
		
		addCmpEvents: function(){
			var me = this;
			AddComment.superclass.addCmpEvents.apply(this, arguments);
		 
			
			this.el.delegate('click', '.star-wrapper .button-star', function(event){
				var target = S.one(event.currentTarget),
					star_wrapper = target.parent(".star-wrapper"),
					item_star = star_wrapper.parent(".flex-item"),
					score_ele = item_star.one('.score'),
					button_star_arr = star_wrapper.all('.button-star'),
					index = target.index()+1;
				//alert(index);
				score_ele.html(index);
				score_ele.attr("data-value", index);
				for(var i=0; i<index;i++){
					button_star_arr.item(i).addClass('active');
				}
				for(var i=index, len=button_star_arr.length; i<len; i++){
					button_star_arr.item(i).removeClass('active');
				}
			});
			
			this.el.delegate('change', 'input[type=file]', function(event){
				
				var target = S.one(event.currentTarget),
					file = event.currentTarget.files[0],
					url = URL.createObjectURL(file),
					button_add_pic = target.parent('.button-add-pic'),
					index = button_add_pic.index();
				target.parent(".button-add-pic").one('.pic').html('<img src="'+url+'">');
				console.log("file==", file);
			});
			
			/**
			 * 上传评论图片
			 */
			var append_comment_pic = function(comment_id, file, cb){
				Action.postFormData('/user/append_comment_pic', {
					artisan_id: param.artisan_id,
					comment_id: comment_id,
					pic: file
				}, function(json){
					console.log("append_comment_pic", json);
					cb && cb();
				});
			};
			
			/**
			 * 提交评论
			 */
			var submit_comment = function(record){
				/*var input_file_els = me.el.all("input[type=file]");
				for(var i=0, len=input_file_els.length; i<len;i++){
					var input_file_el = input_file_els.item(i);
					console.log("input_file_el", input_file_el.getDOMNode().files[0]);
				}*/
				Action.update('/user/submit_artisan_comment2', record, function(json){
					console.log("submit_artisan_comment2", json);
				
					var j=0;
					var input_file_els = me.el.all("input[type=file]");
					for(var i=0, len=input_file_els.length; i<len;i++){
						var input_file_el = input_file_els.item(i),
							file = input_file_el.getDOMNode().files[0];
						if(file){
							j++;
							append_comment_pic(json.comment_id, file, function(){
								if(--j === 0){
									setTimeout(function(){
										//history.go(-1);
									}, 1000);
								}
							});
						}
					}
				});
			};
			
			this.el.delegate("click", '.button[action=publish]', function(event){
				var record = FormUtil.getRecord(me.el.one('[name=comment-form]'));
				S.mix(record, {
					artisan_id: param.artisan_id,
					order_number: param.order_number,
				});
				
				if(param.comment_id){
					record.comment_id = param.comment_id;
				}
				console.log("record", record);
				submit_comment(record);
			});
		}
	 
	});
	
	return AddComment;
}, {
	requires: ['node', "xtemplate",  
	           "UFO/util/Form",
	           "../../viewport/mods/index", 
	           "../../util/XTemplateUtil", 
	           "../../action/Action",
	           "../tpl/add-comment-tpl",
	           "../../app"]
});
