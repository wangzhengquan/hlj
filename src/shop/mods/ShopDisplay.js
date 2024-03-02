
KISSY.add(function(S, Node, XTemplate,Action, shopdisplay_tpl,ImageSlider,PhotoBrowserModal){
	var bind=function(){
		var p=S.one(".intro-cont");
		var btn=S.one(".view-more");
		if(p.height()<100){btn.hide();return;}
		p.height(100);
		
		
		var active=false;
		btn.on("click",function(){
			if(btn.hasClass("active")){
				p.css("height","100");
				btn.removeClass("active").text("查看更多").append("<i class='icon iconfont icon-expand'></i>");
			}else{
				p.css("height","auto");
				btn.addClass("active").text("点击收起").append("<i class='icon iconfont icon-expand icon-collapse'></i>");
			}
		})
		
	}	
	var imgSlide=function(arr){

		var imgData=[];
		for(var x=0;x<arr.length;x++){
			imgData.push({"url":app.config.imgBaseUrl+arr[x]})
		}
		//document.body.scrollTop = 100;
		var slider = new ImageSlider({
			data:imgData,
			autoSlide: false,
			loop: false
			 
		});
		slider.render(S.one('#imgArr'));
		var page=S.one(".slider-pagination");
		var w=page.children().length*20+20;
		page.css({
			"width": w + "px"
		});
		var photoModal;
		S.one("#imgArr").delegate('click', '.slider-img-zoom-container',function(event){
			var index= S.one(this).index();
			if(!photoModal){
				photoModal=new PhotoBrowserModal({
					animation: 'scale-in',
					data: imgData,
					defaultIndex: index,
					autoSlide: false,
					loop: false
				});
			}
			
			photoModal.setDefaultIndex(index);
			photoModal.show();

		});
		
		
	} 
	return {
		init: function(){
			S.one("body").delegate("click",".button-back",function(){
				history.go(-1);
			})
			var param = S.unparam(decodeURIComponent(location.search.slice(1)));
			var store_serial=param.store_serial;
			var isApp=param.isApp;
			
			Action.query("/v2/store_detail",{"store_serial":store_serial},function(data){
			//Action.query2("http://test.stg.helijia.com/zmw/v2/store_detail?store_serial=MD159sr00000",{},function(data){
				if(!data.ret){
					alert(data.msg);
					// alert("请求出错了!");
					// history.go(-1);
					return;
				}
				data.data.isApp=(isApp=="true");
				var tpl = new XTemplate(shopdisplay_tpl, {}).render(data.data);
				S.one('body').html(tpl);
				bind();
				imgSlide(data.data.images);
			},function(data){
				console.log(data);
				
				alert("请求出错了!");
				// history.go(-1);
			});
		}
	};
},{
	requires: [ 
	   "node", "xtemplate",
		  "../../../action/Action", 
		 "../../tpl/shopdisplay-tpl","UFO/slider/ImageSlider",
		 'UFO/modal/PhotoBrowserModal'
	]
});
