/*! 2024-11-04 */
KISSY.add("UFO/EventSupport",function(a){function b(a,b){for(var c=0,d=b.length;d>c;c++){for(var e=b[c],f=0,g=0;f<a.length;f++)a[f]!=e&&(a[g++]=a[f]);a.length=g}}function c(a){this.listeners=this.listeners||{},this.oneTimeListeners=this.oneTimeListeners||{}}return UFO.augment(c,{on:function(b,c){var d=this.listeners[b]||[];return(d=a.isArray(d)?d:[d]).push(c),this.listeners[b]=d,this},off:function(a,c){return this.listeners[a]&&b(this.listeners[a],c),this.oneTimeListeners[a]&&b(this.oneTimeListeners[a],c),this},one:function(a,b){return this.oneTimeListeners[a]=this.oneTimeListeners[a]||[],this.oneTimeListeners[a].push(b),this},fire:function(){var b=[],c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=this.listeners[c],f=this.oneTimeListeners[c];if(e)for(var g=0,h=(e=a.isArray(e)?e:[e]).length;h>g;g++)b.push(e[g].apply(this,d));if(f)for(g=0,h=(f=a.isArray(f)?f:[f]).length;h>g;g++)b.push(f[g].apply(this,d));return f=[],1==b.length?b[0]:b},fireEvent:function(){return this.fire.apply(this,arguments)},hasListener:function(a){return this.listeners[a]},relayEvents:function(a,b,c){for(var d,e=b.length,f=0;e>f;f++)d=b[f],a.on(d,this.createRelayer(c?c+d:d))},createRelayer:function(a,b){var c=this;return function(){return c.fireEvent.apply(c,[a].concat(Array.prototype.slice.apply(arguments,b||[0])))}}}),c}),KISSY.add("UFO/ComponentQuery",function(a){function b(a,b){return b.method.apply(this,[a].concat(b.args))}function c(a,b){for(var c,d=[],e=0,f=a.length,g=">"!==b;f>e;e++)(c=a[e]).getRefItems&&(d=d.concat(c.getRefItems(g)));return d}function d(a,b,c){if("*"===b)return a.slice();for(var d,e=[],f=0,g=a.length;g>f;f++)(d=a[f])&&d.isType&&d.isType(b,c)&&e.push(d);return e}function e(a,b){for(var c,d=[],e=0,f=a.length;f>e;e++)(c=a[e]).hasCls(b)&&d.push(c);return d}function f(a,b){for(var c,d=[],e=0,f=a.length;f>e;e++)(c=a[e]).getId()===b&&d.push(c);return d}var g=this,h=/^(\s?([>\^])\s?|\s|$)/,i=/^(#)?([\w\-]+|\*)(?:\((true|false)\))?/,j=[{re:/^\.([\w\-]+)(?:\((true|false)\))?/,method:d},{re:/^(?:[\[](?:@)?([\w\-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]])/,method:function(a,b,c,d){for(var e,f=[],g=0,h=a.length;h>g;g++)e=a[g],(d?String(e[b])===d:e[b])&&f.push(e);return f}},{re:/^#([\w\-]+)/,method:f},{re:/^\:([\w\-]+)(?:\(((?:\{[^\}]+\})|(?:(?!\{)[^\s>\/]*?(?!\})))\))?/,method:function(a,b,c){return g.pseudos[b](a,c)}}],k=(g.Query=function(a){a=a||{},UFO.apply(this,a)},UFO.augment(g.Query,{execute:function(d){var e,f,g=this.operations,h=0,i=g.length;for(a.isArray(d)&&(f=d);i>h;h++)if(f="^"===(e=g[h]).mode?function(a){for(var b,c=[],d=0,e=a.length;e>d;d++)for(b=a[d];b=b.ownerCt||b.floatParent;)c.push(b);return c}(f||[d]):e.mode?c(f||[d],e.mode):b(f||c([d]),e),h===i-1)return f;return[]},is:function(c){var d,e,f=this.operations,g=a.isArray(c)?c:[c],c=g.length,h=f[f.length-1];if((g=b(g,h)).length!==c)return!1;if(1<f.length)for(e=0,d=g.length;d>e;e++)if(-1===a.indexOf(this.execute(),g[e]))return!1;return!0}}),{cache:{},pseudos:{not:function(a,b){for(var c,d=k,e=0,f=a.length,g=[],h=-1;f>e;++e)c=a[e],d.is(c,b)||(g[++h]=c);return g},first:function(a){var b=[];return 0<a.length&&b.push(a[0]),b},last:function(a){var b=a.length,c=[];return b>0&&c.push(a[b-1]),c}},query:function(b,c){for(var d,e,f,g=b.split(","),h=g.length,i=0,j=[],k=[],l={};h>i;i++)b=a.trim(g[i]),d=this.cache[b]||(this.cache[b]=this.parse(b)),j=j.concat(d.execute(c));if(1<(e=j.length)){for(i=0;e>i;i++)f=j[i],console.log("cmp.id",f.id),l[f.id]||(k.push(f),l[f.id]=!0);j=k}return j},is:function(b,c){if(!c)return!0;for(var d=c.split(","),e=d.length,f=0;e>f;f++)if(c=a.trim(d[f]),(this.cache[c]||(this.cache[c]=this.parse(c))).is(b))return!0;return!1},parse:function(b){for(var c,k,l,m,n,o,p,q=[],r=j.length;b&&c!==b;){for((k=(c=b).match(i))&&(l=k[1],q.push("#"===l?{method:f,args:[a.trim(k[2])]}:"."===l?{method:e,args:[a.trim(k[2])]}:{method:d,args:[a.trim(k[2]),Boolean(k[3])]}),b=b.replace(k[0],""));!(m=b.match(h));)for(o=0;b&&r>o;o++){if(p=j[o],n=b.match(p.re),p.method,n){q.push({method:p.method,args:n.slice(1)}),b=b.replace(n[0],"");break}o===r-1&&console.error('Invalid ComponentQuery selector: "'+arguments[0]+'"')}m[1]&&(q.push({mode:m[2]||m[1]}),b=b.replace(m[0],""))}return new g.Query({operations:q})}});return k}),KISSY.add("UFO/Component",function(a,b,c,d){function e(b){this.config=b||{},a.mix(this,b,!0,void 0,!0),this.id=a.guid(),this.tplId&&(f=this.tpl=a.one("#"+this.tplId).html()),e.superclass.constructor.call(this,b),this.initComponent()}var f="<div></div>";return a.extend(e,c),UFO.augment(e,{alias:"component",initComponent:function(){this.el||(f=this.tpl||f,this.el=a.all(f)),this.bodyStyle=a.mix(this.bodyStyle||{},{padding:this.bodyPadding},!0),this.getBodyContainer().css(this.bodyStyle),this.style=a.mix(this.style||{},{padding:this.padding,margin:this.margin}),this.el.css(this.style),this.cls&&this.addClass(this.cls),this.bodyCls&&this.getBodyContainer().addClass(this.bodyCls),this.attributes&&this.el.attr(this.attributes),this.addCmpEvents()},setSize:function(a,b){this.el.width(a),this.el.height(b)},toEl:function(){return this.el},getEl:function(){return this.toEl()},getTargetEl:function(){},getBodyContainer:function(){return this.el},getContentTarget:function(){return this.el},render:function(b){(b="string"==typeof b?(b=a.one("#"+b))||a.one(b):b).append(this.toEl()),this.fire("afterrender",this)},onAdded:function(a,b){var c=this;c.ownerCt=a,c.fireEvent("added",c,a,b)},css:function(b,c){var d=Array.prototype.slice.call(arguments,0);return 1===d.length&&a.isString(d[0])?el.css(b):this.el.css(b,c),this},removeClass:function(a){return this.el.removeClass(a),this},addClass:function(a){return this.el.addClass(a),this},hasClass:function(a){return this.el.hasClass(a)},hasCls:function(a){return this.hasClass(a)},setDisabled:function(a){(this.disabled=a)?this.el.attr("disabled","disabled"):this.el.attr("disabled","")},show:function(){return!1!==this.fire("beforeshow")&&(this.el.show(),this.fire("show")),this},hide:function(a){var b=this;return!1!==this.fire("beforehide")&&(this.el.hide(),b.destroy&&(b.el.remove(),delete b),b.fire("hide"),a)&&a(),this},getRootContainer:function(){return this.rootContainer},getId:function(){return this.id},up:function(a){var b=this.getBubbleTarget();if(a)for(;b;b=b.getBubbleTarget())if(d.is(b,a))return b;return b},getBubbleTarget:function(){return this.ownerCt},addCmpEvents:function(){},set:function(a,b){this[a]=b},get:function(a){return this[a]},isType:function(a){return UFO.isType(this,a)}}),e},{requires:["node","./EventSupport","./ComponentQuery"]}),KISSY.add("UFO/layout/Layout",function(a){function b(a){this.initLayout()}return UFO.augment(b,{alias:"layout",initLayout:function(){this.el=[]},doLayout:function(b){if(this.clearItems(),!a.isEmptyObject(b))for(var c,d=0,e=b.length;e>d;d++)null!=(c=b[d])&&(this.el.push(c.getEl?c.getEl():c),c.fire)&&c.fire("afterrender",c)},clearItems:function(){this.el=[]},calculate:function(){},toEl:function(){return this.el}}),b}),KISSY.add("UFO/container/Container",function(a,b,c,d,e,f){function g(a){g.superclass.constructor.call(this,a)}var h="<div></div>";return a.extend(g,d),UFO.augment(g,{alias:"container",initComponent:function(){this.el||(h=this.tpl||h,this.el=a.all(h));var b=(b=this.layout)||"layout";this.setLayout(b),this.initItems(),g.superclass.initComponent.apply(this,arguments)},updateLayout:function(){this.layout.doLayout(this.items),this.getBodyContainer().html("");for(var b,c=this.layout.toEl(),d=0,e=(c=a.isArray(c)?c:[c]).length;e>d;d++)b=c[d],this.getBodyContainer().append(b)},initItems:function(){var b;this.items&&(b=this.items,a.isArray(b)||(b=[b]),this.items=[],this.add(b))},add:function(b,c){a.isArray(b)||(b=[b]);var d=this;if(d.items=d.items||[],!a.isEmptyObject(b))for(var e,f=0,g=b.length;g>f;f++)e=b[f],e=UFO.createItem(e,d.defaults),d.items.push(e),e&&e.onAdded&&e.onAdded(d,f),d.fireEvent("add",d,e,f);return a.isEmptyObject(this.items)||this.updateLayout(),d.items},setLayout:function(a){this.layout=UFO.create(a)},getRefItems:function(a){for(var b,c=this,d=c.items,e=d.length,f=0,g=[];e>f;f++)b=d[f],g.push(b),a&&b&&b.getRefItems&&g.push.apply(g,b.getRefItems(!0));return c.floatingItems&&g.push.apply(g,c.floatingItems),g},query:function(a){return f.query(a=a||"*",this)},down:function(a){return this.query(a)[0]||null}}),g},{requires:["node","xtemplate","../Component","../layout/Layout","../ComponentQuery"]}),KISSY.add("UFO/modal/Modal",function(a,b,c,d){function e(a){e.superclass.constructor.call(this,a)}var f=document.body,g=['<div class="modal-backdrop">','	<div class="modal-backdrop-bg"></div>','	<div class="modal"></div>',"</div>"].join("");return a.extend(e,d),UFO.augment(e,{alias:"modal",initComponent:function(){this.el=a.one(g),this.modal=this.el.one(".modal"),this.animation=this.animation||"slide-in-left",this.modal.addClass(this.animation),this.createModal&&(this.items=this.createModal()),e.superclass.initComponent.apply(this,arguments)},getModal:function(){return this.modal},getBodyContainer:function(){return this.modal},show:function(b){var c=this;return this.appended||(a.one(document.body).append(this.toEl()),this.appended=!0),e.superclass.show.apply(this,arguments),"none"!=this.animation&&(setTimeout(function(){c.modal.removeClass("ng-leave"),c.modal.addClass("ng-enter ng-enter-active")},0),setTimeout(function(){b&&b()},400)),this},hide:function(a){function b(){e.superclass.hide.call(c,a)}var c=this;"none"!=this.animation?(this.modal.addClass("ng-leave"),this.modal.removeClass("ng-enter ng-enter-active"),setTimeout(function(){b()},400)):b()},slideIn:function(a){this.show()},slideOut:function(a){this.hide()},addCmpEvents:function(){e.superclass.addCmpEvents.apply(this,arguments);var b=this;this.on("hide",function(){a.one(f).removeClass("modal-open"),a.one(document).one("html").removeClass("modal-open"),f.scrollTop=b.origScrollTop}),this.on("beforeshow",function(){b.origScrollTop=f.scrollTop,a.one(f).addClass("modal-open"),a.one(document).one("html").addClass("modal-open")}),this.el.delegate("click tap",".button-back, .button-close",function(a){return b.hide(),!1})}}),e},{requires:["anim","node","../container/Container"]}),KISSY.add("UFO/core/lang/Number",function(a){return{toSignedNumberString:function(a,b){return a>0?"+"+String(a):0==a?(b||"")+String(a):String(a)},toHex:function(a){return a.toString(16)},toAmountWords:function(a){for(var b=["","万","亿"],c=["拾","佰","仟"],d=["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"],e=String(a).split("."),f=0,g=0,h=0,i="",j=0,k=1,l=e[0].length;l>=k;k++){var j=e[0].charAt(l-k),m=0;l-k-1>=0&&(m=e[0].charAt(l-k-1)),0!=(h+=Number(j))&&(i=d[Number(j)].concat(i),"0"==j)&&(h=0),l-k-1>=0&&(3!=f?(0!=m&&(i=c[f].concat(i)),f++):("万"!=i.charAt(f=0)&&"亿"!=i.charAt(0)||(i=i.substr(1,i.length-1)),i=b[g].concat(i),h=0)),3==f&&g++}return i+="元",e[1]?(0!=(j=e[1].charAt(0))&&(i+=d[Number(j)]+"角"),0!=(j=e[1].charAt(1))&&(i+=d[Number(j)]+"分")):i+="整",i}}}),KISSY.add("UFO/core/lang/Date",function(a,b){return{getMonthName:function(a,b){return(!0===b?["&#74;&#97;&#110;","&#70;&#101;&#98;","&#77;&#97;&#114;","&#65;&#112;&#114;","&#77;&#97;&#121;","&#74;&#117;&#110;","&#74;&#117;&#108;","&#65;&#117;&#103;","&#83;&#101;&#112;","&#79;&#99;&#116;","&#78;&#111;&#118;","&#68;&#101;&#99;"]:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])[a.getMonth()]},getWeekName:function(a,b){return(!0===b?["&#83;&#117;&#110;","&#77;&#111;&#110;","&#84;&#117;&#101;","&#87;&#101;&#100;","&#84;&#104;&#117;&#114;","&#70;&#114;&#105;","&#83;&#97;&#116;"]:["Sun","Mon","Tue","Wed","Thur","Fri","Sat"])[a.getDay()]},format:function(a,c){if(!a)return"";c=c||"yyyy-MM-dd mm:ss";var d,e,f,g={TZ:b.toSignedNumberString(parseInt(-a.getTimezoneOffset()/60)),"q+":Math.floor((a.getMonth()+3)/3),"y+":a.getFullYear(),MN:this.getMonthName(a,!0),"M+":a.getMonth()+1,"d+":a.getDate(),WN:this.getWeekName(a),"h+":a.getHours(),"H+":(d=a.getHours())<13?d:d-12,"m+":a.getMinutes(),MP:a.getMinutes()-(new Date).getMinutes(),"s+":a.getSeconds(),DP:a.getHours()<12?"AM":"PM"};for(e in g)new RegExp("("+e+")").test(c)&&(f=RegExp.$1,c=c.replace(f,function(){return"yy"===f?g[e]%100:1<f.length&&"number"==typeof g[e]&&-1<g[e]&&g[e]<10?"0"+g[e]:g[e]}));return c}}},{requires:["./Number"]}),KISSY.add("UFO/util/Storage",function(a,b){return{setItem:function(a,b,c){var d=typeof c;"string"==d||"number"==d||"boolean"==d?a.setItem(b,c):a.setItem(b,JSON.stringify(c))},getItem:function(a,b){a=a.getItem(b);try{return JSON.parse(a)}catch(b){return a}},setLocalItem:function(a,b){this.setItem(localStorage,a,b)},getLocalItem:function(a){return this.getItem(localStorage,a)},setSessionItem:function(a,b){this.setItem(sessionStorage,a,b)},getSessionItem:function(a){return this.getItem(sessionStorage,a)}}},{requires:["node"]}),KISSY.add("APP/util/ParamUtil",function(a){return{processParam:function(b){for(var c in b){var d=b[c];a.isArray(d)&&(b[c]=d[0])}return b},packParam:function(b){return a.unparam(b.substring(b.indexOf("?")+1))}}}),KISSY.add("APP/app",function(a,b,c){var d="2.9.5",e=c.processParam(a.unparam(decodeURIComponent(location.search.slice(1)))),f=navigator.userAgent.toLowerCase(),g=f.match(/(hlj-\w+)\/(\d\.\d\.\d)/i),h="hlj_customer_position",i="hlj_user",j=void 0,k=void 0,l=[{name:"北京市",code:"110100"},{name:"上海市",code:"310100"},{name:"杭州市",code:"330100"},{name:"成都市",code:"510100"},{name:"深圳市",code:"440300"},{name:"广州市",code:"440100"},{name:"武汉市",code:"420100"},{name:"南京市",code:"320100"},{name:"天津市",code:"120100"},{name:"重庆市",code:"500100"}],m={apiHost:"//app.helijia.com",baseUrl:"//app.helijia.com/zmw"},n={imgBaseUrl:"../",version:d};a.mix(n,m);var o={config:n,getCookie:function(a){var b;return document.cookie.length>0&&(b=document.cookie.indexOf(a+"="),-1!=b)?(b=b+a.length+1,c_end=document.cookie.indexOf(";",b),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(b,c_end))):""},getCity:function(a){return this.getCityMap()[a]||this.getCityMap()[110100]},getCityByName:function(a){return/市$/.test(a)||(a+="市"),this.getNameKeyCityMap()[a]||this.getNameKeyCityMap()["北京市"]},getCityMap:function(){if(!j){j={};for(var a,b=0,c=l.length;c>b;b++)a=l[b],j[a.code]=a}return j},getNameKeyCityMap:function(){if(!k){k={};for(var a,b=0,c=l.length;c>b;b++)a=l[b],k[a.name]=a}return k},getCityList:function(a){return a&&a(result),l},setPosition:function(a){console.log("setPosition",a),a.city_code||(a.city_code=this.getCityByName(a.city).code),b.setSessionItem(h,a)},getPosition:function(){b.getSessionItem(h)},setSessionUser:function(a){b.setSessionItem(i,a)},getSessionUser:function(){return b.getSessionItem(i)},isLogined:function(){return!!this.getSessionUser()},getParam:function(){return e},isApp:function(){return g&&("hlj-ios"==g[1]||"hlj-android"==g[1])},isAdroidApp:function(){return g&&"hlj-android"==g[1]},isIosApp:function(){return g&&"hlj-ios"==g[1]},getAppVersion:function(){return g&&g[2]},getRunEnv:function(){return g&&g[1]},isMicroMessenger:function(){return"micromessenger"==navigator.userAgent.toLowerCase().match(/MicroMessenger/i)},notifyApp:function(a,b){var c=navigator.userAgent;if("micromessenger"==c.toLowerCase().match(/MicroMessenger/i))return void(window.location="http://www.helijia.com/APP/down.html");c.match(/(iPhone|iPod|iPad);?/i)?window.location=a:c.match(/android/i)&&(window.location=b);var d=+new Date;setTimeout(function(){!window.document.webkitHidden&&setTimeout(function(){+new Date-d<2e3&&(window.location="http://www.helijia.com/APP/down.html")},500)},500)}};return o},{requires:["UFO/util/Storage","./util/ParamUtil"]}),KISSY.add("APP/util/XTemplateUtil",function(a,b,c,d){return b.addCommand("getImgAbsolutePath",function(a,b){var c=b.params[0];return c?d.config.imgBaseUrl+(0===c.indexOf("/")?c.substr(1):c):"../resources/images/default_user.png"}),b.addCommand("formatPrice",function(a,b){return Number(b.params[0]).toFixed(2)}),b.addCommand("formatDateTime",function(b,d){var e=d.params[0],f="yyyy-MM-dd";return a.isNumber(e)&&(e=new Date(e)),2===d.params.length&&(f=d.params[1]),c.format(e,f)}),b.addCommand("fixedDigits",function(a,b){var c=2;return 2===b.params.length&&(c=b.params[1]),Number(b.params[0]).toFixed(c)}),b.addCommand("join",function(a,b){var c=",";return 2===b.params.length&&(c=b.params[1]),b.params[0].join(c)}),b.addCommand("getHost",function(a,b){return location.host}),b.addCommand("encodeURIComponent",function(a,b){return encodeURIComponent(b.params[0])}),{}},{requires:["xtemplate","UFO/core/lang/Date","../app"]}),KISSY.add("APP/action/Action",function(a,b,c,d){var e=a,f=b("APP/app");return{query:function(b,c,d,e){console.log("query == ",b);var g=a.Defer();return b.indexOf("/exchange.json")>=0?KISSY.use("APP/data/exchange",function(a,b){d(b),g.resolve(b)}):b.indexOf("/products.json")>=0||b.indexOf("/get_artisan_products_six.json")>=0?KISSY.use("APP/data/products_list",function(a,e){var f=e(b,c);d(f),g.resolve(f)}):b.indexOf("/get_product_tags.json")>=0?KISSY.use("APP/data/products_tags",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/product_detail.json")>=0?KISSY.use("APP/data/product",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/artisan_customer_date_list.json")>=0?KISSY.use("APP/data/artisan_available_time",function(a,b){d(b),g.resolve(b)}):b.indexOf("/artisan_common_list.json")>=0?KISSY.use("APP/data/comments_list",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/artisans.json")>=0?KISSY.use("APP/data/artisans_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/get_product_label_list.json")>=0?KISSY.use("APP/data/products_label_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/verify_mobile.json")>=0?KISSY.use("APP/data/verify_mobile",function(a,b){var e=b(c);d(e),g.resolve(e)}):b.indexOf("/orders.json")>=0?KISSY.use("APP/data/orders_list",function(a,b){d(b),g.resolve(b)}):b.indexOf("/order_detail.json")>=0?KISSY.use("APP/data/order",function(a,b){d(b),g.resolve(b)}):b.indexOf("/cancel_reason.json")>=0?KISSY.use("APP/data/order_cancel_reason",function(a,b){d(b),g.resolve(b)}):b.indexOf("/artisan_detail.json")>=0?KISSY.use("APP/data/artisan",function(a,b){d(b),g.resolve(b)}):b.indexOf("/v2/store_detail")>=0?KISSY.use("APP/data/shop",function(a,b){d(b),g.resolve(b)}):console.error("XMLHttpRequest error: ",f.config.baseUrl+b+"?"+a.param(c)),g.promise},ajax2:function(b){a.mix(b,{dataType:"json",headers:{"X-Requested-With":!1}},!1);var c=f.getSessionUser();return c&&(b.data=a.mix({user_id:c.user_id,token:c.token},b.data)),b.data=a.mix({version:f.config.version},b.data),e.io(b)},ajax:function(a){return a.url=f.config.baseUrl+a.url,this.ajax2(a)},post:function(a,b,c,d){return this.ajax({type:"post",url:a,data:b,success:c,error:function(a){d&&d(a),alert("网络错误"),console.error(a)}})},update:function(a,b,c,d){return this.post(a,b,c,d)},uploadImage2:function(a){var b=new XMLHttpRequest;a.updateProgress&&b.addEventListener("progress",a.updateProgress,!1),a.success&&b.addEventListener("load",a.success,!1),a.error&&b.addEventListener("error",a.error,!1),a.transferCanceled&&b.addEventListener("abort",a.transferCanceled,!1);var c=new FormData;c.append("uploadImage",a.file),b.open("post",f.config.baseUrl+"/v2/upload_image",!0),b.send(c)},postFormData:function(b,c,d,g){var h;a.isString(b)?h={}:(h=b,b=h.url,c=h.data,d=h.success,g=h.error);var i=f.getSessionUser();i&&a.mix(c,{user_id:i.user_id,token:i.token},!1);var j=new FormData;for(var k in c)j.append(k,c[k]);return a.mix(h,{type:"post",url:f.config.baseUrl+b,data:j,dataType:"json",headers:{"X-Requested-With":!1},cache:!1,contentType:!1,processData:!1,success:d,error:g}),e.io(h)}}}),KISSY.add("APP/product/tpl/shop-addr-tpl",function(){return'<div class="main shop-display background">\n	<header class="bar-love header bar">\n		<button class="button button-clear button-back">\n			<i class="icon iconfont icon-back"></i></button>\n		<h1 class="title">店铺地址</h1>\n		<div class="buttons buttons-right">	\n			<button class="button button-clear button-ok">\n				确定\n			</button>\n		</div>\n	</header>\n	<div class="content has-header scroll-content">\n		<ul class="shop-addr-intro">\n	 		<li><font>小聚点</font>为河狸家官方认证的第三方合作空间。</li>\n			<li>未标明<font>小聚点</font>的是手艺人自行提供的常用服务地址，建议服务钱沟通确认。</li>\n	 	</ul>\n	 	\n	 	<div class="shop-addr-list">\n	 	</div>\n	</div>\n</div>'}),KISSY.add("APP/product/tpl/shop-addr-list-item-tpl",function(){return' {{#if studio_list&&studio_list.length}}\n {{#each studio_list}}\n <div class="item item-checkbox item-checkbox-right checkbox-love {{#if service_address_type&&service_address_type===\'studio\'}}has-label-judian{{/if}} no-padding-left">\n	{{#if service_address_type&&service_address_type===\'studio\'}}<label class="label-judian"></label>{{/if}}\n  {{#if address}}\n  <div class="label-left-field">\n  	<label class="label">店名：</label>\n  	<span class="field">{{address}}</span>\n  </div>\n   {{/if}}\n  {{#if location}}\n  <div class="label-left-field">\n  	<label class="label">地址：</label>\n  	<span class="field">{{location}}</span>\n  </div>\n  {{/if}}\n  \n  <label class="checkbox checkbox-love">\n   <input type="radio" name="shop-radio">\n  </label>\n</div>\n{{/each}}\n{{/if}}'}),KISSY.add("APP/product/mods/ShopAddrModal",function(a,b,c,d,e,f,g,h,i){function j(a){j.superclass.constructor.call(this,a)}return a.extend(j,d),a.augment(j,{initComponent:function(){j.superclass.initComponent.apply(this,arguments),this.shop_addr_list=this.el.one(".shop-addr-list"),this.init()},init:function(){var a=this;f.query("/v2/get_service_addresses",a.param,function(b){if(b.ret){var d=b.studio_list;if(b.city&&d)for(var e=g.getCityByName(b.city),f=0,h=d.length;h>f;f++)d[f].city=e;a.studio_list=b.studio_list,a.shop_addr_list.append(new c(i).render(b))}console.log("json",b)},function(a){console.log("msg",a)})},createModal:function(){return h},addCmpEvents:function(){j.superclass.addCmpEvents.apply(this,arguments);var a=this;this.el.delegate("click tap",".button-back",function(b){return a.hide(),!1}),this.el.delegate("click tap",".button-ok",function(b){var c=a.shop_addr_list.one(".checkbox input:checked");if(!c)return alert("请选择店铺地址!"),!1;var d=c.parent(".item").index();return a.fire("ok",a.studio_list[d]),a.hide(),!1})}}),j},{requires:["node","xtemplate","UFO/modal/Modal","../../util/XTemplateUtil","../../action/Action","../../app","../tpl/shop-addr-tpl","../tpl/shop-addr-list-item-tpl"]});