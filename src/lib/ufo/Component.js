/*! 2024-03-19 */
KISSY.add(function(s,t,i,e){var n="<div></div>";function r(t){this.config=t||{},s.mix(this,t,!0,void 0,!0),this.id=s.guid(),this.tplId&&(n=this.tpl=s.one("#"+this.tplId).html()),r.superclass.constructor.call(this,t),this.initComponent()}return s.extend(r,i),UFO.augment(r,{alias:"component",initComponent:function(){this.el||(n=this.tpl||n,this.el=s.all(n)),this.bodyStyle=s.mix(this.bodyStyle||{},{padding:this.bodyPadding},!0),this.getBodyContainer().css(this.bodyStyle),this.style=s.mix(this.style||{},{padding:this.padding,margin:this.margin}),this.el.css(this.style),this.cls&&this.addClass(this.cls),this.bodyCls&&this.getBodyContainer().addClass(this.bodyCls),this.attributes&&this.el.attr(this.attributes),this.addCmpEvents()},setSize:function(t,i){this.el.width(t),this.el.height(i)},toEl:function(){return this.el},getEl:function(){return this.toEl()},getTargetEl:function(){},getBodyContainer:function(){return this.el},getContentTarget:function(){return this.el},render:function(t){(t="string"==typeof t?(t=s.one("#"+t))||s.one(t):t).append(this.toEl()),this.fire("afterrender",this)},onAdded:function(t,i){var e=this;e.ownerCt=t,e.fireEvent("added",e,t,i)},css:function(t,i){var e=Array.prototype.slice.call(arguments,0);return 1===e.length&&s.isString(e[0])?el.css(t):this.el.css(t,i),this},removeClass:function(t){return this.el.removeClass(t),this},addClass:function(t){return this.el.addClass(t),this},hasClass:function(t){return this.el.hasClass(t)},hasCls:function(t){return this.hasClass(t)},setDisabled:function(t){(this.disabled=t)?this.el.attr("disabled","disabled"):this.el.attr("disabled","")},show:function(){return!1!==this.fire("beforeshow")&&(this.el.show(),this.fire("show")),this},hide:function(t){var i=this;return!1!==this.fire("beforehide")&&(this.el.hide(),i.destroy&&(i.el.remove(),delete i),i.fire("hide"),t)&&t(),this},getRootContainer:function(){return this.rootContainer},getId:function(){return this.id},up:function(t){var i=this.getBubbleTarget();if(t)for(;i;i=i.getBubbleTarget())if(e.is(i,t))return i;return i},getBubbleTarget:function(){return this.ownerCt},addCmpEvents:function(){},set:function(t,i){this[t]=i},get:function(t){return this[t]},isType:function(t){return UFO.isType(this,t)}}),r},{requires:["node","./EventSupport","./ComponentQuery"]});