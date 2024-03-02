KISSY.add(function(S, Node, DOM, XTemplate,InputFileButton, Container, ActionSheet, Modal,
		LoadingAnimMask, EditTextPanel, Action, ArtisanProductsModal, ShopStore, app){
	
	
	var params = app.getParam(),
		artisanId = params.artisan,
		city = params.city || '110100';
		
	if(app.isApp() && !app.isAdroidApp()){
		S.one(document.body).addClass('app');
	}
	var tpl = new XTemplate([
	           ' <div class="shop-decorate main" style="">',
	           '    <header class="bar-love header bar">',
	           '	   	<a class="button button-clear back-button icon icon-back" href="javascript:history.go(-1);"></a>',
	           '	   	<h1 class="title">',
	           '	   		{{title}}',
	           '	   	</h1>',
	           '		<div class="buttons buttons-right" style="-webkit-transition-duration: 0ms; transition-duration: 0ms;">',
			   '			<button class="button button-clear" action="preview"> 保存并预览</button>',
			   '    	</div>',
	           '    </header>',
	           '	<div class="content has-header has-footer">',
	           '		<div class="editor"></div>',
	           '	</div>',
	           '    <footer class="footer flex">',
	           '		<a class="col button button-insert-text" href="javascript:;">',
	           '         	<img src="../resources/images/add_text.png"> ',
	           ' 			<label>添加文字</label>',
	           '        </a>',
	           '		<a class="col button button-insert-img" href="javascript:;">',
	           '        	<img src="../resources/images/add_img.png"> ',
	           '         	<label>添加图片</label>',
	           '			<input type="file" multiple="multiple" accept="image/*;capture=camera" name="uploadImage" class="upload-image"/>',
	           '      	</a>',
	           '    </footer>',
	           ' </div>',
	           ].join(''));
	
	
	var shopContentTpl = new XTemplate([		
	    '		{{#each this}}',
		'			{{#if values.type==="text"}}',
		'				<p class="text">{{values.content}}</p>',
		'			{{/if}}',
		'			{{#if values.type==="image"}}',
		'				<p class="img">',
		'					',
		'					<img width="100%" {{#if values.content}} src="http://hlj-img.b0.upaiyun.com/zmw/{{values.content}}" {{else}} src="{{values.url}}" {{/if}}>', 
		'					',
		'					{{#if values.link}}',
		'					<i class="icon iconfont icon-link" data-link="{{values.link}}">&#xe616;</i>',
		'					{{/if}}',
		'				</p>',
		'			{{/if}}',
		'		{{/each}}'].join(""));
	
	function ShopDecoratePanel(){
		ShopDecoratePanel.superclass.constructor.apply(this, arguments);
	}
	
	KISSY.extend(ShopDecoratePanel, Container);	
	KISSY.augment(ShopDecoratePanel, {
	 
		initComponent: function(){
			var me = this;
			this.el = S.all(tpl.render({
				title: this.title || "店铺装修"
			}));
			this.scrollView = document.body;
			this.header = this.el.one('.header');
			this.footer = this.el.one('.footer');
			this.editor = this.el.one('.editor');
			this.previewButton = this.el.one('.button[action=preview]');
			this.createHeader && this.setHeader(this.createHeader());
			this.setStore('shopstore');
			
			ShopDecoratePanel.superclass.initComponent.apply(this, arguments);
			this.taskCount = 0;
			this.init();
		},
		setStore: function(store){
			if(S.isString(store) || S.isPlainObject(store)){
				this.store = UFO.create(store);
			} 
		
		},
		init: function(){
			var me = this;
			this.store.load(artisanId);
			
		},
		
		setTitle: function(title){
			this.header.one('.title').html(title);
		},
		
		setHeader: function(header){
			this.header.html('');
			this.header.append(header);
		},
		 
		getBodyContainer: function(){
			return this.el.one('.content');
		},
		removeTask: function(){
			this.taskCount--;
			if(this.taskCount === 0){
				this.previewButton.removeAttr('disabled');
			}
			
		},
		addTask: function(){
			this.taskCount++;
			this.previewButton.attr('disabled', 'disabled');
		},
		
		/**
		 * 
		 * @param index
		 * @param model
		 * @param pname
		 * @param pvalue
		 */
		update: function(index, model, pname, pvalue){
		//	console.log('update', index, pname, pvalue);
			var p = this.editor.one('p:nth-child('+(index+1)+')');
			if(model.get('type')=='text' && pname=='content'){
				p.html(model.get('content'));
			}else if(model.get('type')=='image' && pname=='link'){
				var link = p.one('i.icon-link');
				//console.log('link', link);
				if(!link){
					p.append('<i class="icon iconfont icon-link" data-link="'+pvalue+'"></i>');
				}else{
					link.attr('data-link', pvalue);
				}
			}
			
			this.storeInLocal();
		},
		
		remove: function(index){
			this.editor.one('p:nth-child('+(index+1)+')').remove();
			this.storeInLocal();
		},
		
		/**
		 * data: Object || Array
		 */
		insert: function(data, index){
			if(index === undefined || index === null){
				this.editor.append(shopContentTpl.render(data));
			}else{
				//this.editor.one('p:nth-child('+index+')').insertAfter();
				S.one(shopContentTpl.render(data)).insertAfter(this.editor.one('p:nth-child('+(index)+')'));
			}
			
		},
		
		insertImageAfter: function(file, index){
			if(index===undefined || index===null){
				index = this.store.getSize()-1;
			}
			this.insertImage(file, index+1);
		},
		
		insertImage: function(file, index){
			//console.log('url==', url);
			if(file.length){
				for(var i = 0, len = file.length; i<len; i++){
					this.insertImage(file[i],(index ===undefined || index === null)? undefined : index+i);
				}
				return;
			}
			this.addTask();
			if(index===undefined || index===null){
				index = this.store.getSize();
			}
			var me = this,
				url = file;
			
			//this.addTask();
			
			if(!S.isString(file)){
				url = URL.createObjectURL(file);
			}	
			 
			var append = (index===undefined || index===null) ;
			this.store.insert({
				type: 'image',
				url: url
			}, append ? undefined : index);
			
			var p = append ? this.editor.one('p:last-child') : this.editor.one('p:nth-child('+(index + 1)+')');
			
			var mask = new LoadingAnimMask({
				maskTarget: p
			});
			mask.show();
			
			 
			Action.postFormData({
				data:{pic: file} ,
				url: '/v2/upload_image',
				success: function(json){
					//var json = JSON.parse(evt.currentTarget.response);
					if(json.ret){
						if(append){
							me.store.getLast().set('content', json.imageurl);
						}else{
							me.store.getAt(index).set('content', json.imageurl);
						}
						
						me.storeInLocal();
						mask.hide();
					}else{
						console.error(json.msg);
						mask.setMaskBody('<span>出错了!</span>');
						if(append){
							me.store.getLast().set('content', "#");
						}else{
							me.store.getAt(index).set('content', "#");
						}
					}
					me.removeTask();
				},
				error: function(json){
					//var json = JSON.parse(evt.currentTarget.response);
					if(append){
						me.store.getLast().set('content', "#");
					}else{
						me.store.getAt(index).set('content', "#");
					}
					mask.setMaskBody('<span>出错了!</span>');
					me.removeTask();
				}
			});
			 
		},
		
		insertText: function(text, index){
			this.store.insert({
				type:'text',
				content: text
			}, (index===undefined || index===null) ? undefined : (index+1) );
			this.storeInLocal(); 
		},
		
		/**
		 * 设置作品链接
		 * @param p
		 */
		setLinkOfProduct: function(p){
			var me = this,
				index = this.editor.all('p').index(p);
			
			if(!me.artisanProductsModal){
				me.artisanProductsModal = new ArtisanProductsModal();
				if(app.isApp() && !app.isAdroidApp()){
					me.artisanProductsModal.getModal().addClass("app");
				}
				me.artisanProductsModal.load({
					city: city,
					artisan_id: artisanId
				});
				me.artisanProductsModal.on('ok', function(link, index){
					me.store.getAt(index).set('link', link);
				});
			}
			me.artisanProductsModal.reset();
			me.artisanProductsModal.set('index', index);
			me.artisanProductsModal.slideIn();
			
		},
		/**
		 * 显示文字输入modal
		 * @param index
		 * @param action
		 */
		showTextInputModal: function(index, action){
			var me = this;
			if(!me.addTextModal){
				me.editTextPanel = new EditTextPanel();
				me.addTextModal = new Modal({
					animation:'slide-in-up',
					items:[
					    me.editTextPanel
					]
				});
				
				if( app.isApp() && !app.isAdroidApp()){
					me.addTextModal.getModal().addClass('app');
				}
				
				me.addTextModal.on('hide', function(){
					me.removeClass('disable-scroll');
					me.scrollView.scrollTop = me.addTextModal.get('preScrollTop');
					//me.css('top', '');
				});
				me.addTextModal.on('beforeshow', function(){
					me.addClass('disable-scroll');
				});
				me.editTextPanel.on('back', function(){
					me.addTextModal.slideOut();
				});
				me.editTextPanel.on('ok', function(text, index, action){
					if(action == "update"){
						 me.store.getAt(index).set('content', text);
					}else{
						me.insertText(text, index);
					}
					
					me.addTextModal.slideOut();
				});
			}
			me.addTextModal.set('preScrollTop', me.scrollView.scrollTop);
			me.editTextPanel.setIndex(index);
			me.editTextPanel.set('action', action);
			
			if(action == 'update'){
				var model = me.store.getAt(index);
				me.editTextPanel.setText(model.get('content'));
			}else{
				me.editTextPanel.clear();
			}
			
			me.addTextModal.slideIn();
		},
		
		storeInLocal: function(){
			localStorage.setItem(artisanId+"shopdata", JSON.stringify(this.store.getOriginalData()));
		},
		
		//handle
		handleRemoveBtnClick: function(p, cmp, e){
			this.store.remove(this.editor.all('p').index(p));
		},
		
		handleInserTextButtonClick: function(){
			this.showTextInputModal();
		},
		handleInsertTextAfterBtnClick: function(p, cmp, e){
			this.showTextInputModal( this.editor.all('p').index(p));
		},
		handleEditTextBtnClick: function(p, cmp, e){
			this.showTextInputModal( this.editor.all('p').index(p), 'update');
		},
		handleAddImgButtonClick: function(event){
			this.insertImage(event.currentTarget.files);
		},
		handleInsertImgAfterBtnClick: function(p, cmp, event){
			//var file = event.currentTarget.files[0];
			this.insertImageAfter(event.currentTarget.files[0],  this.editor.all('p').index(p));
		//	console.log('handleInsertImgAfterBtnClick', cmp.getValue(), e);
		},
		handleSetLinkBtnClick: function(p){
			this.setLinkOfProduct(p);
		},
		 
		
		 
		addCmpEvents: function(){
			var me = this;
			
			this.el.delegate('click', '.editor p.text', function(event){
				var p = event.currentTarget;
				var editTextActionSheet = new ActionSheet({
					items:[
						{
							text:'编辑文字',
							handler: function(cmp, e){
								me.handleEditTextBtnClick(p, cmp, e);
							}
						},{
							text:'在下方添加文字',
							handler: function(cmp, e){
								me.handleInsertTextAfterBtnClick(p, cmp, e);
							}
						},{
							type:'inputfilebutton',
							text:'在下方添加图片',
							multiple: true,
							/*handler: function(){
								editTextActionSheet.hide();
								return false;
							},*/
							change: function(cmp, e){
								me.handleInsertImgAfterBtnClick(p, cmp, e);
							}
						},{ 
							text:'删除文字',
							handler: function(cmp, e){
								me.handleRemoveBtnClick(p, cmp, e);
							}
						}]
				});
				editTextActionSheet.slideIn();
			});
			this.el.delegate('click', '.editor p.img', function(event){
				var p = event.currentTarget;
				var editImgActionSheet = new ActionSheet({
					items:[
						{
							text:'配置跳转商品',
							handler: function(cmp, e){
								me.handleSetLinkBtnClick(p, cmp, e);
							}
						},{
							text:'在下方添加文字',
							handler: function(cmp, e){
								me.handleInsertTextAfterBtnClick(p, cmp, e);
							}
						},{
							 
							type:'inputfilebutton',
							text:'在下方添加图片',
							/*handler: function(){
								editImgActionSheet.hide();
								return false;
							},*/
							multiple: true,
							change: function(cmp, e){
								me.handleInsertImgAfterBtnClick(p, cmp, e);
							}
						},{
							text:'删除照片',
							handler: function(cmp, e){
								me.handleRemoveBtnClick(p, cmp, e);
							}
						}]
				});
				editImgActionSheet.slideIn();
			});
			
			
			this.el.delegate('change', 'input[type=file].upload-image', function(event){
				//console.log(event.currentTarget.files);
				//console.log(files);
				me.handleAddImgButtonClick(event);
				 
			});
			
			this.el.delegate('click', "a.button-insert-text", function(event){
				me.handleInserTextButtonClick(event);
			});
			//预览
			this.el.delegate('click', 'button[action=preview]:not([disabled])', function(e){
				console.log('me.store.getOriginalData()', me.store.getOriginalData());
				me.storeInLocal();
				location.href="./index.html" + location.search +"&preview=1";
				return false;
			});
			 
			this.store.on('insert', function(data, index){
				me.insert(data, index);
			});
			
			this.store.on('remove', function(index){
				me.remove(index);
			});
			
			this.store.on('update', function(index, model, pname, pvalue){
				me.update(index, model, pname, pvalue);
			});
			this.store.on('change', function(){
				 
				
			});
			
			
		}
		
		 
		
	});
	
	return ShopDecoratePanel;
},{
	requires: [ "node", "dom", "xtemplate", 
	            "UFO/button/InputFileButton", 
	            "UFO/container/Container",
	            "UFO/actionsheet/ActionSheet.js", 
	            "UFO/modal/Modal.js", 
	            "UFO/mask/LoadingAnimMask.js", 
	            "./EditTextPanel",
	            "../../../action/Action", 
	            "./ArtisanProductsModal",
	            '../../store/ShopStore',
	            "../../../app"
	          ]
});
