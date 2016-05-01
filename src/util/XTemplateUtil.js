/**
 * XTemplateUtil
 */
KISSY.add(function (S, XTemplate, UFODate, app) {
	XTemplate.addCommand('getImgAbsolutePath', function (scopes, option) {
		//console.log('img', option.params[0]);
		var path = option.params[0];
		if (path) {
			return app.config.imgBaseUrl + (path.indexOf('/') === 0 ? path.substr(1) : path);
		} else {
			return '../resources/images/default_user.png';
		}
	});

	XTemplate.addCommand('formatPrice', function (scopes, option) {
		return Number(option.params[0]).toFixed(2);
	});

	XTemplate.addCommand('formatDateTime', function (scopes, option) {
		var datetime = option.params[0],
			format = "yyyy-MM-dd";

		if (S.isNumber(datetime)) {
			datetime = new Date(datetime);
		}
		if (option.params.length === 2) {
			format = option.params[1];
		}
		return UFODate.format(datetime, format);
	});



	XTemplate.addCommand('fixedDigits', function (scopes, option) {

		var digitsLen = 2;
		if (option.params.length === 2) {
			digitsLen = option.params[1];
		}
		return Number(option.params[0]).toFixed(digitsLen);
	});

	XTemplate.addCommand('join', function (scopes, option) {
		var separator = ",";
		if (option.params.length === 2) {
			separator = option.params[1];
		}
		return option.params[0].join(separator);
	});

	XTemplate.addCommand('getHost', function (scopes, option) {
		return location.host;
	});


	XTemplate.addCommand('encodeURIComponent', function (scopes, option) {
		return encodeURIComponent(option.params[0]);
	});

	return {}
}, {
	requires: ["xtemplate", "UFO/core/lang/Date", "../app"]
});
