KISSY.add(function(S, Action, Storage, app){
	return {
		 
		getVerifyCode: function(params, success, error){
			alert("您的验证码是：123456")
			// return Action.query("/v2/get_verify_code", params, success, error);
		},
		
		/**
		 * 登录
		 * @param params
		 * @param success
		 * @param error
		 * @returns
		 */
		login: function(params, success, error){
			return Action.query("/v2/verify_mobile.json" ,params, function(json){
			   
			   if(json.ret){
				   var user = app.getSessionUser();
				 //  console.log('before', user);
				   if(user){
					   S.mix(user, json.data);
				   }else{
					   user  = json.data;
				   }
				   if(user.user_address){
					   for(var i=0,len=user.user_address.length;i<len;i++){
						   user.user_address[i].city = app.getCity(user.user_address[i].city);
					   }
				   }
				   user.mobile = params.mobile;
				   app.setSessionUser(user);
				   success && success(user);
			   }else{
				   alert('登录失败');
				   error && error();
			   }
			  
		   });
		}
	 
	
	};
	
},{
	requires: ['./Action','UFO/util/Storage', '../app']
});