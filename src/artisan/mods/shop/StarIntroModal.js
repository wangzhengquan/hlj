KISSY.add(function(S, Node, XTemplate , Modal, ScrollView){
	var tpl = [
		       ' <div class="main" style="background-color:#f5f5f5;">',
	           '    <header class="bar-love header bar">',
	           '	   	<a class="button button-clear button-back icon iconfont icon-back" href="javascript:;"> </a>',
	           '	   	<h1 class="title">',
	           '	   		匠星等级图示',
	           '	   	</h1>',
	           '    </header>',
	           '    <div class="pane">',
	           '		<div class="scroll-content has-header">',
	           '		</div>', 
	           '	</div>', 
	           '</div>'
	           ].join('');
	
	var startIntroTpl = new XTemplate ([
		'<div class="star-intro">',
		'		<ul class="list">',
		' 		    {{#each starLevels}}',
		'			<li class="item border-box flex row-center">',
		'				<img src="../resources/images/star/{{level}}.gif" style="width: {{25*level}}px;">',
		'				{{#if glory}}<img src="../resources/images/star/glory.jpg" style="width: 22px; margin-top:6px;margin-left:-3px;" >{{/if}}',
		'				<label class="star-info">({{name}}) </label>',
		'			</li>',
		'			{{/each}}',
		'			{{#with description}}',
		'			<li class="item detail">',
		'				<h1 style="text-align:center;">《{{title}}》 </h1>',
		'				{{#each paragraphes}}',
		'				<p>',
		'					{{this}}',
		'				</p>',
		'				{{/each}}',
		'			</li>',
		'		{{/with}}',
		'		</ul>',
		'</div>'
        ].join(''));
	
	 
	
	function StarIntroModal(config){
		//animation: 'slide-in-right'
	    //animation: 'slide-in-up'
		StarIntroModal.superclass.constructor.call(this, config);
	}
	
	S.extend(StarIntroModal, Modal);
	
	UFO.augment(StarIntroModal, {
		alias: 'StarIntroModal',
		
		initComponent: function(){
			this.mainBody = S.one(tpl);
			 
			this.content = this.mainBody.one('.scroll-content');
			 
			StarIntroModal.superclass.initComponent.apply(this, arguments);
			
			this.modal.append(this.mainBody);
			this.init();
		},
		 
		init: function(){
			this.content.append(startIntroTpl.render({
				starLevels:[{
						level: 1,
						name:'合格'
					},{
						level: 2,
						name:'出色'
					},{
						level: 3,
						name:'优秀'
					},{
						level: 4,
						name:'卓越'
					},{
						level: 5,
						name:'顶级'
					},{
						level: 5,
						name:'梦幻',
						glory: 1
							
					}
				],
				description:{
					title:'匠星的由来',
					paragraphes:[
			             '匠人如神，星辉闪耀——手艺人的等级标准，谓之“匠星”。',
			             '匠星的评定，由“同行评议”得来。例如一个3星级手艺人想申请4星晋升，则由不少于15人的4星同行手艺人，匿名给出评定。这个百年来在西方学术界的评定手段，能够兼顾公平与效率。',
			             '有趣的是：“升星”由“同行”的匿名评议判断，而“降星”则由顾客的“评价”决定。哪怕同行的评价再高，如果顾客给出较多的“不满意”，也会被降星。',
			             '著名的米其林餐厅等级评定，一星意味着同类餐厅中出类拔萃，应该专程去吃；二星意味着罕见的出色餐厅，即使绕路也应该去吃；三星意味着国际顶级，值得为这家餐厅安排一次旅行。',
			             '而权威的唱片评级《企鹅唱片指南》除了三颗星的评价之外，还有一个鼎鼎大名的“三星带花”标准，这个花指的是除了品质顶级之外，还有额外的历史意义、收藏价值，是极品中的顶尖。',
			             '河狸家的星级制度，吸收了上述二者的理念。一星意味着“合格”，二星意味着“出色”，这两个阶段，等同于在并不昂贵的同时，手艺很有保障；三星意味着“优秀”，四星意味着“卓越”，这两个阶段，等同于在行业内，非同凡响，三星已是出众，四星实乃翘楚，他们都是“自品牌手艺人”中的佼佼者；而五星和五星带花，则意味着“顶级”和“梦幻”，带花的含义是“额外的殊荣”，也许是明星御用，也许是国际大奖获得者……',
			             ['河狸家以荣誉担保，我们对此星级评定，绝不掺杂任何主观臆断，更不容许有任何黑幕。我们只想捍卫那些手艺人姓名的尊严，用“同行评议”和“顾客回评”体系，来得出“最接近真相”的匠星评级。',
			              '您每次享受河狸家“自品牌手艺人”的服务后，请郑重投出宝贵一票！'].join('')
					
				    ]
				}
					
				 
			}));
		},
		
		getBodyContainer: function(){
			 return this.content;
		},
		
		addCmpEvents: function(){
			var me = this;
			
			this.el.delegate('click', '.button-back', function(event){
				me.slideOut();
			});
			
		}
		 
		
	 
	});
	
	return StarIntroModal;
}, {
	requires: ['node', 'xtemplate',
	           'UFO/modal/Modal', 
	           'UFO/scroll/ScrollView' 
	          ]
});
