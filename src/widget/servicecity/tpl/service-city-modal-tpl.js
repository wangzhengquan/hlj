/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '	<div class="main background">\n  	<div class="bar-love bar bar-header disable-user-behavior">\n			<div class="buttons buttons-left" style="transition-duration: 0ms;">\n				<button class="button button-clear iconfont icon-close" action="close"> </button>			 \n 			</div>\n			<div class="title title-center header-item" style="transform: translate3d(0px, 0px, 0px);">\n				选择城市\n			</div>\n		</div>\n	  \n	  <div class="pane has-header" style="min-height:375px; overflow: auto;">\n 			<div class="scroll-content background">\n 					<div class="item item-divider ">GPS定位城市</div>\n 					<a href="javascript:;" name="cur-city" class="item"></a>\n 					<div class="item item-divider ">已开通服务城市</div>\n 					<ul name="service-city-list" class="list padding-left hairline-bottom" style="background:#fff;">\n 						{{#each this}}\n 						<label data-code="{{code}}" data-name="{{name}}" class="item item-radio">\n							<div class="item-content">\n							  {{name}}\n							</div>\n							<input type="radio" name="group" value="on">\n							<i class="iconfont radio-icon icon-checkmark"></i>\n						</label>\n						{{/each}}\n 					</ul>\n 			</div>\n 		</div>\n  </div>';
});