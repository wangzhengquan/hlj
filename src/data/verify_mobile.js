KISSY.add(function (S, app) {
  return function(param) {
    console.log("param=", param)
    if (param.mobile.trim() == '') {
      return {ret: false}
    } else {
      return {
        ret: true,
        data: {
          mobile: param.mobile,
          user_id: '25aa15ef06a44695ab4880bfeb511db7',
          token: 'SqBBEc7Yqeo15Rkhi0ga',
          user_address: [
            {
              city: app.getCity()
            }
          ]
        }
      }
    }
    
  }
}, {
	requires: ['../app']
});