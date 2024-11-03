KISSY.add(function(S, require, exports, module){
	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
    	if (entry.isIntersecting) {
        entry.target.src = entry.target.getAttribute('data-ks-lazyload'); // 开始加载图片,把data-origin的值放到src
        observer.unobserve(entry.target); // 停止监听已开始加载的图片
        entry.target.removeAttribute('data-ks-lazyload');
      }
    });

       
    }, {
      threshold: 0,
      rootMargin: '200px'
    }
  );

	return {

    loadImages: function(images) {
    	images.forEach(function(image){observer.observe(image)} );
    }
       
	};
});
