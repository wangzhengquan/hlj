/*! 2024-03-19 */
KISSY.add(function(a,t,e,n,i,o,s){window;var c=['<div class="action-sheet-backdrop active" buttons="buttons">','\t<div class="action-sheet-wrapper">','\t\t<div class="action-sheet" >','\t\t\t<div class="action-sheet-group action-sheet-options">','\t\t\t\t<div class="action-sheet-title">Modify your album</div>',"\t\t\t</div>",'\t\t\t<div class="action-sheet-group action-sheet-cancel" >','\t\t\t\t<button class="button button-cancel">取消</button>',"\t\t\t</div>","\t\t</div>","\t</div>","</div>"].join("");function u(t){a.mix(t,{defaults:{cls:"action-sheet-option",type:"button"}},!1,void 0,!0),u.superclass.constructor.call(this,t)}return a.extend(u,i),UFO.augment(u,{alias:"actionsheet",initComponent:function(){this.el=a.one(c),this.actionSheetOptions=this.el.one(".action-sheet-options"),this.actionSheetWrapper=this.el.one(".action-sheet-wrapper"),u.superclass.initComponent.apply(this,arguments)},getBodyContainer:function(){return this.actionSheetOptions},add:function(t,e){for(var o=this,n=0,i=(t=a.isArray(t)?t:[t]).length;n<i;n++){var s=t[n];!function(t){var n=t.handler,i=(n&&(t.handler=function(t,e){!1!==n(t,e)&&o.slideOut()}),t.change);i&&(t.change=function(t,e){!1!==i(t,e)&&o.slideOut()})}(s="title"==s.type?'<div class="action-sheet-title">'+t[n].text+"</div>":s)}u.superclass.add.call(this,t,e)},show:function(t){return this.appended||(a.one(document.body).append(this.toEl()),this.appended=!0),u.superclass.show.apply(this,arguments),this},slideIn:function(){var e=this;this.show(),setTimeout(function(){e.actionSheetWrapper.addClass("action-sheet-up"),e.el.on("mouseup",function(t){console.log("mouseup",t);t=t.target;if(!e.actionSheetWrapper.contains(t)&&e.actionSheetWrapper.getDOMNode()!==t)return e.slideOut(),!1})},0)},slideOut:function(t){var e=this;e.actionSheetWrapper.removeClass("action-sheet-up"),setTimeout(function(){t&&t(),e.el.remove(),delete e},500)},addCmpEvents:function(){var e=this;this.el.delegate("click","button.button-cancel",function(t){e.slideOut()})}}),u},{requires:["node","event","xtemplate","../container/Container","../button/Button","../util/MouseEvent"]});