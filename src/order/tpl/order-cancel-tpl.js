/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '<!--\n		<section class="section section-amount">\n			<div class="flex-item hairline-remove"><span>退款金额</span> <span style="color:#f97fa4;">￥58</span></div>\n			<div class="flex-item color-light hairline-remove"><span>实付金额</span> <span>￥78</span></div>\n		</section>\n-->		\n<section class="section hairline-top hairline-bottom">\n	<a action="check_rule"  href="javascript:;" class="item item-icon-right hairline-remove">\n		<span>退款规则</span>\n		<i class="icon iconfont icon-forward" style="color:#d6dadd; font-size: 14px;"></i>\n	</a>\n</section>\n\n<section class="section section-reason">\n	<h3 class="item title">取消原因</h3>\n	<div>\n			{{#each reasons}}\n			<div class="item item-checkbox item-checkbox-right" data-index="{{xindex}}">\n				 {{this}}\n				 <label class="checkbox checkbox-love">\n				   <input type="radio" name="reason" value="{{xindex}}">\n				 </label>\n			</div>\n			{{/each}}\n			 \n	</div>\n</section>\n\n<section class="section section-reason-input" style="display:none;">\n	<!-- <h3 class="title" >\n		告诉小河狸我们会做的更好\n	</h3> -->\n	<div class="textarea-wrapper clearfix">\n		<textarea name="other_reason" class="textarea-reason" maxlength="200"  placeholder="请填写取消原因，以帮助我们改进服务。"></textarea>\n		<span class="max-input-tip">您还可以输入<i class="hightlight">200</i>字</span>\n	</div>\n\n</section>\n\n<div style="padding:15px;">\n		<button class="button button-full button-commit" style="margin:0;" disabled>确认提交</button>\n</div>\n	 ';
});