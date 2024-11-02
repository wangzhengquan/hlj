/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '{{#each products}}\n	 \n		<li class="product-item">\n			<a class="card-item" href="javascript:;" data-id="{{product_id}}">\n				 {{#if promotion_pic}}\n				  	<label class="corner-label"><img src="{{getImgAbsolutePath promotion_pic}}" width="100%"> </label>\n				 {{/if}}\n		  		{{#if service_mode}}\n			     <label class="one2many-label"><img src="{{getImgAbsolutePath product_ext_info_multiple.apply_status_icon}}" style="width:100%;"></label>\n				{{/if}}\n				<img src="../resources/images/default_product.png" class="product-img" data-ks-lazyload="{{getImgAbsolutePath image}}" width="100%" />\n				<span class="item-info">\n					<span class="desc">{{name}}</span> \n					<span class="flex row-center detail">\n						<font class="price">￥{{price}}</font>\n						<span class="times">\n							{{#if service_mode}}\n							已报 <i style="color:f784a7;">{{product_ext_info_multiple.apply_nums}}</i>人\n							{{else}}\n							{{sold_amount}}人做过\n							{{/if}}\n						</span>\n					</span>\n				</span>\n			</a>\n		</li>\n	 \n{{/each}}\n';
});