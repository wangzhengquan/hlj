/*! 2024-03-19 */
KISSY.add(function(e,t,s,n){function i(t){t=e.mix(t||{},{animation:"scale-in"},!1),i.superclass.constructor.call(this,t)}return e.extend(i,s),UFO.augment(i,{alias:"photobrowsermodal",initComponent:function(){this.createModal&&(this.items=this.createModal()),i.superclass.initComponent.apply(this,arguments)},createModal:function(){return this.slider=UFO.create("photobrowser",{data:this.data,defaultIndex:this.defaultIndex}),this.slider},show:function(){i.superclass.show.call(this,function(){})},setDefaultIndex:function(t){this.slider.setDefaultIndex(t)},addCmpEvents:function(){i.superclass.addCmpEvents.apply(this,arguments);var e=this;e.el.on("click",function(t){return e.hide(),!1})}}),i},{requires:["node","./Modal","../slider/PhotoBrowser"]});