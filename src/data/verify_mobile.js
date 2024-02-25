KISSY.add(function (S) {
  return function(param) {
    console.log("param=", param)
    
    return {
      ret: true,
      data: {
        mobild: param.mobild
      }
    }
  }
});