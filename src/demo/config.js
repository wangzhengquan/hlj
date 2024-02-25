(function(global){
	var tag = "20151021";
	KISSY.config({
		packages:{
			UFO: {
				path:"../../ufo/src",
				charset:"utf-8",
				combine:false,
				//tag:KISSY.now(),
				tag: tag,
				ignorePackageNameInUri:true,
				debug:true
			},
			mui: {
				path:"../../../lib/kissy/mui",
				charset:"utf-8",
				combine:false,
				//tag:KISSY.now(),
				tag: tag,
				ignorePackageNameInUri:true,
				debug:true
			},
			app: {
				path:"../",
				charset:"utf-8",
				combine:false,
				//tag:KISSY.now(),
				tag: tag,
				ignorePackageNameInUri:true,
				debug:true
			}

		}
	});
})(window);
