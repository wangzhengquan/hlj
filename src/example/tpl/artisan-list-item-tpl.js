/*
  Generated by kissy-tpl2mod.*/
KISSY.add(function () {
    return '{{#each data}}\n<a class="item item-avatar" href="./artisanDetail?artisan_id={{artisan_id}}">\n  <img src="{{getImgAbsolutePath avatar}}">\n  <h2>{{name}}</h2>\n  <p>服务次数{{service_count}}</p>\n</a>\n{{/each}}';
});