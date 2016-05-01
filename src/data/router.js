KISSY.add("APP/data/router",
  ["../util/ParamUtil", "./home_config", "./verify_mobile",
  "./banner_config", "./exchange", "./products_list", "./comments_list",
   "./products_tags", "./product", "./artisan", "./artisan_available_time", 
  "./artisans_list", "./products_label_list", "./orders_list", "./order", "./order_cancel_reason"],
  function (S, require, exports, module) {
    var ParamUtil = require("../util/ParamUtil");

    Mock.mock(/\.json/, function (options) {
      console.log("XMLHttpRequest: ", options.url)
      if (options.url.indexOf('/home_config.json') >= 0) {
        return require("./home_config");
      }
      else if (options.url.indexOf('/banner_config.json') >= 0) {
        return require("./banner_config");
      }
      else if (options.url.indexOf('/exchange.json') >= 0) {
        return require("./exchange");
      }
      else if (options.url.indexOf('/products.json') >= 0 || options.url.indexOf('/get_artisan_products_six.json') >= 0 ) {
        var products = require("./products_list");
        return products(options.url, ParamUtil.packParam(options.url))
      }
      else if (options.url.indexOf('/get_product_tags.json') >= 0) {
        var products_tag = require("./products_tags");
        return products_tag(ParamUtil.packParam(options.url))
      }
      else if (options.url.indexOf('/product_detail.json') >= 0) {
        var product = require("./product");
        return product(ParamUtil.packParam(options.url))
      }
      else if (options.url.indexOf('/artisan_customer_date_list.json') >= 0) {
        return require("./artisan_available_time");
      }
      else if (options.url.indexOf('/artisan_common_list.json') >= 0) {
        var comments_list = require("./comments_list");
        return comments_list(ParamUtil.packParam(options.url))
      }
      else if (options.url.indexOf('/artisans.json') >= 0) {
        return  require("./artisans_list");
      }
      else if (options.url.indexOf('/get_product_label_list.json') >= 0) {
        return  require("./products_label_list");
      }
      else if (options.url.indexOf('/verify_mobile.json') >= 0) {
        return  require("./verify_mobile")(ParamUtil.packParam(options.url));
      }
      else if (options.url.indexOf('/orders.json') >= 0) {
        return  require("./orders_list");
      }
      else if (options.url.indexOf('/order_detail.json') >= 0) {
        return  require("./order");
      }
      else if (options.url.indexOf('/cancel_reason.json') >= 0) {
        return  require("./order_cancel_reason");
      }
      else if (options.url.indexOf('/artisan_detail.json') >= 0) {
        return  require("./artisan");
      }
      
      
      else {
        console.error("XMLHttpRequest error: ", options.url)
        return {}
      }

    });
  });