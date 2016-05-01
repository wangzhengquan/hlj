KISSY.add(function(S, slideDemo){
	return {
		init: function(){
			console.log('index init');
			slideDemo.init();
		}
	}
},{
	requires: ["./slidedemo"]
});