KISSY.add(function(S, Slide){
	
	return {
		init: function(){
			C = new Slide('slides',{
				autoSlide:false,
				hoverStop:true,
				effect:'hSlide',
				timeout:3000,
				speed:300,
				invisibleStop:true,
				eventType:'mouseover',
				triggerDelay:400,
				defaultTab:5,
				selectedClass:'current',
				carousel:true,
				touchmove:true,
				colspan: 2
			}).on('afterSwitch',function(){
			});
		//C.stop();
		S.one('#J_pre').on('click',function(e){
			e.halt();
			C.previous();
			if(C.autoSlide && C.stoped === false){
				C.stop().play();
			}
		});
		S.one('#J_next').on('click',function(e){
			e.halt();
			C.next();
			if(C.autoSlide && C.stoped === false){
				C.stop().play();
			}
		});
		S.all('#slides img').on('click',function(){
			// alert(22);	
		});
		}
	}
},{
	requires: ["MUI/slider/2.0.2/index"]
});
