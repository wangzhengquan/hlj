/**
 * @file base.js
 * @brief Slide
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2013-01-08
 */
/*jshint smarttabs:true,browser:true,devel:true,sub:true,evil:true */
modulex.add(function (require, exports, module) {
	var Util = require('util');
	var _$ = require('node');
	var JSON = require('json');
	var Event = require('event-custom');
	var SlideUtil = require('./slide-util');
	var UA = require('ua');
	'use strict';
	// $ is $
	var $ = _$.all;
	// BSlide构造器
	// TODO BSlide工厂
	var BSlide = function () {
		// TODO 如何传参?
		if (!(this instanceof BSlide)) {
			throw new Error('please use "new Slide()"');
		}
		this.init.apply(this, arguments);
	};
	// TODO 抽离切换“机制”和实现的方法
	BSlide.plug = function (fn) {
		var self = this;
	};

	function getElementSize(el){
		return {
			'height': el.height(),
			'width': el.width()
		};
	}

	// S.Event = S.config('mini') ? S.Node.node : S.Event;
	// 扩充BSlide
	Util.augment(BSlide, Event.Target, {
		// 构造函数
		init: function (selector, config) {
			var self = this;
			if (Util.isObject(selector)) {
				self.con = selector;
			} else if (/^#/i.test(selector)) {
				self.con = _$.one(selector);
			} else if (_$.one('#' + selector)) {
				self.con = _$.one('#' + selector);
			} else if (_$.one(selector)) {
				self.con = _$.one(selector);
			} else {
				throw new Error('Slide Container Hooker not found');
			}
			//接受参数
			self.buildParam(config);
			//构造函数
			self.buildHTML();
			//绑定事件
			self.bindEvent();
			// TODO:这句话永远无法触发ready事件
			self.fire('ready', {
				index: 0,
				navnode: self.tabs.item(0),
				pannelnode: self.pannels.item(0)
			});
			if (self.reverse) {
				var _t;
				_t = self.previous;
				self.previous = self.next;
				self.next = _t;
			}
			// 在移动终端中的优化
			if (self.carousel) {
				for (var i = 0; i < self.colspan; i++) {
					self.fix_for_transition_when_carousel(i * 2);
				}
			}
			self.fixSlideSize();
			// LayerSlide 效果增强
			if (self.layerSlide) {
				self.initLayer();
			}
			self.stoped = null;
			// 渲染当前帧的lazyload的内容
			self.renderPannelTextarea(self.currentTab);
			return this;
		},
		// offset 1,-1
		setWrapperSize: function (offset) {
			var self = this;
			if (SlideUtil.isUndefined(offset)) {
				offset = 0;
			}
			self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
			self.length = self.pannels.length;
			var reHandleSize = {
				'none': function () {
				},
				'vSlide': function () {
					//统一容器和item的宽高及选中默认值
					var animconRegion = getElementSize(self.animcon);
					self.animwrap.css({ 'height': (self.length + offset) * animconRegion.height / self.colspan + 'px' });
				},
				'hSlide': function () {
					//统一容器和item的宽高及选中默认值
					var animconRegion = getElementSize(self.animcon);
					self.animwrap.css({ 'width': (self.length + offset) * animconRegion.width / self.colspan + 'px' });
				},
				'fade': function () {
				}
			};
			reHandleSize[self.effect]();
			// 如果传入offset 说明仅仅计算wrapper的宽度
			if (!SlideUtil.isUndefined(offset)) {
				self.relocateCurrentTab();
			}
			return this;
		},
		// 添加一个帧，index为添加到的索引，默认添加到最后
		add: function (node, index) {
			var self = this;
			if (SlideUtil.isUndefined(index) || index > self.length) {
				index = self.length;
			}
			if (Util.isString(node)) {
				node = _$.one(node);
			}
			/*
				node.css({
					float:'left'	
				});
				*/
			// bugfix pad/phone中避免闪屏
			/*
			* pad/phone中容器宽度>=641时，dom上的样式改变会有reflow，小于时，没有reflow
			* 在phone中会比较平滑，不会有闪屏
			*
			*/
			if (self.transitions) {
				node.css({ visibility: 'hidden' });
			}
			if (index == self.length) {
				// bugfix，防止在webkit中因为设置了backface属性，导致dom操作渲染延迟，slide操作会有闪烁
				setTimeout(function () {
					self.setWrapperSize(1);
				}, 0);
				node.insertAfter(self.pannels[index - 1]);
			} else {
				node.insertBefore(self.pannels[index]);
			}
			self.setWrapperSize();
			self.fixSlideSize(self.currentTab);
			// bugfix pad/phone中避免闪屏
			if (self.transitions) {
				node.css({ visibility: '' });
			}
			if (self.transitions) {
			}
			return this;	// TODO 添加面板的时候，没有添加导航
		},
		remove: function (index) {
			var self = this;
			if (self.length === 1) {
				return;
			}
			// 删除当前帧和之前帧时，currentTab需-1
			if (index <= self.currentTab) {
				self.currentTab--;
				self.length--;
			}
			// bugfix,防止移动设备中的闪屏
			if (self.transitions) {
				self.con.css({ display: 'none' });
			}
			_$.one(self.pannels[index]).remove();
			self.setWrapperSize();
			// bugfix,防止移动设备中的闪屏
			if (self.transitions) {
				self.con.css({ display: 'block' });
			}
			self.fixSlideSize(self.currentTab);
			// TODO 删除面板的时候，没有删除导航
			return this;
		},
		// 删除最后一帧
		removeLast: function () {
			var self = this;
			self.remove(self.length - 1);
			return self;
		},
		//渲染textarea中的内容，并放在与之相邻的一个div中，若有脚本，执行其中脚本
		renderLazyData: function (textarea) {
			var self = this;
			textarea.css('display', 'none');
			if (textarea.attr('lazy-data') == '1') {
				return;
			}
			textarea.attr('lazy-data', '1');
			if (SlideUtil.isUndefined(div)) {
				var id = String(Util.now());
			} else {
				var id = Util.stamp(div);
			}
			var html = textarea.html().replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'), div = _$('<div>' + html + '</div>');
			// S.DOM.insertBefore(div,textarea);
			_$.one(div).insertBefore(textarea);
			Util.globalEval(html);
		},
		// 渲染第index个pannel的延迟渲染的textarea
		renderPannelTextarea: function (index) {
			var self = this;
			if (!self.pannels.item(index)) {
				return;
			}
			var renderOnePannelT = function (index) {
				var con = _$.one(self.pannels.item(index));
				var scriptsArea = self.pannels.item(index).all('.data-lazyload');
				if (scriptsArea) {
					scriptsArea.each(function (node, i) {
						self.renderLazyData(node);
					});
				}
			};
			for (var i = 0; i < self.colspan; i++) {
				renderOnePannelT(index + i);
			}
		},
		// 如果是动画效果，则构建Wrap
		buildWrap: function () {
			var self = this;
			self.animwrap = _$('<div style="position:absolute;"></div>');
			self.animcon.children().appendTo(self.animwrap);
			self.animcon.empty().append(self.animwrap);
			self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
			return self;
		},
		// 各种动画效果的初始化行为
		// TODO 应当从BSLide中抽取出来
		doEffectInit: function () {
			var self = this;
			var effectInitFn = {
				'none': function () {
					self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
					self.pannels.css({ display: 'none' });
					self.pannels.item(self.defaultTab).css({ 'display': 'block' });
				},
				'vSlide': function () {
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = getElementSize(self.animcon);
					self.pannels.css({
						'float': 'none',
						'overflow': 'hidden'
					});
					self.animwrap.css({
						'height': self.length * animconRegion.height / self.colspan + 'px',
						'overflow': 'hidden',
						'top': -1 * self.defaultTab * animconRegion.height + 'px'
					});
				},
				'hSlide': function () {
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = getElementSize(self.animcon);
					self.pannels.css({
						'float': 'left',
						'overflow': 'hidden'
					});
					if (self.transitions) {
						self.animwrap.css({
							'overflow': 'hidden',
							'width': self.length * animconRegion.width / self.colspan + 'px',
							'-webkit-transition-duration': '0s',
							'-webkit-transform': 'translate3d(' + -1 * self.defaultTab * animconRegion.width + 'px,0,0)'
						});
					} else {
						self.animwrap.css({
							'width': self.length * animconRegion.width / self.colspan + 'px',
							'overflow': 'hidden',
							'left': -1 * self.defaultTab * animconRegion.width + 'px'
						});
					}
				},
				'fade': function () {
					self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
					self.pannels.css({
						'position': 'absolute',
						'zIndex': 0
					});
					self.pannels.each(function (node, i) {
						if (i == self.defaultTab) {
							//node.removeClass('hidden');
							node.css({
								'opacity': 1,
								'display': 'block'
							});
						} else {
							//node.addClass('hidden');
							node.css({
								'opacity': 0,
								'display': 'none'
							});
						}
					});
				}
			};
			effectInitFn[self.effect]();
			return this;
		},
		//构建html结构的全局函数
		buildHTML: function () {
			var self = this;
			var con = self.con;
			self.tabs = con.all('.' + self.navClass + ' ' + self.triggerSelector);
			var tmp_pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			self.length = tmp_pannels.length;
			if (!con.one('.' + self.navClass)) {
				_$('<ul class="' + self.navClass + '" style="display:none"></ul>').appendTo(self.con);
			}
			if (self.tabs.length === 0) {
				//nav.li没有指定，默认指定1234
				var t_con = con.all('.' + self.navClass);
				var t_str = '';
				for (var i = 0; i < self.length; i++) {
					var t_str_prefix = '';
					if (i === 0) {
						t_str_prefix = self.selectedClass;
					}
					t_str += '<li class="' + t_str_prefix + '"><a href="javascript:void(0);">' + (i + 1) + '</a></li>';
				}
				t_con.html(t_str);
			}
			self.tabs = con.all('.' + self.navClass + ' ' + self.triggerSelector);
			self.animcon = con.one('.' + self.contentClass);
			self.animwrap = null;
			self.doEffectInit();
			if (self.carousel) {
				self.fixSlideSize(self.currentTab - self.colspan);
				self.highlightNav(self.currentTab - self.colspan);
			} else {
				self.fixSlideSize(self.currentTab);
				self.highlightNav(self.getWrappedIndex(self.currentTab));
			}
			//添加选中的class
			//是否自动播放
			if (self.autoSlide === true) {
				// 如果设置了invisibleStop为true，还要多判断一下slide是否在可视区
				// 未设置invisibleStop为true，则直接自动播放
				if (self.invisibleStop && self.isSlideVisible() || !self.invisibleStop) {
					self.play();
				}
			}
			return this;
		},
		getCurrentPannel: function () {
			var self = this;
			return _$.one(self.pannels[self.currentTab]);
		},
		// 重新渲染slide内页(pannels)的宽度
		renderWidth: function () {
			var self = this;
			//有可能animcon没有定义宽度
			var width = getElementSize(self.animcon).width;
			if (self.effect == 'hSlide') {
				width /= self.colspan;
			}
			self.pannels.css({ width: width + 'px' });
			return this;
		},
		//重新渲染slide内页(pannels)的高度
		renderHeight: function () {
			var self = this;
			//有可能animcon没有定义高度
			var height = getElementSize(self.animcon).height;
			if (self.effect == 'vSlide') {
				height /= self.colspan;
			}
			self.pannels.css({ height: height + 'px' });
			return this;
		},
		//当当前帧的位置不正确时，重新定位当前帧到正确的位置,无动画
		relocateCurrentTab: function (index) {
			var self = this;
			if (SlideUtil.isUndefined(index)) {
				index = self.currentTab;
			}
			if (self.effect != 'hSlide') {
				return;
			}
			if (self.transitions) {
				self.animwrap.css({
					'-webkit-transition-duration': '0s',
					'-webkit-transform': 'translate3d(' + -1 * index * getElementSize(self.animcon).width / self.colspan + 'px,0,0)',
					'-webkit-backface-visibility': 'hidden'
				});
			} else {
				self.animwrap.css({ left: -1 * index * getElementSize(self.animcon).width / self.colspan });
			}
			self.currentTab = index;
			return this;
		},
		//根据配置条件修正控件尺寸
		// 重新渲染slide的尺寸，
		// 根据go到的index索引值渲染当前需要的长度和宽度
		fixSlideSize: function (index) {
			var self = this;
			if (self.adaptive_fixed_width) {
				self.renderWidth();
			}
			if (self.adaptive_fixed_height) {
				self.renderHeight();
			}
			if (self.adaptive_fixed_size) {
				self.renderHeight().renderWidth();
			}
			self.resetSlideSize(index);
			return this;
		},
		// timmer 是指的动态监控wrapperCon高度的定时器
		// wrapperCon在很多时候高度是可变的
		// 这时就需要timmer来监听了
		removeHeightTimmer: function () {
			var self = this;
			if (!SlideUtil.isNull(self.heightTimmer)) {
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}
		},
		addHeightTimmer: function () {
			var self = this;
			if (!SlideUtil.isNull(self.heightTimmer)) {
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}
			var resetHeight = function () {
				if (self.effect == 'hSlide') {
					self.animcon.css({ height: getElementSize(self.pannels.item(self.currentTab)).height + 'px' });
				}
			};
			self.heightTimmer = setInterval(resetHeight, 100);
			resetHeight();
		},
		//在before_switch和windowResize的时候执行，根据spec_width是否指定，来决定是否重置页面中的适配出来的宽度和高度并赋值
		// index是go的目标tab-pannel的索引
		// 这个函数主要针对横向滚动时各个pannel高度不定的情况
		resetSlideSize: function (index) {
			var self = this;
			var width, height;
			if (typeof index == 'undefined' || index === null) {
				index = self.currentTab;
			}
			// 如果没有开关，或者没有滑动特效，则退出函数
			if (self.effect != 'hSlide' && self.effect != 'vSlide') {
				return;
			}
			//var width = self.spec_width();
			if (self.effect == 'hSlide') {
				width = self.adaptive_width ? self.adaptive_width() : getElementSize(self.animcon).width;
				height = getElementSize(self.pannels.item(index)).height;
				// 修复resize时animwrap尺寸计算有误
				self.animwrap.css({ width: self.pannels.length * width + 'px' });
				width /= self.colspan;
				// pannels的高度是不定的，高度是根据内容
				// 来撑开的因此不能设置高度，而宽度则需要设置
				self.pannels.css({
					width: width + 'px',
					display: 'block'
				});
				self.animcon.css({
					width: width * self.colspan + 'px',
					overflow: 'hidden'
				});
				if (self.animWrapperAutoHeightSetting) {
					self.animcon.css({
						height: height + 'px'	//强制pannel的内容不超过动画容器的范围
					});
				}
			}
			if (self.effect == 'vSlide') {
				width = getElementSize(self.pannels.item(index)).width;
				height = self.adaptive_height ? self.adaptive_height() : getElementSize(self.animcon).height;
				// 修复resize时animwrap尺寸计算有误
				self.animwrap.css({ height: self.pannels.length * height + 'px' });
				height /= self.colspan;
				self.pannels.css({
					height: height * self.colspan + 'px',
					display: 'block'
				});
				self.animcon.css({
					height: height * self.colspan + 'px',
					overflow: 'hidden'
				});
				if (self.animWrapperAutoHeightSetting) {
					self.animcon.css({
						width: width + 'px'	//强制pannel的内容不超过动画容器的范围
					});
				}
			}
			return this;
		},
		// 得到tabnav应当显示的当前index索引，0,1,2,3...
		getWrappedIndex: function (index) {
			var self = this, wrappedIndex = 0;
			if (index === 0) {
			}
			if (self.carousel) {
				if (index < self.colspan) {
					wrappedIndex = self.length - self.colspan * 3 + index;
				} else if (index >= self.length - self.colspan) {
					wrappedIndex = index - (self.length - self.colspan);
				} else {
					wrappedIndex = index - self.colspan;
				}
			} else {
				wrappedIndex = index;
			}
			return wrappedIndex;
		},
		getMousePosition: function () {
			var self = this;
			var domousemove = function (e) {
				self._t_mouseX = e.clientX;
				self._t_mouseY = e.clientY;
			};
			// S.Event.on(document,'mousemove',domousemove);
			_$.one(document).on('mousemove', domousemove);
			setTimeout(function () {
				// S.Event.detach(window,'mouseover',domousemove);
				_$.one(window).detach('mouseover', domousemove);
			}, self.triggerDelay);
		},
		// 大量触碰事件的处理，带上延时的过滤，防止频繁处理切换
		massTrigger: function (cb, el) {
			var self = this;
			if (!Util.inArray(self.eventType, [
					'mouseover',
					'mouseenter'
				])) {
				cb(_$.one(el));
				return;
			}
			self.getMousePosition();
			if (SlideUtil.isUndefined(self._fired) || SlideUtil.isNull(self._fired)) {
				self._fired = setTimeout(function () {
					if (self.inRegion([
							self._t_mouseX + _$.one(window).scrollLeft(),
							self._t_mouseY + _$.one(window).scrollTop()
						], _$.one(el))) {
						cb(_$.one(el));
					}
					self._fired = null;
				}, self.triggerDelay);
			} else {
				clearTimeout(self._fired);
				self._fired = setTimeout(function () {
					if (self.inRegion([
							self._t_mouseX + _$.one(window).scrollLeft(),
							self._t_mouseY + _$.one(window).scrollTop()
						], _$.one(el))) {
						cb(_$.one(el));
					}
					self._fired = null;
				}, self.triggerDelay);
			}
		},
		// 获取当前subLayer退出动画的delay最大值、
		getMaxAnimDelay: function (index) {
			var self = this, max = 0;
			if (!self.sublayers) {
				return;
			}
			Util.each(self.sublayers[index], function (sublayer) {
				if (sublayer.durationout + sublayer.delayout > max) {
					max = sublayer.durationout + sublayer.delayout;
				}
			});
			return max;
		},
		// 判断一个点是否在某个区域内
		inRegion: function (point, el) {
			var offset = el.offset();
			var layout = {
				width: el.width(),
				height: el.height()
			};
			if (point[0] >= offset.left && point[0] <= offset.left + layout.width) {
				if (point[1] >= offset.top && point[1] <= offset.top + layout.height) {
					return true;
				}
			}
			return false;
		},
		// 绑定默认事件
		bindEvent: function () {
			var self = this;
			if (Util.inArray(self.eventType, [
					'click',
					'mouseover',
					'mouseenter'
				])) {
				self.con.delegate(self.eventType, function (e) {
					//e.halt();
					e.preventDefault();
					self.massTrigger(function (el) {
						var ti = Number(self.tabs.index(el));
						if (self.carousel) {
							ti = (ti + 1) % self.length;
						}
						self.go(ti);
						if (self.autoSlide && self.stoped === false) {
							self.stop().play();
						}
					}, e.currentTarget);
				}, '.' + self.navClass + ' ' + self.triggerSelector);
			}
			// 是否支持鼠标悬停停止播放
			if (self.hoverStop) {
				self.con.delegate('mouseover', function (e) {
					//e.halt();
					self.isMouseover = true;
					// 增加对鼠标状态的标识
					if (self.autoSlide) {
						var stoped = self.stoped;
						self.stop();
						self.stoped = stoped;
					}
				}, '.' + self.contentClass + ' .' + self.pannelClass);
				self.con.delegate('mouseout', function (e) {
					//e.halt();
					self.isMouseover = false;
					if (self.autoSlide && self.stoped === false)
						self.play();
				}, '.' + self.contentClass + ' .' + self.pannelClass);
			}
			// 绑定窗口resize事件 
			_$.one(window).on('resize', function (e) {
				self.fixSlideSize(self.currentTab);
				self.relocateCurrentTab();
			});
			self.on('beforeSwitch', function (o) {
				if (typeof self.before_switch == 'function') {
					self._executeSwitch = self.before_switch();
					return self._executeSwitch;
				} else if (typeof self.before_switch == 'boolean') {
					self._executeSwitch = self.before_switch;
					return self.before_switch;
				} else {
					self._executeSwitch = true;
					return true;
				}	/*if(this.layerSlide && this.isAming()){
      	return false;
      }*/
			});
			//终端事件触屏事件绑定
			// TODO 触屏设备目前和ie6的降级方案实现一样,目前没实现降级
			// TODO 需要将触屏支持抽离出BSlide
			// if ( 'ontouchstart' in document.documentElement ) {
			if (true) {
				if (!self.touchmove) {
					return this;
				}
				self.con.delegate('touchstart', function (e) {
					self.stop();
					self.touching = true;
					if (self.is_last() && self.carousel) {
						self.fix_next_carousel();
					}
					if (self.is_first() && self.carousel) {
						self.fix_pre_carousel();
					}
					self.startX = e.changedTouches[0].clientX;
					self.startY = e.changedTouches[0].clientY;
					self.animwrap.css({ '-webkit-transition-duration': '0s' });
					self.startT = Number(new Date());	//如果快速手滑，则掠过touchmove，因此需要计算时间
				}, '.' + self.contentClass);
				self.con.delegate('touchend', function (e) {
					self.touching = false;
					var endX = e.changedTouches[0].clientX;
					var width = Number(getElementSize(self.animcon).width);
					self.deltaX = Math.abs(endX - self.startX);
					//滑过的距离
					var swipeleft = Math.abs(endX) < Math.abs(self.startX);
					//是否是向左滑动
					var swiperight = !swipeleft;
					//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
					var anti = self.carousel ? false : self.is_last() && swipeleft || self.is_first() && swiperight;
					//复位
					var reset = function () {
						self.animwrap.css({
							'-webkit-transition-duration': Number(self.speed) / 2 + 's',
							'-webkit-transform': 'translate3d(' + -1 * self.currentTab * getElementSize(self.animcon).width / self.colspan + 'px,0,0)'
						});
					};
					//根据手势走向上一个或下一个
					var goswipe = function () {
						var colwidth = getElementSize(self.animcon).width / self.colspan;
						var span = parseInt((self.deltaX - colwidth / 2) / colwidth, 10);
						// 滑动距离超过一帧
						if (swipeleft) {
							//下一帧
							if (span >= 1 && self.length > 2) {
								//  +1 是为了在向右滑动时，始终保持前进一档，不会出现后退一格
								self.currentTab += span + 1;
								if (self.currentTab >= self.length - self.colspan) {
									self.currentTab = self.length - self.colspan - 1;
								}
							}
							self.next();
						} else {
							//上一帧
							if (span >= 1 && self.length > 2) {
								//  -1 是为了在向左滑动时，始终保持向左划，不会出现回弹
								self.currentTab += -1 * span - 1;
								// 如果滑动到起始位置，就不需要再减一了
								if (self.currentTab <= 0) {
									self.currentTab = 1;
								}
							}
							self.previous();
						}
					};
					//如果检测到是上下滑动，则复位并return
					/*
						if(self.isScrolling){
							reset();
							return;
						}
						*/
					//如果滑动物理距离太小，则复位并return
					//这个是避免将不精确的点击误认为是滑动
					if (self.touchmove && self.deltaX < 30) {
						reset();
						return;
					}
					if (!anti && // 支持touchmove，跑马灯效果，任意帧，touchmove足够的距离
						(self.touchmove && self.deltaX > width / 3 || !self.touchmove && self.carousel || !self.carousel && self.touchmove && self.effect == 'hSlide' || !self.touchmove && !self.carousel || Number(new Date()) - self.startT < 550)) {
						//根据根据手滑方向翻到上一页和下一页
						goswipe();
					} else {
						//复位
						reset();
					}
					if (self.autoSlide && self.stoped === false) {
						self.play();
					}
				}, '.' + self.contentClass);
				//处理手指滑动事件相关
				if (self.touchmove) {
					// TODO 网页放大缩小时，距离计算有误差
					self.con.delegate('touchmove', function (e) {
						// 确保单手指滑动，而不是多点触碰
						if (e.touches.length > 1)
							return;
						//deltaX > 0 ，右移，deltaX < 0 左移
						self.deltaX = e.touches[0].clientX - self.startX;
						//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
						var anti = self.is_last() && self.deltaX < 0 || self.is_first() && self.deltaX > 0;
						if (!self.carousel && self.effect == 'hSlide' && anti) {
							self.deltaX = self.deltaX / 3;	//如果是边界反滑动，则增加阻尼效果
						}
						// 判断是否需要上下滑动页面
						self.isScrolling = Math.abs(self.deltaX) < Math.abs(e.touches[0].clientY - self.startY) ? true : false;
						if (!self.isScrolling) {
							// 阻止默认上下滑动事件
							//e.halt();
							e.preventDefault();
							self.stop();
							var width = Number(getElementSize(self.animcon).width / self.colspan);
							var dic = self.deltaX - self.currentTab * width;
							// 立即跟随移动
							self.animwrap.css({
								'-webkit-transition-duration': '0s',
								'-webkit-transform': 'translate3d(' + dic + 'px,0,0)'
							});
						}
					}, '.' + self.contentClass);
					// TODO 触屏设备中的AnimEnd事件的实现
					if (self.animwrap) {
						self.animwrap.on('webkitTransitionEnd', function () {
						});
					}
				}
			}
			// slide离开视野，是否暂停滚动
			if (self.invisibleStop) {
				// 检测是否支持pagevisivility，脱离视野，暂停播放
				var visProp = SlideUtil.getHiddenProp();
				if (visProp) {
					// 拼装visibilitychange事件名，并监听
					var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange', autoPlayPageVisible;
					// S.Event.on(document,evtname,function(e){
					_$.one(document).on(evtname, function (e) {
						// 如果页面离开视野，暂停播放
						if (SlideUtil.isHidden()) {
							if (self.timer) {
								autoPlayPageVisible = true;
								self.stop();	//console.info('触发事件:'+e.type+'   '+'播放状态：stop');
							} else {
								autoPlayPageVisible = false;
							}
						} else {
							// 页面可见 && slide在视野内 && 停止播放前slide播放状态是‘正在播放’ 满足这三个条件继续播放
							if (self.isSlideVisible() && autoPlayPageVisible) {
								self.play();	//console.info('触发事件:'+e.type+'   '+'播放状态：play');
							}
						}
					});
				}
				// 监听onscoll,resize事件，通过坐标判断slide是否脱离可视区
				// S.Event.on(window,'scroll resize',function(e){
				_$.one(window).on('scroll resize', function (e) {
					// 边界判断
					if (self.isSlideVisible()) {
						// 防止与鼠标悬停slide停止播放的设置相冲突，if里要检测鼠标是否在slide上
						// bug场景：鼠标悬浮在slide上，滚动页面，触发play，与hoverStop设置冲突
						if (!self.timer && (!self.hoverStop || self.hoverStop && !self.isMouseover)) {
							self.play();	//console.info('触发事件:'+e.type+'   '+'播放状态：play');
						}
					} else {
						if (self.timer) {
							self.stop();	//console.info('触发事件:'+e.type+'   '+'播放状态：stop');
						}
					}
				});
			}
			return this;
		},
		// 判断slide是否在可视区内
		isSlideVisible: function () {
			var self = this, slideLeft = self.animcon.offset().left, slideTop = self.animcon.offset().top, slideWidth = self.animcon.width(), slideHeight = self.animcon.height(), scrollTop = _$.one(window).scrollTop(), scrollLeft = _$.one(window).scrollLeft();
			if (scrollTop > slideTop + slideHeight || scrollTop + _$.one(window).height() < slideTop || scrollLeft > slideLeft + slideWidth || scrollLeft + _$.one(window).width() < slideLeft) {
				return false;
			} else {
				return true;
			}
		},
		// 初始化所有的SubLayer
		// TODO 从BSlide中抽离出来
		/*
		 * SubLayer存放在:
		 *
		 * self {
		 *		sublayers:[
		 *			[],	// 第一帧的sublay数组,可以为空数组
		 *			[], // ...
		 *			[]
		 *		]
		 * }
		 *
		 * */
		initLayer: function () {
			var self = this;
			// 在触屏设备中layer功能暂时去掉
			// TODO 应当加上触屏支持
			if ('ontouchstart' in document.documentElement) {
				return;
			}
			if (UA.ie > 0 && UA.ie < 9) {
				return;
			}
			// 过滤rel中的配置项
			var SubLayerString = [
				'durationin',
				'easingin',
				'durationout',
				'easingout',
				'delayin',
				'delayout',
				'slideindirection',
				'slideoutdirection',
				'offsetin',
				'offsetout',
				'alpha',
				'easeInStrong',
				'easeOutStrong',
				'easeBothStrong',
				'easeNone',
				'easeIn',
				'easeOut',
				'easeBoth',
				'elasticIn',
				'elasticOut',
				'elasticBoth',
				'backIn',
				'backOut',
				'backBoth',
				'bounceIn',
				'bounceOut',
				'bounceBoth',
				'left',
				'top',
				'right',
				'bottom'
			];
			// sublay的默认配置项，参照文件顶部文档说明
			var SubLayerConfig = {
				'durationin': 1000,
				'easingin': 'easeIn',
				'durationout': 1000,
				'easingout': 'easeOut',
				'delayin': 300,
				'delayout': 300,
				'slideindirection': 'right',
				'slideoutdirection': 'left',
				'alpha': true,
				'offsetin': 50,
				'offsetout': 50
			};
			// SubLayer 构造器,传入单个el，生成SubLayer对象
			var SubLayer = function (el) {
				var that = this;
				var _sublayer_keys = [];
				// 如果sublayer配置的书写格式不标准，则这里会报错
				// TODO 错误捕捉处理
				var json = el.attr('rel').replace(/"'/gi, '').replace(new RegExp('(' + SubLayerString.join('|') + ')', 'ig'), '"$1"');
				var o = JSON.parse('{' + json + '}');
				function setParam(def, key) {
					var v = o[key];
					// null 是占位符
					that[key] = v === undefined || v === null ? def : v;
				}
				Util.each(SubLayerConfig, setParam);
				this.el = el;
				// el.offset 计算高度不准确，不知为何，改用css()
				// TODO 寻找原因
				/*
				this.left = el.offset().left;
				this.top = el.offset().top;
				*/
				this.left = Number(el.css('left').replace('px', ''));
				this.top = Number(el.css('top').replace('px', ''));
				// sublayer.animIn()，某个sublayer的进入动画
				this.animIn = function () {
					var that = this;
					// 记录进入偏移量和进入方向
					var offsetIn = that.offsetin;
					var inType = that.slideindirection;
					// 动画开始之前的预处理
					var prepareEl = {
						left: function () {
							that.el.css({ 'left': that.left - offsetIn });
						},
						top: function () {
							that.el.css({ 'top': that.top - offsetIn });
						},
						right: function () {
							that.el.css({ 'left': that.left + offsetIn });
						},
						bottom: function () {
							that.el.css({ 'top': that.top + offsetIn });
						}
					};
					prepareEl[inType]();
					setTimeout(function () {
						var SlideInEffectTo = {
							left: { left: that.left },
							top: { top: that.top },
							bottom: { top: that.top },
							right: { left: that.left }
						};
						// 动画结束的属性
						var to = {};
						Util.mix(to, SlideInEffectTo[inType]);
						// 如果开启alpha，则从透明动画到不透明
						if (that.alpha) {
							Util.mix(to, { opacity: 1 });
						}
						// 执行动画
						/*
						S.Anim(that.el,to,that.durationin/1000,that.easingin,function(){
							// TODO 动画结束后的回调事件
							// 寻找最后的动画结束时间
						}).run();
						*/
						_$.one(that.el).animate(to, that.durationout / 1000, that.easingin, function () {
						});
					}, that.delayin);
					if (that.alpha) {
						that.el.css({ opacity: 0 });
					}
				};
				// TODO 仿效animIn来实现
				this.animOut = function () {
					var that = this;
					// 记录退出偏移量和退出方向
					var offsetOut = that.offsetout;
					var outType = that.slideoutdirection;
					// 动画开始之前的预处理
					var prepareEl = {
						left: function () {
							that.el.css({ 'left': that.left });
						},
						top: function () {
							that.el.css({ 'top': that.top });
						},
						right: function () {
							that.el.css({ 'left': that.left });
						},
						bottom: function () {
							that.el.css({ 'top': that.top });
						}
					};
					prepareEl[outType]();
					setTimeout(function () {
						var SlideOutEffectTo = {
							left: { left: that.left + offsetOut },
							top: { top: that.top + offsetOut },
							bottom: { top: that.top - offsetOut },
							right: { left: that.left - offsetOut }
						};
						// 动画结束的属性
						var to = {};
						Util.mix(to, SlideOutEffectTo[outType]);
						// 如果开启alpha，则从透明动画到不透明
						if (that.alpha) {
							Util.mix(to, { opacity: 0 });
						}
						// 执行动画
						/*
						S.Anim(that.el,to,that.durationout/1000,that.easingout,function(){
							// TODO 动画结束后的回调事件
							// 寻找最后的动画结束时间
						}).run();
						*/
						_$.one(that.el).animate(to, that.durationout / 1000, that.easingout, function () {
						});
					}, that.delayout);
					if (that.alpha) {
						that.el.css({ opacity: 1 });
					}
				};
			};
			self.sublayers = [];
			self.pannels.each(function (node, index) {
				if (self.effect == 'vSlide' || self.effect == 'hSlide') {
					node.css({ position: 'relative' });
				}
				if (node.all('[alt="sublayer"]').length === 0) {
					self.sublayers[index] = [];
					return;
				}
				if (self.sublayers[index] === undefined) {
					self.sublayers[index] = [];
				}
				node.all('[alt="sublayer"]').each(function (el, j) {
					self.sublayers[index].push(new SubLayer(el));
				});
			});
			self.on('beforeSwitch', function (o) {
				if (o.index === self.currentTab) {
					return false;
				}
				self.subLayerRunin(o.index);
			});
			self.on('beforeTailSwitch', function (o) {
				//if(self.isTailSwitching === true) {
				//	return false;
				//}
				//self.isTailSwitching = true;
				self.subLayerRunout(o.index);
				// 同时，返回需要delay的最长时间
				return self.getMaxAnimDelay(o.index);
			});
		},
		// 执行某一帧的进入动画
		subLayerRunin: function (index) {
			var self = this;
			var a = self.sublayers[index];
			Util.each(a, function (o, i) {
				o.animIn();
			});
		},
		// 执行某一帧的移出动画
		subLayerRunout: function (index) {
			var self = this;
			var a = self.sublayers[index];
			Util.each(a, function (o, i) {
				o.animOut();
			});
		},
		// 构建BSlide全局参数列表
		buildParam: function (o) {
			var self = this;
			if (o === undefined || o === null) {
				o = {};
			}
			function setParam(def, key) {
				var v = o[key];
				// null 是占位符
				self[key] = v === undefined || v === null ? def : v;
			}
			Util.each({
				autoSlide: false,
				speed: 300,
				//ms
				timeout: 3000,
				effect: 'none',
				eventType: 'click',
				easing: 'easeBoth',
				hoverStop: true,
				invisibleStop: false,
				selectedClass: 'selected',
				conClass: 't-slide',
				navClass: 'tab-nav',
				triggerSelector: 'li',
				contentClass: 'tab-content',
				pannelClass: 'tab-pannel',
				before_switch: true,
				//added by fengdao
				carousel: false,
				// 不支持
				reverse: false,
				touchmove: true,
				adaptive_fixed_width: false,
				adaptive_fixed_height: false,
				adaptive_fixed_size: false,
				adaptive_width: false,
				adaptive_height: false,
				defaultTab: 0,
				layerSlide: false,
				layerClass: 'tab-animlayer',
				colspan: 1,
				animWrapperAutoHeightSetting: true,
				// beforeSwitch不修改wrappercon 宽高
				webkitOptimize: true,
				triggerDelay: 300,
				// added by jayli 2013-05-21，触碰延时
				autoActived: true
			}, setParam);
			Util.mix(self, {
				tabs: [],
				animcon: null,
				pannels: [],
				timmer: null,
				touching: false
			});
			self.speed = self.speed / 1000;
			if (self.defaultTab !== 0) {
				self.defaultTab = Number(self.defaultTab) - 1;	// 默认隐藏所有pannel
			}
			// 如果是跑马灯，则不考虑默认选中的功能，一律定位在第一页,且只能是左右切换的不支持上下切换
			if (self.carousel) {
				self.defaultTab = 0;
				self.defaultTab = self.colspan + self.defaultTab;
				//跑马灯显示的是真实的第二项
				self.effect = 'hSlide';	// TODO 目前跑马灯只支持横向滚动
			}
			self.currentTab = self.defaultTab;
			//0,1,2,3...
			//判断是否开启了内置动画
			self.transitions = 'webkitTransition' in document.body.style && self.webkitOptimize;
			return self;
		},
		//针对移动终端的跑马灯的hack
		//index 移动第几个,0,1,2,3
		fix_for_transition_when_carousel: function (index) {
			var self = this;
			if (typeof index == 'undefined') {
				index = 0;
			}
			var con = self.con;
			self.animcon = self.con.one('.' + self.contentClass);
			self.animwrap = self.animcon.one('div');
			self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			if (self.effect == 'hSlide') {
				var width = Number(getElementSize(self.animcon).width / self.colspan);
				var height = Number(getElementSize(self.animcon).height);
				self.animwrap.css('width', self.pannels.length * width + 2 * width);
				var first = self.pannels.item(index).clone(true);
				var last = self.pannels.item(self.pannels.length - 1 - index).clone(true);
				self.animwrap.append(first);
				self.animwrap.prepend(last);
				if (self.defaultTab === 0) {
					var offset_width = -1 * width * (index / 2 + 1 + self.defaultTab - 1);
				} else {
					var offset_width = -1 * width * (index / 2 + 1);
				}
				if (self.transitions) {
					//这步操作会手持终端中造成一次闪烁,待解决
					self.animwrap.css({
						'-webkit-transition-duration': '0s',
						'-webkit-transform': 'translate3d(' + offset_width + 'px,0,0)',
						'-webkit-backface-visibility': 'hidden',
						'left': '0'
					});
				} else {
					self.animwrap.css('left', offset_width);
				}
			}
			//重新获取重组之后的tabs
			self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			self.length = self.pannels.length;
			return this;
		},
		// 是否在做动画过程中
		isAming: function () {
			var self = this;
			return false;
		},
		//上一个
		previous: function (callback) {
			var self = this;
			var _index = self.currentTab + self.length - 1 - (self.colspan - 1);
			if (_index >= self.length - self.colspan + 1) {
				_index = _index % (self.length - self.colspan + 1);
			}
			if (self.carousel) {
				if (self.is_first()) {
					self.fix_pre_carousel();
					self.previous.call(self);
					// arguments.callee.call(self);
					return this;
				}
			}
			self.go(_index, callback);
			return this;
		},
		//判断当前tab是否是最后一个
		is_last: function () {
			var self = this;
			if (self.currentTab == self.length - (self.colspan - 1) - 1) {
				return true;
			} else {
				return false;
			}
		},
		//判断当前tab是否是第一个
		is_first: function () {
			var self = this;
			if (self.currentTab === 0) {
				return true;
			} else {
				return false;
			}
		},
		//下一个
		next: function (callback) {
			var self = this;
			var _index = self.currentTab + 1;
			if (_index >= self.length - self.colspan + 1) {
				_index = _index % (self.length - self.colspan + 1);
			}
			if (self.carousel) {
				if (self.is_last()) {
					self.fix_next_carousel();
					self.next.call(self);
					// arguments.callee.call(self);
					return this;
				}
			}
			self.go(_index, callback);
			return this;
		},
		// 修正跑马灯结尾的滚动位置
		fix_next_carousel: function () {
			var self = this;
			self.currentTab = self.colspan;
			var con = self.con;
			if (self.effect != 'none') {
				self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			}
			//目标offset，'-234px'
			var dic = '-' + Number(getElementSize(self.animcon).width).toString() + 'px';
			if (self.effect == 'hSlide') {
				if (self.transitions) {
					self.animwrap.css({
						'-webkit-transition-duration': '0s',
						'-webkit-transform': 'translate3d(' + dic + ',0,0)'
					});
				} else {
					self.animwrap.css('left', dic);
				}
			} else if (self.effect == 'vSlide') {
			}
			return;
		},
		// 修正跑马灯开始的滚动位置
		fix_pre_carousel: function () {
			var self = this;
			// jayli 这里需要调试修正，继续调试
			self.currentTab = self.length - 1 - self.colspan * 2 + 1;
			var con = self.con;
			if (self.effect != 'none') {
				self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			}
			// 目标offset,是一个字符串 '-23px'
			var dic = '-' + (Number(getElementSize(self.animcon).width / self.colspan) * self.currentTab).toString() + 'px';
			if (self.effect == 'hSlide') {
				if (self.transitions) {
					self.animwrap.css({
						'-webkit-transition-duration': '0s',
						'-webkit-transform': 'translate3d(' + dic + ',0,0)'
					});
				} else {
					self.animwrap.css('left', dic);
				}
			} else if (self.effect == 'vSlide') {
			}
			return;
		},
		//高亮显示第index(0,1,2,3...)个nav
		highlightNav: function (index) {
			var self = this;
			// 同时是跑马灯，且一帧多元素，则不允许存在Nav
			if (self.carousel && self.colspan > 1) {
				return this;
			}
			if (self.tabs.item(index)) {
				self.tabs.removeClass(self.selectedClass);
				self.tabs.item(index).addClass(self.selectedClass);
			}
			return this;
		},
		hightlightNav: function () {
			var self = this;
			self.highlightNav.apply(self, arguments);
			return this;
		},
		// 非高亮显示 index(0,1,2,3...)个nav
		unhighlightNav: function (index) {
			var self = this;
			// 同时是跑马灯，且一帧多元素，则不允许存在Nav
			if (self.carousel && self.colspan > 1) {
				return this;
			}
			if (self.tabs.item(index)) {
				self.tabs.removeClass(self.selectedClass);	// self.tabs.item(index).addClass(self.selectedClass);
			}
			return this;
		},
		// 非高亮显示全部
		unhighlightNavAll: function () {
			var self = this;
			self.tabs.removeClass(self.selectedClass);
			return this;
		},
		//切换至index,这里的index为真实的索引
		switch_to: function (index, callback) {
			var self = this;
			// 切换是否强制取消动画
			if (callback === false) {
				var doeffect = false;
			} else {
				var doeffect = true;
			}
			var afterSwitch = function () {
				if (Util.isFunction(callback)) {
					callback.call(self, self);
				}
				self.fire('afterSwitch', {
					index: self.currentTab,
					navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
					pannelnode: self.pannels.item(self.currentTab)
				});
			};
			// tailSwitch 是秒数
			var tailSwitch = self.fire('beforeTailSwitch', {
				index: self.currentTab,
				navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
				pannelnode: self.pannels.item(self.currentTab)
			});
			self.fixSlideSize(index);
			if (self.autoSlide && self.stoped === false) {
				self.stop().play();
			}
			if (index >= self.length) {
				index = index % self.length;
			}
			if (index == self.currentTab) {
				return this;
			}
			if (self.anim) {
				try {
					self.anim.stop();
					//fix IE6下内存泄露的问题，仅支持3.2.0及3.3.0,3.1.0及3.0.0需修改Y.Anim的代码
					//modified by huya
					// self.anim.destroy();
					self.anim = null;
				} catch (e) {
				}
			}
			// TODO 帧切换动画的实现应当从Bslide中抽离出来
			var animFn = {
				'none': function (index) {
					self.pannels.css({ 'display': 'none' });
					self.pannels.item(index).css({ 'display': 'block' });
					afterSwitch();
				},
				'vSlide': function (index) {
					if (self.transitions) {
						self.animwrap.css({
							'-webkit-transition-duration': (doeffect ? self.speed : '0') + 's',
							'-webkit-transform': 'translate3d(0,' + -1 * index * getElementSize(self.animcon).height / self.colspan + 'px,0)',
							'-webkit-backface-visibility': 'hidden'
						});
						if (doeffect) {
							self.anim = _$.one(self.animwrap).animate({
								'-webkit-transition-duration': self.speed + 's',
								'-webkit-transform': 'translate3d(0,' + -1 * index * getElementSize(self.animcon).height / self.colspan + 'px,0)',
								'-webkit-backface-visibility': 'hidden',
								opacity: 1
							}, modulex.config('mini') ? self.speed : 0.001, self.easing, function () {
							});
							setTimeout(function () {
								afterSwitch();
							}, self.speed * 1000);	// self.anim.run();
						} else {
							afterSwitch();
						}
					} else {
						if (doeffect) {
							self.anim = _$.one(self.animwrap).animate({ top: -1 * index * getElementSize(self.animcon).height / self.colspan }, self.speed, self.easing, function () {
								afterSwitch();
							});	// self.anim.run();
						} else {
							self.animwrap.css({ top: -1 * index * getElementSize(self.animcon).height / self.colspan });
							afterSwitch();
						}
					}
				},
				'hSlide': function (index) {
					if (self.transitions) {
						if (doeffect) {
							self.anim = _$.one(self.animwrap).animate({
								'-webkit-transition-duration': self.speed + 's',
								'-webkit-transform': 'translate3d(' + -1 * index * getElementSize(self.animcon).width / self.colspan + 'px,0,0)',
								'-webkit-backface-visibility': 'hidden',
								opacity: 1
							}, modulex.config('mini') ? self.speed : 0.001, self.easing, function () {
							});
							setTimeout(function () {
								afterSwitch();
							}, self.speed * 1000);
						} else {
							afterSwitch();
						}
					} else {
						if (doeffect) {
							self.anim = _$.one(self.animwrap).animate({ left: -1 * index * getElementSize(self.animcon).width / self.colspan }, self.speed, self.easing, function () {
								afterSwitch();
							});	// self.anim.run();
						} else {
							self.animwrap.css({ left: -1 * index * getElementSize(self.animcon).width / self.colspan });
							afterSwitch();
						}
					}
				},
				'fade': function (index) {
					//重写fade效果逻辑
					//modified by huya
					var _curr = self.currentTab;
					//动画开始之前的动作
					self.pannels.item(index).css({ 'display': 'block' });
					self.pannels.item(index).css('opacity', 0);
					self.pannels.item(_curr).css('zIndex', 1);
					self.pannels.item(index).css('zIndex', 2);
					// self.anim.run();
					self.anim = _$.one(self.pannels.item(index)).animate({ opacity: 1 }, self.speed, self.easing, function () {
						//console.log(_curr);
						self.pannels.item(_curr).css('zIndex', 0);
						self.pannels.item(index).css('zIndex', 1);
						self.pannels.item(_curr).css('opacity', 0);
						self.pannels.item(_curr).css({ 'display': 'none' });
						afterSwitch();
						self.fire('afterSwitch', {
							index: index,
							navnode: self.tabs.item(self.getWrappedIndex(index)),
							pannelnode: self.pannels.item(index)
						});
					});
				}
			};
			var doSwitch = function () {
				//console.log("self.before_switch:" + self.before_switch);
				var goon = self.fire('beforeSwitch', {
					index: index,
					navnode: self.tabs.item(index),
					pannelnode: self.pannels.item(index)
				});
				//console.log(goon._executeSwitch);
				/*
				枫刀修改：如果goon._executeSwitch（即self._executeSwitch）不是false（可以是true,或其他值,或不指定），
				则触发切换事件（switch事件）；否则阻止切换事件
				 */
				if (goon._executeSwitch !== false) {
					//console.log(goon);
					//发生go的时候首先判断是否需要整理空间的长宽尺寸
					//self.renderSize(index);
					if (index + self.colspan > self.pannels.length) {
						index = self.pannels.length - self.colspan;
					}
					animFn[self.effect](index);
					self.currentTab = index;
					self.highlightNav(self.getWrappedIndex(index));
					// TODO，讨论switch的发生时机
					self.fire('switch', {
						index: index,
						navnode: self.tabs.item(self.getWrappedIndex(index)),
						pannelnode: self.pannels.item(index)
					});
					//延迟执行的脚本
					self.renderPannelTextarea(index);
				}
			};
			if (Util.isNumber(tailSwitch)) {
				setTimeout(function () {
					doSwitch();	//self.isTailSwitching = false;
				}, tailSwitch);
			} else
				/*if(tailSwitch !== false)*/
				{
					doSwitch();	//self.isTailSwitching = false;
				}
		},
		//去往任意一个,0,1,2,3...
		'go': function (index, callback) {
			var self = this;
			self.switch_to(index, callback);
			return this;
		},
		//自动播放
		play: function () {
			var self = this;
			if (self.timer !== null) {
				clearTimeout(self.timer);
			}
			self.timer = setTimeout(function () {
				self.next().play();
			}, Number(self.timeout));
			self.stoped = false;
			// self.autoSlide = true;
			return this;
		},
		//停止自动播放
		stop: function () {
			var self = this;
			clearTimeout(self.timer);
			self.timer = null;
			self.stoped = true;
			// self.autoSlide = false;
			return this;
		}
	});
	module.exports = BSlide;
});