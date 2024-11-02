KISSY.add(function(S, require, exports, module){
	return {

    loadImages: function(imgs) {
    	for (var i=0; i < imgs.length; i++) {
    		const img = imgs[i];
    		const observer = new IntersectionObserver(function(entries) {
		        const entry = entries[0];
		        if(entry.isIntersecting && img.getAttribute('data-ks-lazyload')) {
		        	img.src = img.getAttribute('data-ks-lazyload');
		        	img.removeAttribute('data-ks-lazyload');
		        }
		      }, {
		        threshold: 0,
		      }
		    );
		    observer.observe(img);
    	}
    	 
    }
       
	};
});
