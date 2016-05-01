KISSY.add("APP/action/Action", ["APP/app"], function(S, require, exports, module){
	var $ = S;
	var app = require("APP/app")
	return {

    query: function(url, params, success, error){
      console.log('query == ', url)
			var defer = S.Defer();
      if (url.indexOf('/home_config.json') >= 0) {
        KISSY.use('APP/data/home_config', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/banner_config.json') >= 0) {
        KISSY.use('APP/data/banner_config', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/exchange.json') >= 0) {
        KISSY.use('APP/data/exchange', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/products.json') >= 0 || url.indexOf('/get_artisan_products_six.json') >= 0 ) {
        KISSY.use('APP/data/products_list', function (S, products) {
          var json = products(url, params)
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/get_product_tags.json') >= 0) {
        KISSY.use('APP/data/products_tags', function (S, products_tag) {
          var json = products_tag(params)
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/product_detail.json') >= 0) {
        KISSY.use('APP/data/product', function (S, product) {
          var json = product(params)
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/artisan_customer_date_list.json') >= 0) {
        KISSY.use('APP/data/artisan_available_time', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/artisan_common_list.json') >= 0) {
        KISSY.use('APP/data/comments_list', function (S, comments_list) {
          var json = comments_list(params)
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/artisans.json') >= 0) {
        KISSY.use('APP/data/artisans_list', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/get_product_label_list.json') >= 0) {
        KISSY.use('APP/data/products_label_list', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/verify_mobile.json') >= 0) {
        KISSY.use('APP/data/verify_mobile', function (S, verify) {
          var json = verify(params)
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/orders.json') >= 0) {
        KISSY.use('APP/data/orders_list', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/order_detail.json') >= 0) {
        KISSY.use('APP/data/order', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/cancel_reason.json') >= 0) {
        KISSY.use('APP/data/order_cancel_reason', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      }
      else if (url.indexOf('/artisan_detail.json') >= 0) {
        KISSY.use('APP/data/artisan', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      } 
			else if (url.indexOf('/v2/store_detail') >= 0) {
        KISSY.use('APP/data/shop', function (S, json) {
          success(json)
          defer.resolve(json);
        })
      } 
			
      else {
        console.error("XMLHttpRequest error: ", app.config.baseUrl+url+"?"+S.param(params))
      }

      return defer.promise;;
		},
		 
		ajax2: function(config){
		    S.mix(config, {
				 dataType:'json',
				 headers: {
				    'X-Requested-With': false
				 }
			}, false);
			
			var user = app.getSessionUser();
			if(user){
				config.data = S.mix({
					user_id: user.user_id,
					token: user.token
				}, config.data); 
						
			}
			config.data = S.mix({
				version: app.config.version
			}, config.data);
			
			return $.io(config);
		},
		
		ajax: function(config){
			// console.log('app.config', app.config)
			config.url = app.config.baseUrl + config.url ;
			
			return this.ajax2(config);
		},
		
 
		
		post: function(url, data, suc, error){
			return this.ajax({
			   type: "post",
			   url:  url,
			   data: data,
			   success: suc,
			   error: function(msg){
				  error && error(msg);
				  alert('网络错误');
				  console.error(msg);
			   }
			});
		},
		
		update: function(url, data, suc, error){
			return this.post(url, data, suc, error); 
		},
		//file, suc, error, progress
		uploadImage2: function(config){
			
			/*function updateProgress (oEvent) {
				console.log('updateProgress', oEvent);
			  if (oEvent.lengthComputable) {
			    var percentComplete = oEvent.loaded / oEvent.total;
			    console.log(percentComplete);
			    progress && progress(percentComplete);
			    // ...
			  } else {
				  console.log('Unable to compute progress information since the total size is unknown');
			    // Unable to compute progress information since the total size is unknown
			  }
			}

			function transferComplete(evt) {
			  console.log('The transfer is complete.', evt);
			  suc && suc(JSON.parse(evt.currentTarget.response));
			  //alert("The transfer is complete.");
			}

			function transferFailed(evt) {
				error && error(JSON.parse(evt.currentTarget.response));
			  //alert("An error occurred while transferring the file.");
			}

			function transferCanceled(evt) {
			  //alert("The transfer has been canceled by the user.");
			}*/
			
			var oReq = new XMLHttpRequest();
			config.updateProgress && oReq.addEventListener("progress", config.updateProgress, false);
			config.success && oReq.addEventListener("load", config.success, false);
			config.error && oReq.addEventListener("error", config.error, false);
			config.transferCanceled && oReq.addEventListener("abort", config.transferCanceled, false);
			
			var formData = new FormData();
			formData.append('uploadImage', config.file);
			oReq.open("post", app.config.baseUrl + '/v2/upload_image', true);
			oReq.send(formData);
		},
	 
		
		postFormData: function(url, data, success, error){
			var config ;
			if(!S.isString(url)){
				config = url;
				url = config.url;
				data = config.data;
				success = config.success;
				error = config.error;
			}else{
				config = {};
			}
			var user = app.getSessionUser();
			if(user){
				S.mix(data, {
					user_id: user.user_id,
					token: user.token
				}, false ); 
						
			}
			var formData = new FormData();
			for(var p in data){
				formData.append(p, data[p]);
			}
			
			S.mix(config, {
			   type: "post",
			   url: app.config.baseUrl + url,
			   data: formData,
			   dataType:'json',
			   headers: {
			       'X-Requested-With': false
			   },
			   cache: false,
	           contentType: false,
	           processData: false,  
			   success: success,
			   error: error
			});
			
			return $.io(config);
		}
	};
});
