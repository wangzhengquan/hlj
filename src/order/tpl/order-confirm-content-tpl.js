/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '<section  class="section">\n		<a  href="javascript:;" class="item item-icon-right hairline-remove">\n			<span>{{order.user_name}}</span>&nbsp; <span>{{order.user_mobile}}</span>\n			<i class="icon iconfont icon-forward"></i>\n		</a>\n</section>\n<section class="section list-block">\n	<ul class="">\n		<li>\n			<a href="javascript:;">\n				<div class="item-content">\n            <div class="item-media">\n            	<i class="icon iconfont icon-datetime" style="color:#8284a4;"></i>\n            </div>\n            <div class="item-inner"> \n						<!-- service_mode -->\n              <div class="item-title">{{order.reserve_time}}</div>\n            </div>\n          </div>\n			</a>\n		</li>\n		\n		<li>\n			<a href="javascript:;" >\n				<div class="item-content">\n            <div class="item-media">\n            	<i class="icon iconfont icon-location" style="color:#f7ad58;"></i>\n            </div>\n            <div class="item-inner" style="padding-right: 15px;"> \n              <div class="item-title" style="white-space: normal;">{{order.address}}</div>\n            </div>\n          </div>\n			</a>\n		</li>\n	</ul>\n</section>\n\n<section class="section sec-artisan list-block">\n	<div class="flex-item item-arstisan">\n		<a href="../artisan/index.html?artisan={{order.artisan_id}}" class="artisan-header">\n		<!--artisan_avatar -->\n			<img src="{{getImgAbsolutePath order.artisan_avatar}}">\n			{{order.artisan_name}}\n		</a>\n	 \n	</div>	\n	<div class="" style="padding-left:15px;">\n			<a href="../product/index.html?product_id={{order.product_id}}" class="flex-item  no-padding-left item-icon-right">\n				<div class="product clear-float">\n					<img class="product-img fl" src="{{getImgAbsolutePath order.product_pic}}">\n					<div class="fl">\n							<div class="product-info" style="margin-auto;">\n									<div class="name"> {{order.product_name}}</div>\n									<div class="price" name="product_price">￥{{formatPrice order.product_price}}</div>\n							</div>\n					</div>\n				</div>\n				\n				<!--\n				<i class="icon iconfont icon-forward"></i>\n				-->\n			</a>\n			\n			<ul class="hairline-remove hairline-remove-top">\n			<!-- \n				<li>\n					<a href="javascript:;">\n						<div class="item-content no-padding-left">\n		            <div class="item-media">\n		            	<i class="icon iconfont icon-coupons"></i>\n		            </div>\n		            <div class="item-inner"> \n		              <div class="item-title">河狸家周年庆每单减50元</div>\n		            </div>\n		          </div>\n					</a>\n				</li>\n			 -->\n			 <!-- 优惠券 -->\n			 {{^if order.order_id}}\n				<li>\n					<a href="javascript:;" class="item-link" action="showCouponModal">\n						<div class="item-content no-padding-left">\n		            <div class="item-media">\n		            	<i class="icon iconfont icon-coupons"></i>\n		            </div>\n		            <div class="item-inner item-icon-right"> \n		              <div class="item-title coupon-name" style="white-space: normal;"></div>\n		              <div class="coupon-price"></div>\n		              <i class="icon iconfont icon-forward"></i>\n		            </div>\n		          </div>\n					</a>\n				</li>\n				{{/if}}\n			</ul>\n			\n	</div>\n	\n	<div class="flex-item hairline-top">\n		<span>实付金额</span>\n		<span class="price" name="real_pay" style="font-weight: bold;">\n		￥{{#if order.extra_fee_price>0}}{{formatPrice order.extra_fee_price}}{{else}}{{formatPrice order.should_pay_price}}{{/if}}\n		</span>\n	</div>\n</section>\n\n{{^if order.order_id}}\n<section class="section">\n	<div class="item item-toggle hairline-remove" style="font-size:12px;">\n	 <div class="item-title">河狸家赠送意外险，保障人身及财产安全</div> \n	 <label class="toggle toggle-love">\n	   <input type="checkbox" value="on" name="insurance_handle">\n	   <div class="track">\n		 <div class="handle"></div>\n	   </div>\n	 </label>\n  </div>\n  \n  <div name="form_insurance" class="form-insurance hairline-top hairline-bottom" >\n  	<label class=" item-input">\n	    <span class="input-label">投保人:</span>\n	    <input type="text" name="insured_name">\n	  </label>\n	  \n	  <label class=" item-input">\n	    <span class="input-label">身份证:</span>\n	    <input type="text" name="insured_identity">\n	  </label>\n	  \n	  <p style="font-size:12px;">\n	  	本保险保费由河狸家承担，无需消费者额外支付。选择即为默认同意<a href="http://www.helijia.com/active/safe/index.html" class="color-love">《投保须知》&《保险同款》</a>\n	  </p>\n  </div>\n</section>\n{{/if}}\n\n<section class="section">\n	<div class="item">	\n		支付方式\n	</div>\n	<div class="pay-list">\n	{{#each pay_way_list}}\n		<label class="item item-radio" data-index="">\n			<div class="item-content">\n				<span class="pay-logo {{logoCls}}"></span>\n				 {{title}}\n			</div>\n			<input type="radio" {{#if isDefault}}checked{{/if}} name="pay_way" value="{{value}}"/>\n			<div class="round-radio"></div>\n		</label>\n	{{/each}}\n	 \n	 \n		\n		\n	</div>\n</section>\n\n<section class="section" style="padding: 10 15px;">\n	<button action="submit-order" class="button button-full button-love">去支付</button>\n</section>\n';
});