KISSY.add(function(S, Node, XTemplate, tpl, app){
	
	 return {
		 init: function(){
			 this.render();
		 },		 
		 render: function(){
			S.one(document.body).html(
			 new XTemplate(tpl).render({
				 isApp: app.isApp()
			 })
			);
		 }
	 }; 
}, {
	requires: ['node', "xtemplate", "../tpl/user-agreement-tpl", "../../app"]
});