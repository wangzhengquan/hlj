KISSY.add(function(S, Node, XTemplate,
		app, tpl){
	 
	var body = S.one(document.body),
		param = app.getParam(),
		isApp = app.isApp();
		
	return {
		init: function(){
			body.html(new XTemplate(tpl).render({
				isApp: isApp
			}));
			
			 S.one('.order-cancel-suc-content .button-back').on('click', function(event){
				 if(isApp){
					 location.href = "/zmw/v2/htmlParams?btnType=cancelSure";
				 }else{
					 location.href = decodeURIComponent(param.back_url);
				 }
				 
			 });
		}
	};
}, {
	requires: ['node', "xtemplate",  
	           "../../app",
	           "../tpl/order-cancel-suc-tpl"]
});