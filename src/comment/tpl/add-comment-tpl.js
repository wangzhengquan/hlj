/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '<form name="comment-form">\n<section class="sec-comment-level">\n	<ul class="row">\n		<li class="col">\n			<label class="item-radio">\n				<input type="radio" name="star" value="bad" {{#if evaluate==="data.bad"}}checked{{/if}}>\n				<div class="button-comment-level">\n					<div class="">\n							<i class="icon icon-comment-level-1" ></i>\n						<span class="level-title">不满意</span>\n					</div>\n				</div>\n			</label>\n		</li>\n		<li class="col">\n			<label class="item-radio">\n				<input type="radio" name="star" value="normal" {{#if data.evaluate==="normal"}}checked{{/if}}>\n				<div class="button-comment-level">\n					<div class="">\n							<i class="icon icon-comment-level-2"></i>\n						<span class="level-title">基本满意</span>\n					</div>\n				</div>\n			</label>\n		</li>\n		<li class="col">\n			<label class="item-radio">\n				<input type="radio" name="star" value="good" {{#if  data.evaluate==="good"}}checked{{/if}}>\n				<div class="button-comment-level">\n					<div class="">\n							<i class="icon icon-comment-level-3"></i>\n						<span class="level-title">很满意</span>\n					</div>\n				</div>\n			</label>\n		</li>\n		<li class="col">\n			<label class="item-radio">\n				<input type="radio" name="star" value="excited" {{#if  data.evaluate==="excited"}}checked{{/if}}>\n				<div class="button-comment-level">\n					<div class="">\n							<i class="icon icon-comment-level-4"></i>\n						<span class="level-title">超出期待</span>\n					</div>\n				</div>\n			</label>\n		</li>\n	</ul>\n</section>\n\n<section class="sec-content">\n	<textarea name="contents" class="comment-content">{{data.contents}}</textarea>\n	<div class="comment-pic">\n		<i class="icon icon-camera"></i>\n		<ul class="add-pic-wrapper">\n			{{#each data.photos}}\n			<li class="button-add-pic">\n				<div class="pic">{{#if this}}<img src="{{getImgAbsolutePath this}}"> {{else}} <i>+</i> {{/if}}</div>\n				<input type="file" {{#if this}}value="{{getImgAbsolutePath this}}"{{/if}}>\n			</li>\n			{{/each}}\n		 \n		</ul>\n	</div>\n</section>\n\n<section class="sec-star">\n	<div class="flex-item no-padding-left">\n	 <span>专业</span>\n	 <div class="star-wrapper">\n		{{#each stars}}\n	 		<a class="button-star{{#if xindex<../data.score_skill}} active{{/if}}">\n		 		<i class="icon icon-star"></i>\n		 		<i class="icon icon-star-solid"></i>\n		 	</a>\n	 	{{/each}}\n	 </div>\n	 <textfield class="score" name="score_skill" data-type="number" data-value="{{data.score_skill}}">{{data.score_skill}}</textfield>\n	</div>\n	\n	<div class="flex-item no-padding-left">\n	 <span>沟通</span>\n	 <div class="star-wrapper">\n	 	{{#each stars}}\n	 		<a class="button-star{{#if xindex<../data.score_communication}} active{{/if}}">\n		 		<i class="icon icon-star"></i>\n		 		<i class="icon icon-star-solid"></i>\n		 	</a>\n	 	{{/each}}\n	 </div>\n	 <textfield class="score" name="score_communication" data-type="number" data-value="{{data.score_communication}}">{{data.score_communication}}</textfield>\n	</div>\n	\n	<div class="flex-item no-padding-left">\n	 <span>守时</span>\n	 <div class="star-wrapper">\n	 	{{#each stars}}\n	 		<a class="button-star{{#if xindex<../data.score_punctuality}} active{{/if}}">\n		 		<i class="icon icon-star"></i>\n		 		<i class="icon icon-star-solid"></i>\n		 	</a>\n	 	{{/each}}\n	 </div>\n	 <textfield class="score" name="score_punctuality" data-type="number" data-value="{{data.score_punctuality}}">{{data.score_punctuality}}</textfield>\n	</div>\n</section>\n</form>';
});