/*! 2024-11-04 */
KISSY.add("UFO/util/Storage",function(a,b){return{setItem:function(a,b,c){var d=typeof c;"string"==d||"number"==d||"boolean"==d?a.setItem(b,c):a.setItem(b,JSON.stringify(c))},getItem:function(a,b){a=a.getItem(b);try{return JSON.parse(a)}catch(b){return a}},setLocalItem:function(a,b){this.setItem(localStorage,a,b)},getLocalItem:function(a){return this.getItem(localStorage,a)},setSessionItem:function(a,b){this.setItem(sessionStorage,a,b)},getSessionItem:function(a){return this.getItem(sessionStorage,a)}}},{requires:["node"]}),KISSY.add("APP/util/ParamUtil",function(a){return{processParam:function(b){for(var c in b){var d=b[c];a.isArray(d)&&(b[c]=d[0])}return b},packParam:function(b){return a.unparam(b.substring(b.indexOf("?")+1))}}}),KISSY.add("APP/app",function(a,b,c){var d="2.9.5",e=c.processParam(a.unparam(decodeURIComponent(location.search.slice(1)))),f=navigator.userAgent.toLowerCase(),g=f.match(/(hlj-\w+)\/(\d\.\d\.\d)/i),h="hlj_customer_position",i="hlj_user",j=void 0,k=void 0,l=[{name:"北京市",code:"110100"},{name:"上海市",code:"310100"},{name:"杭州市",code:"330100"},{name:"成都市",code:"510100"},{name:"深圳市",code:"440300"},{name:"广州市",code:"440100"},{name:"武汉市",code:"420100"},{name:"南京市",code:"320100"},{name:"天津市",code:"120100"},{name:"重庆市",code:"500100"}],m={apiHost:"//app.helijia.com",baseUrl:"//app.helijia.com/zmw"},n={imgBaseUrl:"../",version:d};a.mix(n,m);var o={config:n,getCookie:function(a){var b;return document.cookie.length>0&&(b=document.cookie.indexOf(a+"="),-1!=b)?(b=b+a.length+1,c_end=document.cookie.indexOf(";",b),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(b,c_end))):""},getCity:function(a){return this.getCityMap()[a]||this.getCityMap()[110100]},getCityByName:function(a){return/市$/.test(a)||(a+="市"),this.getNameKeyCityMap()[a]||this.getNameKeyCityMap()["北京市"]},getCityMap:function(){if(!j){j={};for(var a,b=0,c=l.length;c>b;b++)a=l[b],j[a.code]=a}return j},getNameKeyCityMap:function(){if(!k){k={};for(var a,b=0,c=l.length;c>b;b++)a=l[b],k[a.name]=a}return k},getCityList:function(a){return a&&a(result),l},setPosition:function(a){console.log("setPosition",a),a.city_code||(a.city_code=this.getCityByName(a.city).code),b.setSessionItem(h,a)},getPosition:function(){b.getSessionItem(h)},setSessionUser:function(a){b.setSessionItem(i,a)},getSessionUser:function(){return b.getSessionItem(i)},isLogined:function(){return!!this.getSessionUser()},getParam:function(){return e},isApp:function(){return g&&("hlj-ios"==g[1]||"hlj-android"==g[1])},isAdroidApp:function(){return g&&"hlj-android"==g[1]},isIosApp:function(){return g&&"hlj-ios"==g[1]},getAppVersion:function(){return g&&g[2]},getRunEnv:function(){return g&&g[1]},isMicroMessenger:function(){return"micromessenger"==navigator.userAgent.toLowerCase().match(/MicroMessenger/i)},notifyApp:function(a,b){var c=navigator.userAgent;if("micromessenger"==c.toLowerCase().match(/MicroMessenger/i))return void(window.location="http://www.helijia.com/APP/down.html");c.match(/(iPhone|iPod|iPad);?/i)?window.location=a:c.match(/android/i)&&(window.location=b);var d=+new Date;setTimeout(function(){!window.document.webkitHidden&&setTimeout(function(){+new Date-d<2e3&&(window.location="http://www.helijia.com/APP/down.html")},500)},500)}};return o},{requires:["UFO/util/Storage","./util/ParamUtil"]}),KISSY.add("APP/action/Action",function(a,b,c,d){var e=a,f=b("APP/app");return{query:function(b,c,d,e){console.log("query == ",b);var g=a.Defer();return b.indexOf("/exchange.json")>=0?KISSY.use("APP/data/exchange",function(a,b){d(b),g.resolve(b)}):b.indexOf("/products.json")>=0||b.indexOf("/get_artisan_products_six.json")>=0?KISSY.use("APP/data/products_list",function(a,e){var f=e(b,c);d(f),g.resolve(f)}):b.indexOf("/get_product_tags.json")>=0?KISSY.use("APP/data/products_tags",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/product_detail.json")>=0?KISSY.use("APP/data/product",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/artisan_customer_date_list.json")>=0?KISSY.use("APP/data/artisan_available_time",function(a,b){d(b),g.resolve(b)}):b.indexOf("/artisan_common_list.json")>=0?KISSY.use("APP/data/comments_list",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/artisans.json")>=0?KISSY.use("APP/data/artisans_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/get_product_label_list.json")>=0?KISSY.use("APP/data/products_label_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/verify_mobile.json")>=0?KISSY.use("APP/data/verify_mobile",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/orders.json")>=0?KISSY.use("APP/data/orders_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/order_detail.json")>=0?KISSY.use("APP/data/order",function(a,b){d(b),g.resolve(b)}):b.indexOf("/cancel_reason.json")>=0?KISSY.use("APP/data/order_cancel_reason",function(a,b){d(b),g.resolve(b)}):b.indexOf("/artisan_detail.json")>=0?KISSY.use("APP/data/artisan",function(a,b){d(b),g.resolve(b)}):b.indexOf("/v2/store_detail")>=0?KISSY.use("APP/data/shop",function(a,b){d(b),g.resolve(b)}):console.error("XMLHttpRequest error: ",f.config.baseUrl+b+"?"+a.param(c)),g.promise},ajax2:function(b){a.mix(b,{dataType:"json",headers:{"X-Requested-With":!1}},!1);var c=f.getSessionUser();return c&&(b.data=a.mix({user_id:c.user_id,token:c.token},b.data)),b.data=a.mix({version:f.config.version},b.data),e.io(b)},ajax:function(a){return a.url=f.config.baseUrl+a.url,this.ajax2(a)},post:function(a,b,c,d){return this.ajax({type:"post",url:a,data:b,success:c,error:function(a){d&&d(a),alert("网络错误"),console.error(a)}})},update:function(a,b,c,d){return this.post(a,b,c,d)},uploadImage2:function(a){var b=new XMLHttpRequest;a.updateProgress&&b.addEventListener("progress",a.updateProgress,!1),a.success&&b.addEventListener("load",a.success,!1),a.error&&b.addEventListener("error",a.error,!1),a.transferCanceled&&b.addEventListener("abort",a.transferCanceled,!1);var c=new FormData;c.append("uploadImage",a.file),b.open("post",f.config.baseUrl+"/v2/upload_image",!0),b.send(c)},postFormData:function(b,c,d,g){var h;a.isString(b)?h={}:(h=b,b=h.url,c=h.data,d=h.success,g=h.error);var i=f.getSessionUser();i&&a.mix(c,{user_id:i.user_id,token:i.token},!1);var j=new FormData;for(var k in c)j.append(k,c[k]);return a.mix(h,{type:"post",url:f.config.baseUrl+b,data:j,dataType:"json",headers:{"X-Requested-With":!1},cache:!1,contentType:!1,processData:!1,success:d,error:g}),e.io(h)}}}),KISSY.add("APP/red/tpl/coupon-list-tpl",function(){return'{{#each data}}\n<li class="{{@if type}}bo1{{else}}bo2{{/if}}">\n	<div class="cl1"><span>￥</span>{{couponPrice}}</div>\n	<div class="cl2 fle">{{couponDesc}}</div>\n	<div class="cl3"><a href="{{getProductListHref filter_category filter_active type}}">下单</a></div>\n	<div class="shuoming orient">\n		<p><span>使用规则说明：</span>{{{remark}}}</p>\n		<input type="button" name="button" class="li-button" value="确定"/>\n	</div>\n</li>\n{{/each}}\n				 '}),KISSY.add("APP/util/MapUtil",function(a){return{getCurrentPosition:function(b,c){var d={accuracy:null,altitude:null,altitudeAccuracy:null,heading:null,latitude:"39.91092455",longitude:"116.41338370",speed:null,timestamp:null,point:{lng:116.4133837,lat:39.91092455,pf:"inner"},address:{city:"北京市",city_code:0,district:"",province:"北京市",street:"",street_number:""}},e=a.Defer();return b&&b(d),e.resolve(d),e.promise}}}),KISSY.add("APP/red/mods/redCoupon",function(a,b,c,d,e,f,g){return{attachEvent:function(){a.one("#s-button").on("click",function(a){e.notifyApp("hljclient://","helijia://www.helijia.com/artisans")});var b=a.one("#couponList");b.delegate("click",".fle",function(b){var c=a.one(b.currentTarget),d=c.parent().last();d.hasClass("shuoming")&&(a.one("body").css("overflow","hidden"),d.css("-webkit-transform","translateY(0%)"),d.last().on("click",function(b){var c=a.one(b.currentTarget);a.one("body").css("overflow","auto"),c.parent().css("-webkit-transform","translateY(-100%)")}))})},renderCouponeList:function(){g.getCurrentPosition().then(function(b){var g=e.getCityByName(b.address.city);d.query("/v2/receive/getCouponData",{},function(b){console.log(b),a.one("#couponList").html(new c(f,{commands:{getProductListHref:function(b,c){var d=c.params[0],f=c.params[1],h=c.params[2],i={type:"products",city:g.code,filter_category:d};return f&&(i.filter_active=f),e.isApp()?e.config.baseUrl+"/v2/search?"+a.param(i):h?"http://www.helijia.com/mobile/build/APP/home/index.html?channel=new_weixin":"../products/products_of_active.html?"+a.param(i)}}}).render(b))})})},init:function(){this.renderCouponeList(),this.attachEvent()}}},{requires:["node","xtemplate","../../action/Action","../../app","../tpl/coupon-list-tpl","../../util/MapUtil"]});