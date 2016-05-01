/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '<section>\n		<div class="item item-thumbnail-left item-header">\n			<a class="item-image" data-url="{{#if large_avatar}}{{large_avatar}}{{else}}{{avatar}}{{/if}}" style="left:0;" href="javascript:;">\n			<img class="header-img" src="{{#if avatar}}{{getImgAbsolutePath avatar}}{{else}}../resources/images/default_user.png{{/if}}"> </a>\n			<div class="item-detail">\n				<h3 class="name">{{name}}</h3>\n				<a href="javascript:;" class="star-info">\n					{{#if artisan_level}}\n					<img src="../resources/images/star/{{artisan_level*0.5}}.gif" style="width:{{calWidth artisan_level}}px;"> \n					{{/if}}\n					{{#if artisan_glory}}<img src="../resources/images/star/glory.jpg" style="width: 20px; margin-top:3px; margin-left:-7px;" >{{/if}}\n					({{artisan_level_value}})\n				</a>\n				<div class="flex row-center detail">\n					<span class="price">均价:￥{{ave_price}}</span>\n					<span class="time">接单数:{{service_times}}</span>\n				</div>\n			</div>\n		</div>\n	\n		<ul class="item item-score flex row-divid-line-col" style="padding-top:10px; padding-bottom:10px;">\n			<li class="col">专业：<i class="i1">{{fixedDigits score_skill}}</i></li>\n			<li class="col">沟通：<i class="i2">{{fixedDigits score_communication}}</i></li>\n			<li class="col">守时：<i class="i3">{{fixedDigits score_punctuality}}</i></li>\n		</ul>\n		{{#if store_serial}}\n		<a class="item  item-icon-right" href="./shopDisplay.html?store_serial={{store_serial}}&isApp={{isApp}}">\n		  <label class="item-label">来自：</label>\n		  {{store_name}}\n			<i class="icon iconfont icon-forward"></i>\n		</a>\n		{{/if}}\n	</section>	';
});