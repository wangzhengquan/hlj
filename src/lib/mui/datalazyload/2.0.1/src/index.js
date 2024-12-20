/**
 * @ignore
 * 数据延迟加载组件
 */
KISSY.add(function (S, D, E, Base, undefined) {
    var win = S.Env.host,
        doc = win.document,
        IMG_SRC_DATA = 'data-ks-lazyload',
        AREA_DATA_CLS = 'ks-datalazyload',
        CUSTOM = '-custom',
        DEFAULT = 'default',
        NONE = 'none',
        SCROLL = 'scroll',
        TOUCH_MOVE = 'touchmove',
        RESIZE = 'resize',
        DURATION = 100,
        IND = 0;

    /**
     *根据加载函数实现加载器
     *@param {Function} load 加载函数
     *@returns {Function} 加载器
     */
    function createLoader(load) {
        var value, loading, handles = [], h;
        return function (handle, type) {
            // type默认为1
            // 0:	不立即加载，不过加载完成之后执行回调函数
            // 1:	立即加载，并在完成之后执行回调函数
            // 2:	不立即加载，只在当前已经存在的情况下执行回调函数
            if (type !== 0 && !type) {
                type = 1;
            }
            if ((type & 1) && !loading) {
                loading = true;
                load(function (v) {
                    value = v;
                    while (h = handles.shift()) {
                        try {
                            h && h.apply(null, [value]);
                        } catch (e) {
                            setTimeout(function () {
                                throw e;
                            }, 0)
                        }
                    }
                })
            }
            if (value) {
                handle && handle.apply(null, [value]);
                return value;
            }
            if (!(type & 2)) {
                handle && handles.push(handle);
            }// 如果只在存在的情况下回调，则退出
            return value;
        }
    }

    /**
     * 自定义的Buffer函数，实现下面的特点：
     * 1. 从来没有执行过或长时间没有执行过，则立即运行（这样确保初始化代码能第一时间执行）
     * 2. 最后一次一定会被执行
     */
    function buffer(fn, ms, context) {
        var timer, lastStart = 0, lastEnd = 0,
            ms = ms || 150;

        function run() {
            if (timer) {
                timer.cancel();
                timer = 0;
            }
            lastStart = S.now();
            fn.apply(context || this, arguments);
            lastEnd = S.now();
        }

        return S.mix(function () {
            if (
                (!lastStart) || // 从未运行过
                    (lastEnd >= lastStart && S.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
                    (lastEnd < lastStart && S.now() - lastStart > ms * 8)	// 上次运行或未完成，后8*ms毫秒
                ) {
                run();
            } else {
                if (timer) {
                    timer.cancel();
                }
                timer = S.later(run, ms, 0, null, arguments);
            }
        }, {
            stop: function () {
                if (timer) {
                    timer.cancel();
                    timer = 0;
                }
            }
        });
    }

    // 加载图片 src
    var loadImgSrc = function (img, flag, onStart, webpReplacer) {
        flag = flag || IMG_SRC_DATA;
        var dataSrc = img.getAttribute(flag),
            param = {
                type: 'img',
                elem: img,
                src: dataSrc
            },
            result = (!S.isFunction(onStart)) || (onStart(param) !== false);
        if (result && param.src) {
            function setSrc(src) {
                if (img.src != src) {
                    img.src = src;
                }
                img.removeAttribute(flag);
            }

            if (S.isFunction(webpReplacer)) {
                S.use('./plugin/webp', function (S, WebP) {
                    WebP.isSupport(function (isSupport) {
                        setSrc(isSupport ? webpReplacer(param.src) : param.src);
                    });
                });
            } else {
                setSrc(param.src);
            }
        }
    };

    // 从 textarea 中加载数据
    function loadAreaData(textarea, execScript, onStart) {
        // 采用隐藏 textarea 但不去除方式，去除会引发 Chrome 下错乱
        textarea.style.display = NONE;
        textarea.className = ''; // clear hook
        var content = D.create('<div>');
        // textarea 直接是 container 的儿子
        textarea.parentNode.insertBefore(content, textarea);

        var html = textarea.value;
        if (S.isFunction(onStart)) {
            var ret = onStart({
                type: 'textarea',
                elem: textarea,
                value: html
            });
            if (ret) {
                html = ret;
            }
        }

        D.html(content, html, execScript);
        return content;
    }

    function cacheWidth(el) {
        if (el._ks_lazy_width) {
            return el._ks_lazy_width;
        }
        return el._ks_lazy_width = D.outerWidth(el);
    }


    function cacheHeight(el) {
        if (el._ks_lazy_height) {
            return el._ks_lazy_height;
        }
        return el._ks_lazy_height = D.outerHeight(el);
    }


    /**
     * whether part of elem can be seen by user.
     * note: it will not handle display none.
     * @ignore
     */
    function elementInViewport(elem, windowRegion, containerRegion) {
        // it's better to removeElements,
        // but if user want to append it later?
        // use addElements instead
        // if (!inDocument(elem)) {
        //    return false;
        // }
        // display none or inside display none
        if (!elem.offsetWidth) {
            return false;
        }
        var elemOffset = D.offset(elem),
            inContainer = true,
            inWin,
            left = elemOffset.left,
            top = elemOffset.top,
            elemRegion = {
                left: left,
                top: top,
                right: left + cacheWidth(elem),
                bottom: top + cacheHeight(elem)
            };

        inWin = isCross(windowRegion, elemRegion);

        if (inWin && containerRegion) {
            inContainer = isCross(containerRegion, elemRegion); // maybe the container has a scroll bar, so do this.
        }

        // 确保在容器内出现
        // 并且在视窗内也出现
        return inContainer && inWin;
    }

    /**
     * LazyLoad elements which are out of current viewPort.
     * @class KISSY.DataLazyload
     * @extends KISSY.Base
     */
    function DataLazyload(container, config) {
        var self = this;
        // factory or constructor
        if (!(self instanceof DataLazyload)) {
            return new DataLazyload(container, config);
        }

        var newConfig = container;

        if (!S.isPlainObject(newConfig)) {
            newConfig = config || {};
            if (container) {
                newConfig.container = container;
            }
        }

        DataLazyload.superclass.constructor.call(self, newConfig);

        // 和延迟项绑定的回调函数
        self._callbacks = {};
       // console.log(self.get);
       /* console.log('newConfig.container ', newConfig.container );
        console.log('self.get(container)', self.get('container'));*/
        self._containerIsNotDocument = self.get('container').nodeType != 9;
        // 兼容 1.2 传入数组，进入兼容模式，不检测 container 区域
        if (S.isArray(newConfig.container)) {
            self._backCompact = 1;
        }
        self['_initLoadEvent']();
		newConfig.container && self.addElements(newConfig.container);
        self._loadFn();
        S.ready(function () {
            self._loadFn();
        });
        self.resume();
    }

    DataLazyload.ATTRS = {
        /**
         * Distance outside viewport or specified container to pre load.
         * default: pre load one screen height and width.
         * @cfg {Number|Object} diff
         *
         *  for example:
         *
         *      diff : 50 // pre load 50px outside viewport or specified container
         *      // or more detailed :
         *      diff: {
         *          left:20, // pre load 50px outside left edge of viewport or specified container
         *          right:30, // pre load 50px outside right edge of viewport or specified container
         *          top:50, // pre load 50px outside top edge of viewport or specified container
         *          bottom:60 // pre load 50px outside bottom edge of viewport or specified container
         *      }
         */
        /**
         * @ignore
         */
        diff: {
            value: DEFAULT
        },

        // TODO: add containerDiff for container is not document

        /**
         * Placeholder img url for lazy loaded _images if image 's src is empty.
         * must be not empty!
         *
         * Defaults to: //g.alicdn.com/s.gif
         * @cfg {String} placeholder
         */
        /**
         * @ignore
         */
        placeholder: {
            value: '//g.alicdn.com/s.gif'
        },

        /**
         * Whether execute script in lazy loaded textarea.
         * default: true
         * @cfg {Boolean} execScript
         */
        /**
         * @ignore
         */
        execScript: {
            value: true
        },

        /**
         * Container which will be monitor scroll event to lazy load elements within it.
         * default: document
         * @cfg {HTMLElement} container
         */
        /**
         * @ignore
         */
        container: {
            setter: function (el) {
                el = el || doc;
                if (S.isWindow(el)) {
                    el = el.document;
                } else {
                    el = D.get(el);
                    if (D.nodeName(el) == 'body') {
                        el = el.ownerDocument;
                    }
                }
                return el;
            },
            valueFn: function () {
                return doc;
            }
        },

        /**
         * Whether destroy this component when all lazy loaded elements are loaded.
         * default: true
         * @cfg {Boolean} autoDestroy
         */
        /**
         * @ignore
         */
        autoDestroy: {
            value: true
        },

        /**
         * execute before img src change
         * Defaults to null.
         * @cfg {Function}
         */
        onStart: {
            value: null
        }
    };

    // 两块区域是否相交
    function isCross(r1, r2) {
        var r = {};
        r.top = Math.max(r1.top, r2.top);
        r.bottom = Math.min(r1.bottom, r2.bottom);
        r.left = Math.max(r1.left, r2.left);
        r.right = Math.min(r1.right, r2.right);
        return r.bottom >= r.top && r.right >= r.left;
    }

    S.extend(DataLazyload, Base, {
    	
        /**
         * attach scroll/resize event
         * @private
         */
        '_initLoadEvent': function () {
            var self = this,
                autoDestroy = self.get('autoDestroy');

            self.imgHandle = function () {
                loadImgSrc(this, self.get('imgFlag'), self.get('onStart'), self.get('webpReplacer'))
            };
            self.textareaHandle = function () {
                // 在textarea区域内部可能还存在image、textarea，所以需要addElements
                self.addElements(loadAreaData(this, self.get('execScript'), self.get('onStart')));
            };

            // 加载函数
            self._loadFn = buffer(function () {// 加载延迟项
                if (autoDestroy && self._counter == 0 && S.isEmptyObject(self._callbacks)) {
                    self.destroy();
                }
                self['_loadItems']();
            }, DURATION, self);
        },

        /**
         * force datalazyload to recheck constraints and load lazyload
         *
         */
        refresh: function () {
            this._loadFn();
        },

        /**
         * lazyload all items
         * @private
         */
        '_loadItems': function () {
            var self = this,
                container = self.get('container');
            
            // container is display none
            if (self._containerIsNotDocument && !container.offsetWidth) {
                return;
            }
            self._windowRegion = self['_getBoundingRect'](container);
            // 兼容，不检测 container
            if (!self._backCompact && self._containerIsNotDocument) {
                self._containerRegion = self['_getBoundingRect'](self.get('container'));
            }
            S.each(self._callbacks, function (callback, key) {
                callback && self._loadItem(key, callback);
            });
        },
        
        '_loadItem': function (key, callback) {
            var self = this,
                callback = callback || self._callbacks[key];
            if (!callback) {
                return true;
            }
            var el = callback.el,
                remove = false,
                fn = callback.fn;
            
            if (self.get('force') || elementInViewport(el, self._windowRegion, self._containerRegion)) {
            	//console.log(el);
                try {
                    remove = fn.call(el);
                } catch (e) {
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }
            if (remove !== false) {
                delete self._callbacks[key];
            }
            return remove;
        },

        /**
         * Register callback function. When el is in viewport, then fn is called.
         * @param {HTMLElement|String} el html element to be monitored.
         * @param {function(this: HTMLElement): boolean} fn
         * Callback function to be called when el is in viewport.
         * return false to indicate el is actually not in viewport( for example display none element ).
         */
        'addCallback': function (el, fn) {
            el = D.get(el);

            var self = this,
                callbacks = self._callbacks,
                callback = {
                    el: el || document, // It is necessary for public method to do fault-tolerant something.
                    fn: fn || S.noop
                },
                key = ++IND;

            callbacks[key] = callback;

            // add 立即检测，防止首屏元素问题
            if (self._windowRegion) {
                self._loadItem(key, callback);
            } else {
                self.refresh();
            }
        },

        /**
         * Remove a callback function. See {@link KISSY.DataLazyload#addCallback}
         * @param {HTMLElement|String} el html element to be monitored.
         * @param {Function} [fn] Callback function to be called when el is in viewport.
         *                        If not specified, remove all callbacks associated with el.
         */
        'removeCallback': function (el, fn) {
            el = D.get(el);
            var callbacks = this._callbacks;
            S.each(callbacks, function (callback, key) {
                if (callback.el == el && (fn ? callback.fn == fn : 1)) {
                    delete callbacks[key];
                }
            });
        },

        /**
         * get to be lazy loaded elements
         * @return {Object} eg: {images: [...], textareas: [...]}
         */
        'getElements': function () {
            var self = this,
                images = [],
                textareas = [],
                callbacks = self._callbacks;
            S.each(callbacks, function (callback) {
                if (callback.fn == self.imgHandle) {
                    images.push(callback.el);
                }
                if (callback.fn == self.textareaHandle) {
                    textareas.push(callback.el);
                }
            });
            return {
                images: this._images,
                textareas: this._textareas
            };
        },

        /**
         * Add a array of elements to be lazy loaded to monitor list.
         * @param {HTMLElement[]|String} els Array of elements to be lazy loaded or selector
         */
        'addElements': function (els, type) {
            if (typeof els == 'string') {
                els = D.query(els);
            } else if (!S.isArray(els)) {
                els = [els];
            }

            var self = this;
            self._counter = self._counter || 0; // record the non-execution `addCallback` tasks count.

            S.each(els, function (el) {
                if (!type || type === 'img') {
                    S.each(S.filter([el].concat(D.query('img', el)), function (img) {
                        return img.getAttribute && img.getAttribute(self.get('imgFlag') || IMG_SRC_DATA)
                    }, self), function (img) {

                        self.onPlaceHolder = self.onPlaceHolder || createLoader(function (callback) {
                            var img = new Image(),
                                placeholder = self.get('placeholder');
                            img.src = placeholder;
                            img.onload = img.onerror = function () {
                                callback(placeholder)
                            };
                        });

                        if (img.offsetWidth) {
                            self.addCallback(img, self.imgHandle);
                        } else {
                            self._counter++;
                            img.onload = function () { // need to use the counter because of the asynchronous delay.
                                self._counter--;
                                self.addCallback(img, self.imgHandle);
                            };
                            if (!img.src) {
                                self.onPlaceHolder(function (placeholder) {
                                    if (!img.src) {
                                        img.src = placeholder;
                                    }
                                });
                            }
                        }
                    });
                }

                if (!type || type === 'textarea') {
                    S.each(D.query('textarea.' + (self.get('areaFlag') || AREA_DATA_CLS), el), function (textarea) {
                        self.addCallback(textarea, self.textareaHandle);
                    });
                }
            });
        },

        /**
         * Remove a array of element from monitor list. See {@link KISSY.DataLazyload#addElements}.
         * @param {HTMLElement[]|String} els Array of imgs or textareas to be lazy loaded
         */
        'removeElements': function (els) {
            if (typeof els == 'string') {
                els = D.query(els);
            } else if (!S.isArray(els)) {
                els = [els];
            }
            var self = this,
                callbacks = self._callbacks;
            S.each(callbacks, function (callback, key) {
                if (S.inArray(callback.el, els)) {
                    delete callbacks[key]
                }
            });
        },

        /**
         * get c's bounding textarea.
         * @param {window|HTMLElement} [c]
         * @private
         */
        '_getBoundingRect': function (c) {
            var vh, vw, left, top;

            if (c) {
                vh = D.outerHeight(c);
                vw = D.outerWidth(c);
                var offset = D.offset(c);
                left = offset.left;
                top = offset.top;
            } else {
                vh = D.viewportHeight();
                vw = D.viewportWidth();
                left = D.scrollLeft();
                top = D.scrollTop();
            }

            var diff = this.get('diff'),
                diffX = diff === DEFAULT ? vw : diff,
                diffX0 = 0,
                diffX1 = diffX,
                diffY = diff === DEFAULT ? vh : diff,
            // 兼容，默认只向下预读
                diffY0 = 0,
                diffY1 = diffY,
                right = left + vw,
                bottom = top + vh;

            if (S.isObject(diff)) {
                diffX0 = diff.left || 0;
                diffX1 = diff.right || 0;
                diffY0 = diff.top || 0;
                diffY1 = diff.bottom || 0;
            }

            left -= diffX0;
            right += diffX1;
            top -= diffY0;
            bottom += diffY1;

            return {
                left: left,
                top: top,
                right: right,
                bottom: bottom
            };
        },

        /**
         * pause lazyload
         */
        pause: function () {
            var self = this,
                load = self._loadFn;
            if (self._destroyed) {
                return;
            }
            E.remove(win, SCROLL, load);
            E.remove(win, TOUCH_MOVE, load);
            E.remove(win, RESIZE, load);
            load.stop();
            if (self._containerIsNotDocument) {
                var c = self.get('container');
                E.remove(c, SCROLL, load);
                E.remove(c, TOUCH_MOVE, load);
            }
        },

        /**
         * resume lazyload
         */
        resume: function () {
            var self = this,
                load = self._loadFn;
            if (self._destroyed) {
                return;
            }
            // scroll 和 resize 时，加载图片
            E.on(win, SCROLL, load);
            E.on(win, TOUCH_MOVE, load);
            E.on(win, RESIZE, load);
            if (self._containerIsNotDocument) {
                var c = self.get('container');
                E.on(c, SCROLL, load);
                E.on(c, TOUCH_MOVE, load);
            }
        },

        /**
         * Destroy this component.Will fire destroy event.
         */
        destroy: function () {
            var self = this;
            self.pause();
            self._callbacks = {};
            S.log('datalazyload is destroyed!');
            self.fire('destroy');
            self._destroyed = 1;
        }
    });

    /**
     * Load lazyload textarea and imgs manually.
     * @ignore
     * @method
     * @param {HTMLElement[]} containers Containers with in which lazy loaded elements are loaded.
     * @param {String} type Type of lazy loaded element. "img" or "textarea"
     * @param {String} [flag] flag which will be searched to find lazy loaded elements from containers.
     * @param {Function} [onStart] called before process lazyload content
     * Default "data-ks-lazyload-custom" for img attribute and "ks-lazyload-custom" for textarea css class.
     */
    function loadCustomLazyData(containers, type, flag, onStart) {

        if (type === 'img-src') {
            type = 'img';
        }
        // 支持数组
        if (!S.isArray(containers)) {
            containers = [D.get(containers)];
        }

        var datalazyload = new DataLazyload(doc, {});
        datalazyload.set('imgFlag', flag || (IMG_SRC_DATA + CUSTOM));
        datalazyload.set('areaFlag', flag || (AREA_DATA_CLS + CUSTOM));
        datalazyload.set('onStart', onStart);
        datalazyload.set('force', true);
        datalazyload.addElements(containers, type);

    }

    DataLazyload.loadCustomLazyData = loadCustomLazyData;


    S.DataLazyload = DataLazyload;

    return DataLazyload;

}, { requires: ['dom', 'event', 'base'] });

/**
 * @ignore
 *
 * NOTES:
 *
 * 游侠重构：
 * 1. 以addCallback为核心，重构所有逻辑；
 * 2. 优化一些异步逻辑，以优化性能；
 * 3. 完整兼容以前的用法；
 *
 * 模式为 auto 时：
 *  1. 在 Firefox 下非常完美。脚本运行时，还没有任何图片开始下载，能真正做到延迟加载。
 *  2. 在 IE 下不尽完美。脚本运行时，有部分图片已经与服务器建立链接，这部分 abort 掉，
 *     再在滚动时延迟加载，反而增加了链接数。
 *  3. 在 Safari 和 Chrome 下，因为 webkit 内核 bug，导致无法 abort 掉下载。该
 *     脚本完全无用。
 *  4. 在 Opera 下，和 Firefox 一致，完美。
 *  5. 2010-07-12: 发现在 Firefox 下，也有导致部分 Aborted 链接。
 *
 * 模式为 manual 时：（要延迟加载的图片，src 属性替换为 data-lazyload-src, 并将 src 的值赋为 placeholder ）
 *  1. 在任何浏览器下都可以完美实现。
 *  2. 缺点是不渐进增强，无 JS 时，图片不能展示。
 *
 * 缺点：
 *  1. 对于大部分情况下，需要拖动查看内容的页面（比如搜索结果页），快速滚动时加载有损用
 *     户体验（用户期望所滚即所得），特别是网速不好时。
 *  2. auto 模式不支持 Webkit 内核浏览器；IE 下，有可能导致 HTTP 链接数的增加。
 *
 * 优点：
 *  1. 可以很好的提高页面初始加载速度。
 *  2. 第一屏就跳转，延迟加载图片可以减少流量。
 *
 * 参考资料：
 *  1. http://davidwalsh.name/lazyload MooTools 的图片延迟插件
 *  2. http://vip.qq.com/ 模板输出时，就替换掉图片的 src
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *  4. http://www.dynamixlabs.com/2008/01/17/a-quick-look-add-a-loading-icon-to-your-larger-_images/
 *  5. http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/
 *
 * 特别要注意的测试用例:
 *  1. 初始窗口很小，拉大窗口时，图片加载正常
 *  2. 页面有滚动位置时，刷新页面，图片加载正常
 *  3. 手动模式，第一屏有延迟图片时，加载正常
 *
 * 2009-12-17 补充：
 *  1. textarea 延迟加载约定：页面中需要延迟的 dom 节点，放在
 *       <textarea class='ks-datalazysrc invisible'>dom code</textarea>
 *     里。可以添加 hidden 等 class, 但建议用 invisible, 并设定 height = '实际高度'，这样可以保证
 *     滚动时，diff 更真实有效。
 *     注意：textarea 加载后，会替换掉父容器中的所有内容。
 *  2. 延迟 callback 约定：dataLazyload.addCallback(el, fn) 表示当 el 即将出现时，触发 fn.
 *  3. 所有操作都是最多触发一次，比如 callback. 来回拖动滚动条时，只有 el 第一次出现时会触发 fn 回调。
 *
 * xTODO:
 *   - [取消] 背景图片的延迟加载（对于 css 里的背景图片和 sprite 很难处理）
 *   - [取消] 加载时的 loading 图（对于未设定大小的图片，很难完美处理[参考资料 4]）
 *
 * UPDATE LOG:
 *   - 2013-05-14 myhere.2009@gmail.com 将 webp 分离为 plugin, 改为 onStart 配置
 *   - 2013-03-28 myhere.2009@gmail.com add support for webp
 *   - 2013-01-07 yiminghe@gmail.com optimize for performance
 *   - 2012-04-27 yiminghe@gmail.com refactor to extend base, add removeCallback/addElements ...
 *   - 2012-04-27 yiminghe@gmail.com 检查是否在视窗内改做判断区域相交，textarea 可设置高度，宽度
 *   - 2012-04-25 yiminghe@gmail.com refactor, 监控容器内滚动，包括横轴滚动
 *   - 2012-04-12 yiminghe@gmail.com monitor touchmove in ios
 *   - 2011-12-21 yiminghe@gmail.com 增加 removeElements 与 destroy 接口
 *   - 2010-07-31 yubo IMG_SRC_DATA 由 data-lazyload-src 更名为 data-ks-lazyload + 支持 touch 设备
 *   - 2010-07-10 yiminghe@gmail.com 重构，使用正则表达式识别 html 中的脚本，使用 EventTarget 自定义事件机制来处理回调
 *   - 2010-05-10 yubo ie6 下，在 dom ready 后执行，会导致 placeholder 重复加载，为比避免此问题，默认为 none, 去掉占位图
 *   - 2010-04-05 yubo 重构，使得对 YUI 的依赖仅限于 YDOM
 *   - 2009-12-17 yubo 将 imglazyload 升级为 datalazyload, 支持 textarea 方式延迟和特定元素即将出现时的回调函数
 */
