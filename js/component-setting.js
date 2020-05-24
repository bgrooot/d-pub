(function(window) {

	var $parent = $(window.parent.document),
		$document = $(document),
		$comAttrPanel = $parent.find('#component-attr-panel'),
		name,
		options,
		defaultHtml,
		cid = '';

	var Component = function() {

		this.name = 'component';
		this.options = {

			plusOptions: {

				'최대 넓이': ''
			}
		};

		this.meta = {

			plusOptions: {

				'최대 넓이': {selector: 'this', style: 'max-width'}
			}
		};

		this.asyncMake = false;
	};

	Component.prototype = {

		getName: function() {

			return this.name;
		},

		makeNode: function($content) {

			this.makeDefaultHtml();

			var $html = $(this.defaultHtml);
			$html.appendTo($content);
			// $html.data('com', this);
			$html.css('maxWidth', $html.width());

			this.setChangeableItem();
			this.defaultAction();

			return $html;
		},

		getOptions: function($com) {

			var self = this;

			this.getPlusOptions($com);
			this.getDynamicOptions($com);

			return this.options;
		},

		applySettings: function($frm) {

			var cid = this.cid,
				$cid = $('#' + cid),
				$row = $cid.closest('.row');

			this.setPlusOptions($frm);
			this.setChangeableItem();

			calHeight($row);

			return false;
		},

		setChangeableItem: function() {

			$(".changeable-img").on('mousedown', function() {

				var $active = $(window.parent.document).find('.article').find('.active'),
					$item;

				if (!$active.length)
		            return;

		        $item = itemSelector($active);

		        if (!$item)
		            return;

		        if($item[0].tagName!="IMG")
		        	return;

		        $(this).attr("src", $item.attr("src"));

		        calHeight($(this).closest('.row'));
			});

			$(".changeable-area").on('mousedown', function(){

				$item = itemSelector();

				 if (!$item)
			        return;

				 $(this).append($item);

				 calHeight($(this).closest('.row'));
		    });
		},

		makeDefaultHtml: function() {},
		defaultAction: function() {},
		getPlusOptions: function($com) {},
		setPlusOptions: function($frm) {},
		getDynamicOptions: function() {},
		addDynamicNode: function() {},
		modDynamicNode: function() {},
		deleteDynamicNode: function() {},
		settingScript: function() {},

		//EXTEND
		getPlusOptionsByMeta: function() {

			var meta = this.meta.plusOptions,
				$cid = $('#' + this.cid),
				opt, ds, $selector, prop, style, action, arg, disp, i;

			for (opt in meta) {

				ds = meta[opt];
				$selector = ds.selector === 'this' ? $cid : $cid.find(ds.selector);
				prop = ds.prop;
				style = ds.style;
				action = ds.action;
				arg = ds.arg;

				if (style) {

					disp = $selector.css('display');
					$selector.css('display', 'block');
					this.options.plusOptions[opt] = $selector.css(style);
					$selector.css('display', disp);
				}

				else if (action) {

					if (arg)
						this.options.plusOptions[opt] = $selector[action](arg);

					else
						this.options.plusOptions[opt] = $selector[action]();
				}

				else if (prop) {

					for (i=0; i<prop.length; i++) {

						this.options.plusOptions[opt][i] = this.options.plusOptions[opt][i].replace(':S', '');

						if (!prop[i] || $selector.hasClass(prop[i]))
							this.options.plusOptions[opt][i] += ':S';
					}
				}
			}
		},

		getDynamicOptionsByMeta: function() {

			var meta = this.meta.dynamicOptions,
				dynamicOptions = this.options.default ? this.options.default.dynamicOptions : {},
				newDynamicOptions = {},
				cid = this.cid,
				$cid = $('#' + cid),
				$dynamic = $cid.find('.dynamic'),
				dynamicLen = $dynamic.length,
				$sel, opt, ds, i;

			for (i=0; i<dynamicLen; i++) {

				newDynamicOptions[i] = {};

				for (opt in meta) {

					ds = meta[opt];
					$sel = $cid.find(ds.selector).eq(i);
					newDynamicOptions[i][opt] = ds.arg ? $sel[ds.action](ds.arg) : $sel[ds.action]();
				}

				newDynamicOptions[i] = $.extend({}, dynamicOptions, newDynamicOptions[i]);
			}

			this.options.dynamicOptions = newDynamicOptions;
		},

		settingScriptByMeta: function(event) {

			var meta = this.meta ? this.meta.settingScript : event.data.meta,
				opt, $inp, metaVal, metaValLen, key, i;

			for (opt in meta) {

				$inp = $comAttrPanel.find('[name="' + opt + '"]:checked') || $;
				val = $inp.val();

				if ($inp.prop('disabled') || !val)
					continue;

				metaVal = meta[opt][val];
				metaValLen = metaVal.length;

				for (i=0; i<metaValLen; i++) {

					for (key in metaVal[i])
						$comAttrPanel.find('[name="' + key + '"]').prop('disabled', !metaVal[i][key]);
				}
			}
		},

		setPlusOptionsByMeta: function() {

			var meta = this.meta.plusOptions,
				$cid = $('#' + this.cid),
				opt, ds, $selector, prop, style, action, arg, optionVal,  val, i, $inp;

			for (opt in meta) {

				ds = meta[opt];
				$selector = ds.selector === 'this' ? $cid : $cid.find(ds.selector);
				$inp = $parent.find('[name="' + opt  + '"]');
				prop = ds.prop;
				style = ds.style;
				action = ds.action;
				arg = ds.arg;

				if ($inp.attr('type') === 'radio')
					$inp = $inp.filter(':checked');

				val = $inp.val();

				if ($inp.prop('disabled'))
					val = '';

				if (style)
					$selector.css(style, val);

				else if (action) {

					if (arg)
						$selector[action](arg, val);

					else
						$selector[action](val);
				}

				else if (prop) {

					for (i=0; i<prop.length; i++) {

						optionVal = this.options.plusOptions[opt][i].replace(':S', '');

						if (optionVal === val)
							$selector.addClass(prop[i]);

						else
							$selector.removeClass(prop[i]);
					}
				}
			}

			this.getPlusOptions();
			this.runOptionAction();
		},

		runOptionAction: function() {

			var meta = this.meta,
				plusOptions = this.options.plusOptions,
				self = this,
				ds, opt, $inp, i,

			runAction = function(action, callback) {

				for (opt in action) {

					ds = plusOptions[opt];

					$inp = $parent.find('[name="' + opt  + '"]');

					if ($inp.attr('type') === 'radio')
						$inp = $inp.filter(':checked');

					if ($inp.prop('disabled'))
						continue;

					val = $inp.val() + ':S';

					if ($.isArray(ds)) {

						for (i=0; i<ds.length; i++) {

							if (ds[i] === val)
								callback.call(self, opt, i);
						}
					}

					else
						callback.call(self, opt);
				}
			};

			runAction(meta.plusAction, this.runPlusAction);
			runAction(meta.dynamicAction, this.runDynamicAction);
		},

		runPlusAction: function(opt, index) {

			var plusAction = this.meta.plusAction[opt],
				$cid = $('#' + this.cid),
				$selector, options, action;

			$selector = plusAction.selector === 'this' ? $cid : $cid.find(plusAction.selector);

			options = $.isNumeric(index) ? this.options.plusOptions[opt][index] : this.options.plusOptions[opt];
			action = index ? plusAction.action[index] : plusAction.action[0];
			action.call(this, $selector, options);
		},

		runDynamicAction: function(opt, index) {

			var dynamicAction = this.meta.dynamicAction[opt],
				$cid = $('#' + this.cid),
				index = index || 0,
				$selector, $sel, i, options;

			$selector = $cid.find(dynamicAction.selector);

			for (i=0; i<$selector.length; i++) {

				$sel = $selector.eq(i);
				options = this.options.dynamicOptions[i];

				dynamicAction.action[index].call(this, $sel, options);
			}
		},

		modDynamicNodeByMeta: function($frm, index) {

			var cid = this.cid,
				$cid = $('#' + cid),
				dynamicMeta = this.meta.dynamicOptions,
				opt, ds, $inp, $sel, arg;

			for (opt in dynamicMeta) {

				ds = dynamicMeta[opt];
				arg = [];

				$inp = $frm.find('input[name="' + opt + '"]').eq(index);

				if ($inp.prop('disabled'))
					continue;

				if (ds.arg)
					arg.push(ds.arg);

				arg.push($inp.val());

				$sel = $cid.find(ds.selector).eq(index);
				$sel[ds.action].apply($sel, arg);
			}

			this.getDynamicOptions();
		}
	};

	//////////////////////CHOSUN GNB///////////////////////////////
	var ChosunGNB = function(cid) {

		this.name = 'ChosunGNB';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'GNB 넓이': ['고정', '지정간격', '자동'],
					'GNB 넓이 값': '',
					'배경 색': '#333333',
					'글자 색': '#FF8000',
					'HOVER 배경 색': '#FFE271',
					'HOVER 글자 색': '#FFFFFF'
				},

				dynamicMeta: {

					list: {

						Count: 2,
						LastNum: 2
					}
				},

				dynamicOptions: {

				}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				plusOptions: {

					'GNB 넓이': {selector: '.gnb ul', prop: ['gnb-fixed', 'gnb-veriable-w', 'gnb-veriable']},
					'GNB 넓이 값': {selector: '.gnb li', style: 'width'},
					'배경 색': {selector: '.gnb', action: 'attr', arg: 'data-bg-color'},
					'글자 색': {selector: '.gnb', action: 'attr', arg: 'data-text-color'},
					'HOVER 배경 색': {selector: '.gnb', action: 'attr', arg: 'data-hover-bg-color'},
					'HOVER 글자 색': {selector: '.gnb', action: 'attr', arg: 'data-hover-text-color'}
				},

				plusAction: {

					'배경 색': {selector: '.gnb', action: [

						function($sel, options) {

							$sel.find('a').css('background-color', options);
							$sel.attr('data-bg-color', options);
						}
					]},

					'글자 색': {selector: '.gnb', action: [

						function($sel, options) {

							$sel.find('a').css('color', options);
							$sel.attr('data-text-color', options);
						}
					]},

					'HOVER 배경 색': {selector: '.gnb', action: [

						function($sel, options) {

							$sel.attr('data-hover-bg-color', options);
						}
					]},

					'HOVER 글자 색': {selector: '.gnb', action: [

						function($sel, options) {

							$sel.attr('data-hover-text-color', options);
						}
					]}
				},

				dynamicOptions: {

					'메뉴': {selector: '.dynamic a', action: 'text'},
					'주소': {selector :'.dynamic a', action: 'attr', arg: 'href'}
				},
			}
		);

		this.cid = cid;
	}

	ChosunGNB.prototype = new Component();

	$.extend(ChosunGNB.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
					'<button type="button" class="close">X</button>',
					'<nav class="gnb" data-bg-color="#333333" data-text-color="#FF8000" data-hover-bg-color="#FFE271" data-hover-text-color="#FFFFFF">',
					'<ul class="gnb-fixed">',
					'<li class="dynamic"><a href="#" target="_self">메뉴1</a></li>',
					'<li class="dynamic"><a href="#" target="_self">메뉴2</a></li>',
                    '<li class="dynamic"><a href="#" target="_self">메뉴3</a></li>',
					'</ul>',
					'</nav>',
				'</div>'

			].join('');
		},

		defaultAction: function() {},

		getPlusOptions: function($com) {

			this.getPlusOptionsByMeta();
		},

		settingScript: function($frm) {

		},

		setPlusOptions: function($frm) {

			this.setPlusOptionsByMeta();
		},

		getDynamicOptions: function() {

			this.getDynamicOptionsByMeta();
		},

		addDynamicNode: function() {

			var $com = $('#' + this.cid),
				$itemList = $com.find('.dynamic'),
				newItem = $itemList.first().clone();

			$itemList.last().after(newItem);

			this.options.dynamicMeta.list.Count++;
		},

		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);
		},

		deleteDynamicNode: function(index) {

			var $com = $('#' + this.cid);

			$com.find('.dynamic').eq(index).remove();
			this.options.dynamicMeta.list.Count--;
		}
	});

	/////////////////////CHOSUN TAB////////////////////////////////
	var ChosunTab = function(cid) {

		this.name = 'ChosunTab';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'탭 방향': ['세로', '가로'],
					'탭 넓이': ['균등 넓이', '지정 넓이', '글자기준 넓이'],
					'탭 넓이 값': '300px',
					'탭 간격': ['있음', '없음'],
					'탭 간격 값': '2em',
					'탭 배경색': ['있음', '없음'],
					'탭 배경색 값': '#FFFFFF',
					'탭 제목': ['글자', '이미지']
				},

				dynamicMeta: {

					tab: {

						Count: 2,
						LastNum: 2
					}
				},

				default: {

					dynamicOptions: {

						'HOVER 이미지': 'img/tab_hover.png',
						'ON 이미지': 'img/tab_on.png',
						'OFF 이미지': 'img/tab_off.png'
					}
				}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				plusOptions: {

					'탭 방향': {selector: '#tabs', prop: ['tabs-vertical', 'tabs-horizontal']},
					'탭 넓이': {selector: '.tabs-navi', prop: ['table', 'fluid-w', 'fluid']},
					'탭 넓이 값': {selector: '.tabs-navi li', style: 'width'},
					'탭 간격': {selector: '.tabs-navi', prop: ['tabs-gap', 'tabs-fit']},
					'탭 간격 값': {selector: '.tabs-navi li', style: 'margin-right'},
					'탭 배경색': {selector: '.tabs-navi', prop: ['tabs-bg', '']},
					'탭 배경색 값': {selector: '.tabs-navi', style: 'background-color'},
					'탭 제목': {selector: '#tabs', prop: ['tabs-text', 'tabs-img']}
				},

				plusAction: {

					'탭 넓이': {selector: '.tabs-navi li', action: [

						function($sel, options) {

							$sel.css('width', 'calc(100% / ' + $sel.length + ')');
						},

						$.noop,
						$.noop
					]},

					'탭 넓이 값': {selector: '.tabs-panel', action: [

						function($sel, options) {

							var tabWidth = this.options.plusOptions['탭 넓이 값'];
							$sel.css('width', 'calc(100% - ' + tabWidth + ' - 1px)');
						},
					]}
				},

				dynamicOptions: {

					'제목': {selector: '.tabs-navi span', action: 'text'},
					'HTML': {selector: '.dynamic', action: 'html'},
					'HOVER 이미지': {selector :'.tabs-navi img', action: 'attr', arg: 'data-hover-image'},
					'ON 이미지': {selector :'.tabs-navi img', action: 'attr', arg: 'data-on-image'},
					'OFF 이미지': {selector :'.tabs-navi img', action: 'attr', arg: 'data-off-image'}
				},

				dynamicAction: {

					'탭 제목': {selector: '.tabs-navi a', action: [

						function($sel, options) {

							$sel.find('span').text(options['제목']).show();
							$sel.find('img').hide();
						},

						function($sel, options) {

							var image = $sel.closest('li').hasClass('selected') ? options['ON 이미지'] : options['OFF 이미지'];

							$img = $sel.find('img');
							$img.attr('data-on-image', options['ON 이미지']);
							$img.attr('data-off-image', options['OFF 이미지']);
							$img.attr('data-hover-image', options['HOVER 이미지']);

							$img.attr('src', image).show();
							$sel.find('span').hide();
						}]
					}
				},

				settingScript: {

					'탭 방향': {

						'세로': [

							{'탭 넓이': false},
							{'탭 넓이 값': true},
							{'탭 간격': false},
							{'탭 간격 값': false},
							{'탭 배경색': false},
							{'탭 배경색 값': false}
						],

						'가로': [

							{'탭 넓이': true},
							{'탭 간격': true},
							{'탭 배경색': true},
						]
					},

					'탭 넓이': {

						'균등 넓이': [{'탭 넓이 값': false}],
						'지정 넓이': [{'탭 넓이 값': true}],
						'글자기준 넓이': [{'탭 넓이 값': false}]
					},

					'탭 간격': {

						'있음': [{'탭 간격 값': true}],
						'없음': [{'탭 간격 값': false}]
					},

					'탭 배경색': {

						'있음': [{'탭 배경색 값': true}],
						'없음': [{'탭 배경색 값': false}]
					},

					'탭 제목': {

						'글자': [{'제목': true, 'HTML': true, 'HOVER 이미지': false, 'ON 이미지': false, 'OFF 이미지': false}],
						'이미지': [{'제목': false, 'HTML': false, 'HOVER 이미지': true, 'ON 이미지': true, 'OFF 이미지': true}]
					}
				}
			}
		);

		this.cid = cid;
	}

	ChosunTab.prototype = new Component();

	$.extend(ChosunTab.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
					'<button type="button" class="close">X</button>',
					'<div id="tabs" class="tabs-text tabs-horizontal">',
						'<ul class="tabs-navi ui-clearfix table tabs-fit">',
						'<li class="selected"><a href="#"><span>첫번째 탭 제목</span><img /></a></li>',
						'<li><a href="#"><span>두번째 탭 제목</span><img /></a></li>',
                        '<li><a href="#"><span>세번째 탭 제목</span><img /></a></li>',
						'</ul>',
						'<div class="tabs-panel dynamic changeable-area">첫번째 탭에 대한 내용</div>',
						'<div class="tabs-panel dynamic changeable-area">두번째 탭에 대한 내용</div>',
                        '<div class="tabs-panel dynamic changeable-area">세번째 탭에 대한 내용</div>',
					'</div>',
				'</div>'

			].join('');
		},

		defaultAction: function() {

			var $tabsNavi = $('#' + this.cid).find('.tabs-navi li');
			$tabsNavi.first().click();
		},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		settingScript: function($frm) {

			this.settingScriptByMeta();
			$frm.find('input').click({meta: this.meta.settingScript}, this.settingScriptByMeta);
		},

		setPlusOptions: function() {

			this.setPlusOptionsByMeta();
		},

		getDynamicOptions: function() {

			this.getDynamicOptionsByMeta();
		},

		addDynamicNode: function() {

			var cid = this.cid,
				$cid = $('#' + cid),
				$tabs = $cid.find('#tabs'),
				$navList = $cid.find('.tabs-navi li'),
				$tabList = $cid.find('.tabs-panel'),
				$newNav = $navList.first().clone(),
				$newTab = $tabList.first().clone(),
				i = ++this.options.dynamicMeta.tab.LastNum;

			if ($tabs.hasClass('selected'))
				$newNav.find('img').attr('src', this.options.dynamicOptions[$navList.length - 1]['OFF 이미지']);

			else
				$newNav.find('span').text('새 탭');

			$navList.last().after($newNav);

			$newTab.text('test' + i);
			$tabList.last().after($newTab);

			this.options.dynamicMeta.tab.Count++;

			this.getDynamicOptions();
			this.setPlusOptions();
			this.defaultAction();
		},

		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);
		},

		deleteDynamicNode: function(index) {

			var cid = this.cid,
				$cid = $('#' + cid);

			$cid.find('.tabs-navi li').eq(index).remove();
			$cid.find('.tabs-panel').eq(index).remove();
			this.options.dynamicMeta.tab.Count--;

			this.getDynamicOptions();
			this.setPlusOptions();
			this.defaultAction();
		}
	});

	/////////////////////CHOSUN IMAGE SLIDER/////////////////////
	var ChosunImageSlider = function(cid) {

		this.name = "ChosunImageSlider";
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'이미지 버튼': ['사용', '미사용'],
					'글자 위치': ['이미지와 겹침', '이미지 아래'],
					'제목': '하이라이트',
					'이미지를 배경으로': ['설정하지 않음', '설정'],
					'배경 이미지 크기': 'auto',
					'배경 이미지 위치': '0% 0%',
					'배경 이미지 높이': '200px'
				},

				dynamicMeta: {

					slide: {

						Count: 3,
						LastNum: 3
					}
				},

				default: {

					dynamicOptions: {

						'이미지': 'img/example-slide-1.png'
					}
				}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				plusOptions: {

					'이미지 버튼': {selector: '.btn-control', prop: ['use-btn', 'hidden']},
					'글자 위치': {selector: '.slider', prop: ['floor', 'basic']},
					'제목': {selector: 'h5', action: 'text'},
					'이미지를 배경으로': {selector: '.slider', prop: ['', 'sdr-size']},
					'배경 이미지 크기': {selector: '.dynamic span', style: 'background-size'},
					'배경 이미지 위치': {selector: '.dynamic span', style: 'background-position'},
					'배경 이미지 높이': {selector: '.dynamic span', style: 'height'}
				},

				plusAction: {

					'이미지를 배경으로': {selector: '.dynamic', action: [

						function($selector, options) {

							$selector.find('span').hide();
							$selector.find('img').show();
						},

						function($selector, options) {

							$selector.find('img').hide();
							$selector.find('span').css('display', 'block');
						}
					]}
				},

				dynamicOptions: {

					'텍스트': {selector: '.dynamic a', action: 'text'},
					'주소': {selector: '.dynamic a', action: 'attr', arg: 'href'},
					'이미지': {selector :'.dynamic img', action: 'attr', arg: 'src'},
				},

				dynamicAction: {

					'이미지': {selector: '.dynamic', action: [

						function($selector, options) {

							var $image = $selector.find('img'),
								$span = $selector.find('span');

							$span.css('background-image', 'url("' + $image.attr('src') + '")');
						}
					]}
				},

				settingScript: {

					'이미지를 배경으로': {

						'설정': [

							{'배경 이미지 크기': true},
							{'배경 이미지 위치': true},
							{'배경 이미지 높이': true}
						],

						'설정하지 않음': [

							{'배경 이미지 크기': false},
							{'배경 이미지 위치': false},
							{'배경 이미지 높이': false}
						]
					}
				}
			}
		);

		this.cid = cid;
	}

	ChosunImageSlider.prototype = new Component();

	$.extend(ChosunImageSlider.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
					'<button type="button" class="close">X</button>',
					'<div class="slider basic image-tag">',
						'<h5>이미지 슬라이더 제목</h5>',
						'<ol class="btn-control use-btn">',
						'<li><a class="active">1</a></li>',
				 		'<li><a>2</a></li>',
				 		'<li><a>3</a></li>',
				 		'</ol>',
				 		'<ul>',
						'<li class="dynamic" style="display:block;">',
						'<img class="changeable-img" src="img/example-slide-1.jpg">',
						'<span style="height:200px; background-image:url(img/example-slide-1.jpg)"></span>',
						'<p><a href="#" target="_self">첫번째 이미지에 대한 텍스트</a></p>',
						'</li>',
						'<li class="dynamic">',
						'<img class="changeable-img" src="img/example-slide-2.jpg">',
						'<span style="height:200px; background-image:url(img/example-slide-2.jpg)"></span>',
						'<p><a href="#" target="_self">두번째 이미지에 대한 텍스트"</a></p>',
						'</li>',
						'<li class="dynamic">',
						'<img class="changeable-img" src="img/example-slide-3.jpg">',
						'<span style="height:200px; background-image:url(img/example-slide-3.jpg)"></span>',
						'<p><a href="#" target="_self">세번째 이미지에 대한 텍스트</a></p>',
						'</li>',
						'</ul>',
						'<ol class="flex-control">',
			 			'<li><a class="prev">이전</a></li>',
			 			'<li><a class="next">다음</a></li>',
			 			'</ol>',
			 		'</div>',
				'</div>'

			].join('');
		},

		defaultAction: function() {

			$('#' + this.cid).find('.btn-control a').first().click();
		},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		settingScript: function($frm) {

			this.settingScriptByMeta();
			$frm.find('input').click({meta: this.meta.settingScript}, this.settingScriptByMeta);
		},

		getDynamicOptions: function() {

			this.getDynamicOptionsByMeta();
		},

		setPlusOptions: function() {

			this.setPlusOptionsByMeta();
		},

		addDynamicNode: function() {

			var $cid = $('#' + this.cid),
				$btnList = $cid.find('.btn-control li'),
				$slideList = $cid.find('.dynamic'),
				$newBtn = $btnList.first().clone(),
				$newSlide = $slideList.first().clone();

			$newBtn.find('a').removeClass('active');
			$btnList.last().after($newBtn);
			$slideList.last().after($newSlide);

			this.options.dynamicMeta.slide.Count++;

			this.getDynamicOptions();
			this.setPlusOptions();
			this.defaultAction();
		},

		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);
		},

		deleteDynamicNode: function(index) {

			var cid = this.cid,
				$cid = $('#' + cid);

			$cid.find('.btn-control li').eq(index).remove();
			$cid.find('.dynamic').eq(index).remove();
			this.options.dynamicMeta.slide.Count--;

			this.getDynamicOptions();
			this.setPlusOptions();
			this.defaultAction();
		}
	});
	//////////////////////////////ChosunGallery/////////////////////////////////////
	var ChosunGallery = function(cid) {

		this.name = 'ChosunGallery';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'이미지 위치': ['오른쪽', '아래'],
					'글자 위치': ['이미지와 겹침', '이미지 아래'],
					'제목': '갤러리',
					'이미지를 배경으로': ['설정하지 않음', '설정'],
					'배경 이미지 크기': 'auto',
					'배경 이미지 위치': '0% 0%',
					'배경 이미지 높이': '200px'
				},

				dynamicMeta: {

					gallery: {

						Count: 2,
						LastNum: 2
					}
				}
			}
		);

		this.cid = cid;

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{

				plusOptions: {

					'이미지 위치': {selector: '.gallery', prop:['', 'gal-horizontal']},
					'글자 위치': {selector: '.gallery', prop: ['level', 'base']},
					'제목': {selector: 'h5', action: 'text'},
					'이미지를 배경으로': {selector: '.gallery', prop: ['', 'image-bg']},
					'배경 이미지 크기': {selector: '.dynamic span', style: 'background-size'},
					'배경 이미지 위치': {selector: '.dynamic span', style: 'background-position'},
					'배경 이미지 높이': {selector: '.dynamic span', style: 'height'}
				},

				plusAction: {

					'이미지를 배경으로': {selector: '.dynamic', action: [

						function($selector, options) {

							$selector.find('span').hide();
							$selector.find('img').show();
						},

						function($selector, options) {

							$selector.find('img').hide();
							$selector.find('span').css('display', 'block');
						}
					]}
				},

				dynamicOptions: {

					'이미지': {selector: 'dd img', action: 'attr', arg: 'src'},
					'글자': {selector: 'dt a', action: 'text'},
					'주소': {selector: 'dt a', action: 'attr', arg: 'href'}
				},

				dynamicAction: {

					'이미지': {selector: 'li img', action: [

						function($sel, options) {

							$sel.attr('src', options['이미지']);
						}
					]}
				},

				settingScript: {

					'이미지를 배경으로': {

						'설정': [

							{'배경 이미지 크기': true},
							{'배경 이미지 위치': true},
							{'배경 이미지 높이': true}
						],

						'설정하지 않음': [

							{'배경 이미지 크기': false},
							{'배경 이미지 위치': false},
							{'배경 이미지 높이': false}
						]
					}
				}
			}
		);

		this.cid = cid;
	}

	ChosunGallery.prototype = new Component();

	$.extend(ChosunGallery.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml =  [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
					'<button type="button" class="close">X</button>',
					'<div class="gallery base">',
						'<div class="tit_gallery">',
							'<h5>갤러리 제목</h5>',
							'<span class="more"><a>더보기</a></span>',
						'</div>',
						'<dl class="dynamic" style="display:block;">',
						'<dd><a><span style="height:200px; background-image:url(img/example-slide-1.jpg)"></span><img src="img/example-slide-1.jpg"></a></dd>',
						'<dt><a href="#">첫번째 이미지에 대한 텍스트</a></dt>',
						'</dl>',
						'<dl class="dynamic">',
						'<dd><a><span style="height:200px; background-image:url(img/example-slide-2.jpg)"></span><img src="img/example-slide-2.jpg"></a></dd>',
						'<dt><a href="#">두번째 이미지에 대한 텍스트"</a></dt>',
						'</dl>',
						'<dl class="dynamic">',
						'<dd><a><span style="height:200px; background-image:url(img/example-slide-3.jpg)"></span><img src="img/example-slide-3.jpg"></a></dd>',
						'<dt><a href="#">세번째 이미지에 대한 텍스트</a></dt>',
						'</dl>',
						'<ul>',
						'<li><a><span></span><img src="img/example-slide-1.jpg"></a></li>',
						'<li><a><span></span><img src="img/example-slide-2.jpg"></a></li>',
						'<li><a><span></span><img src="img/example-slide-3.jpg"></a></li>',
						'</ul>',
					'</div>',
				'</div>'

			].join('');
		},

		defaultAction: function() {},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		settingScript: function($frm) {

			this.settingScriptByMeta();
			$frm.find('input').click({meta: this.meta.settingScript}, this.settingScriptByMeta);
		},

		setPlusOptions: function($frm) {

			this.setPlusOptionsByMeta();
		},

		getDynamicOptions: function() {

			this.getDynamicOptionsByMeta();
		},

		addDynamicNode: function() {},

		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);
		},

		deleteDynamicNode: function(index) {}
	});

	var ChosunFrameList = function(cid){
		this.name = "ChosunFrameList";
		this.options = $.extend({}
		,this.options
		,{plusOptions:{
			ListDataSrc:""	,
			Title:"라이프 인기기사",
		},
		dynamicMeta:{
			tab:{Count:2,
				LastNum:2}
		},
		dynamicOptions:{

		}});
		this.cid = cid;
	}

	ChosunFrameList.prototype = new Component();

	$.extend(ChosunFrameList.prototype,{

		makeDefaultHtml:function(){
			this.defaultHtml =  '<div id="'+this.cid+'" class = "com" data-com-type="'+this.name+'"><button type="button" class="close">X</button>'
			+'<div class="aside-ranking">'
			+'<h5>라이프 인기기사</h5>'
			+'<iframe src="http://newsplus.chosun.com/rank/main.html?site=newsplus" width="100%" height="220" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" id="life_hot_if"></iframe>'
			+'</div>'
			+'</div>'

		},
		defaultAction:function(){

		},
		getPlusOptions:function(){

			var cid = this.cid;

			this.options.plusOptions.ListDataSrc = $('#'+cid).find('.aside-ranking>iframe').attr("src");
			this.options.plusOptions.Title = $('#'+cid).find('.aside-ranking>h5').text();

		},
		settingScript:function($frm){},
		setPlusOptions:function($frm){
			var cid = this.cid;

			var src = $frm.find("input[name=ListDataSrc]").val();
			$('#'+cid).find('.aside-ranking>iframe').attr("src", src);

			var title = $frm.find("input[name=Title]").val();
			$('#'+cid).find('.aside-ranking>h5').text(title);


		},
		getDynamicOptions:function(){},
		addDynamicNode:function(){},
		modDynamicNode:function($frm, id){},
		deleteDynamicNode:function(id){}

	});





	var ChosunFooter = function(cid){
		this.name = "ChosunFooter";
		this.options = $.extend({}
		,this.options
		,{plusOptions:{
		},
		dynamicMeta:{
			tab:{Count:2,
				LastNum:2}
		},
		dynamicOptions:{

		}});
		this.cid = cid;
	}

	ChosunFooter.prototype = new Component();

	$.extend(ChosunFooter.prototype,{

		makeDefaultHtml:function(){

		/*	this.defaultHtml =  '<div id="'+this.cid+'" class = "com" data-com-type="'+this.name+'">'
					+'<div id="bottomarea">'
					+'<script language="javascript" src="http://www.chosun.com/dhtm/js/common/copyright.js"></script>'
					+'</div>'
			+'</div>'*/

			this.defaultHtml =  '<div id="'+this.cid+'" class = "com" data-com-type="'+this.name+'"><button type="button" class="close">X</button>'
			+'<div id="bottomarea">'
			+' <style type="text/css"> img {border: 0px; margin: 0px; padding: 0px;} form {margin: 0px; padding: 0px;} ol,ul,li,dl,dt,dd,h4	{ list-style:none; margin:0px; padding:0px; } #footer_box{  font-family: "맑은 고딕", "Malgun Gothic", "돋움", Dotum, "굴림", Gulim, "Apple SD Gothic Neo"; margin: 0 auto; clear: both; width: 970px; height: 115px; min-height: 115px; padding: 10px 0 0px 0; overflow: hidden; text-align: left; border-top: 2px solid #8e8e8e; font-size: 12px; font-weight: normal; background-color: #ffffff; color: #333333; } #footer_box a, #footer_box a:link, #footer_box a:visited, #footer_box a:active {text-decoration:none; color:#333333;} #footer_box a:hover {text-decoration:underline; color:#333333;} .f_copyright {width:970px; text-align:center;} .f_copyright li {display:inline; color:#5d5d5d;} .f_copyright li img {vertical-align:middle; margin:0 0 4px 0; border:none;} .relate_link {width:900px; height:63px; margin:5px 0 0 35px; background:url("http:\/\/image.chosun.com/cs/200806/images/bg_footer.gif") no-repeat 0 0px;  text-align:left;} .relate_link ul li {display:inline;} .relate_link ul li span {color:#b7b7b7; padding:0 1px 0 4px;} .relate_link ul li select {vertical-align:middle; margin:0 0 4px 4px; font-family: "맑은 고딕", "Malgun Gothic", "돋움", Dotum, "굴림", Gulim, "Apple SD Gothic Neo";} .relate_link ul li img {vertical-align:middle; margin:0 0 2px 0; border:none;} .relate_link .chosun_rel {padding:10px 0 0 24px;} .relate_link .chosuncom_rel {margin:1px 0 0 24px;} </style> <div id="footer_box"> 	<ul class="f_copyright"> 		<li><a href="http://about.chosun.com/" target="_blank"><img src="http://image.chosun.com/cs/201008/c_logo_201008.gif"></a></li> 		<li style="margin:0 6px 0 12px;"><a href="http://www.chosun.com"><img src="http://image.chosun.com/cs/200806/images/chosuncom.gif" alt="chosun.com"></a></li> 		<li>Copyright (c) chosun.com All rights reserved.</li> 		<li style="margin:0 15px 0 8px;">☎ 02) 724-5114</li> 		<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=3E" target="_blank"><img src="http://image.chosun.com/cs/200806/images/our_nei.gif" alt="우리이웃"></a></li> 	</ul> 	<div class="relate_link"> 	<form> 		<ul class="chosun_rel"> 			<li style="padding-right:48px"><strong>조선일보</strong></li> 			<li><a href="http://about.chosun.com/" target="_blank">회사소개</a><span>|</span></li> 			<li><a href="http://about.chosun.com/adcenter/ad_01_01.html" target="_blank">광고안내(신문)</a><span>|</span></li> 			<li><a href="http://about.chosun.com/recruit/recruit_c01.html" target="_blank">기자채용</a><span>|</span></li> 			<li><a href="http://membership.chosun.com/etc/jebo/write.html" target="_blank">기사제보</a><span>|</span></li> 			<li><a href="http://news.chosun.com/section/customer/index.html">고객센터</a><span>|</span></li> 			<li><a href="http://news.chosun.com/ombudsman/">독자권익보호위원회</a><span>|</span></li> 			<li><a href="http://visit.chosun.com/" target="_blank">조선일보 기자체험</a><span>|</span></li> 			<li><a href="http://gallery.chosun.com/" target="_blank">미술관이용</a><span>|</span></li> 			<li style="display:none"><a href="http://culture.chosun.com/index.jsp" target="_blank">문화사업</a></li> 			<li><select style="width:75px;font-size:11px;color:#333333;" onchange="copyrtChgUrl(this.value)"> 			  <option value="0">관련회사</option> 				<option value="http://www.chogwang.com/">조광</option>				<option value="http://sports.chosun.com/service/company/main_company_index.htm">스포츠조선</option>				<option value="http://www.chosunis.com/main.aspx">조선아이에스</option>				<option value="http://golf.chosun.com/info/golfbusiness.htm">골프조선</option>				<option value="http://company.healthchosun.com/mpr/index.jsp">헬스조선</option>				<option value="http://chosunedu.co.kr/">조선에듀케이션</option>				<option value="http://chosunnewspress.chosun.com/client/info/info1.asp">조선뉴스프레스</option>				<option value="http://biz.chosun.com/about/chosunbiz_info.html">조선경제i</option>				<option value="http://tv.chosun.com/about/intro.html">조선방송</option>			  </select></li> 		</ul> 	</form> 		<ul class="chosuncom_rel"> 			<li style="padding-right:12px"><strong>디지틀조선일보</strong></li> 			<li><a href="http://pr.dizzo.com/" target="_blank">회사소개</a><span>|</span></li> 			<li>광고안내(<a href="http://www.chosun.com/section/adcenter/" target="_blank">인터넷</a>, <a href="http://pr.dizzo.com/sub_cityvision.html" target="_blank">전광판</a>, <a href="http://businesstv.chosun.com/html/200801/ad.html" target="_blank">케이블TV</a>)<span>|</span></li> 			<li><a href="http://bbs.chosun.com/bbs.message.list.screen?bbs_id=2003110000" target="_blank">인재채용</a><span>|</span></li> 			<li><a href="http://inside.chosun.com/bizcenter/index.html">제휴안내</a><span>|</span></li> 			<li><a href="http://members.chosun.com/cms_user/privacy/web/index.jsp"><strong>개인정보취급방침</strong></a><span>|</span></li> 			<li><a href="http://inside.chosun.com/bizcenter/sub10.html">저작권규약</a><span>|</span></li> 			<li><a href="http://news.chosun.com/section/customer/sitemap.html">전체서비스</a></li> 			<li style="display:none"><a href="http://inside.chosun.com/newsletter/Newsletter.html">뉴스레터</a><span>|</span></li> 			<li style="display:none"><a href="http://rssplus.chosun.com/"><img src="http://image.chosun.com/cs/201112/rss.gif" border="0" alt="RSS"></a></li> 		</ul> 	</div> </div> <script type="text/javascript" src="http://news.chosun.com/dhtm/js/common/video_tag.js"></script>'
		+'</div>'
		+'</div>'
		},
		defaultAction:function(){},
		getPlusOptions:function(){},
		settingScript:function($frm){},
		setPlusOptions:function($frm){},
		getDynamicOptions:function(){},
		addDynamicNode:function(){},
		modDynamicNode:function($frm, id){},
		deleteDynamicNode:function(id){}
	});

	var ChosunLifeGNB = function(cid){
		this.name = "ChosunLifeGNB";
		this.options = $.extend({}
		,this.options
		,{plusOptions:{
		},
		dynamicMeta:{
			tab:{Count:2,
				LastNum:2}
		},
		dynamicOptions:{

		}});
		this.cid = cid;
	}

	ChosunLifeGNB.prototype = new Component();

	$.extend(ChosunLifeGNB.prototype,{

		makeDefaultHtml:function(){


			this.defaultHtml =  '<div id="'+this.cid+'" class = "com" data-com-type="'+this.name+'"><button type="button" class="close">X</button>'
				+'<div id="toparea">'
				+'<h1><a href="http://news.chosun.com?gnb_logo"><img src="http://image.chosun.com/life/life/logo_chosun.gif" alt="chosun.com"></a><sup><a href="http://life.chosun.com?gnb_menu"><img src="http://image.chosun.com/life/life/logo_life.gif" alt="라이프"></a></sup></h1>		<p class="season_banner"><iframe src="http://newsplus.chosun.com/common/gnb_banner/index.html" width="245" height="60" frameborder="0" scrolling="0"></iframe></p>		<ul class="topmenu" id="topmenu">			<li><a href="http://danmee.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_01_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="결혼·살림·육아"></a></li>			<li><a href="http://style.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_02_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="패션·뷰티"></a></li>			<li><a href="http://travel.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_03_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="여행"></a></li>			<li><a href="http://food.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_04_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="푸드"></a></li>			<li><a href="http://books.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_05_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="북스"></a></li>			<li><a href="http://art.chosun.com/"><img src="http://image.chosun.com/life/life/topmenu_06_off.gif" onmouseover="imageOver(this);" onmouseout="imageOut(this);" alt="전시·공연"></a></li>			<li class="review"><a href="http://review.chosun.com/"><img src="http://image.chosun.com/life/life/btn_lifereview.gif" alt="라이프 리뷰"></a></li>		</ul><script type="text/javascript" src="http://news.chosun.com/life/js/life/simple_gnb.js"></script>		<ul class="gnb">			<li class="gnb_chosun"><a href="http://www.chosun.com"><img src="http://image.chosun.com/life/art/gnb_chosuncom.gif" alt="chosun.com"></a></li>			<li class="gnb_life"><a href="http://life.chosun.com">라이프</a></li>			<li class="gnb_more">				<span><a href="#">더보기</a></span>				<div class="allserviceview">					<ul>						<li><a href="http://myhome.chosun.com">마이홈</a></li>						<li><a href="http://focus.chosun.com/">포커스</a></li>						<li><a href="http://car.biz.chosun.com/">카조선</a></li> 						<li><a href="http://forum.chosun.com/">토론마당</a></li> 					</ul> 					<ul> 						<li><a href="http://newsplus.chosun.com/inside/">인사이드</a></li> 						<li><a href="http://search.chosun.com/search/personcondition.search">인물DB</a></li> 						<li><a href="http://danmee.chosun.com/">단미</a></li> 						<li><a href="http://health.chosun.com/">헬스</a></li> 					</ul> 					<ul> 						<li><a href="http://newsplus.chosun.com/inside/list.html?in_theme=4&amp;in_sitecd=H&amp;in_categ=H1">Why</a></li> 						<li><a href="http://bemil.chosun.com/">유용원M</a></li> 						<li><a href="http://photo.chosun.com/">포토</a></li> 						<li><a href="http://review.chosun.com/">리뷰</a></li> 					</ul> 					<ul class="lastchild"> 						<li><a href="http://inside.chosun.com/">인포그래픽스</a></li> 						<li><a href="http://srchdb1.chosun.com/pdf/i_service/">PDF지면</a></li> 						<li><a href="http://news.chosun.com/ranking/index.html">캘린더뉴스</a></li> 						<li class="all_view"><a href="http://www.chosun.com/section/customer/sitemap.html">전체보기</a></li> 					</ul> 				</div>			</li>		</ul><script type="text/javascript" src="http://news.chosun.com/life/js/life/login.js"></script>		<div class="gnb_member">			<span><a id="logLink" href="https://membership.chosun.com/login/protect_sso/sso_user_info.jsp?returl=http%3A//life.chosun.com/index.html%3Fgnb_menu" target="_top"><img id="logImg" src="http://news.chosun.com/life/login_btn.gif" alt="로그인" title="로그인"></a></span><span class="join"><a id="memberLink" href="https://membership.chosun.com/join/registUser.jsp?site=chosun" target="_top"><img id="memberImg" src="http://news.chosun.com/life/join_btn.gif" alt="회원가입" title="회원가입"></a></span>		</div>'
				+'<form method="get" id="id_searchForm" name="searchForm" action="http://search.chosun.com/search/total.search" target="_blank" accept-charset="utf-8" onsubmit="goSearch(); return false;">		<fieldset class="search">			<legend>통합검색</legend>			<span class="InputOutline"><input type="text" class="searchTerm" id="query" name="query" title="검색어 입력"></span>			<a href="javascript:goSearch();"><img src="http://image.chosun.com/life/life/btn_search.gif" title="검색" alt="검색"></a>			<input type="hidden" name="pageconf" id="pageconf">		</fieldset>		</form>'
				+'<div class="bestnews">'
				+'<p><iframe class="b_news" src="http://newsplus.chosun.com/common/gnbnews/" height="20" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></p>'
				+'<span class="db" style="left:820px;"><a href="http://srchdb1.chosun.com/pdf/i_service/">지면 보기</a> | <a href="http://db.chosun.com/people/index.html">인물DB</a></span>'
				+'</div>'
				+'</div>'
		+'</div>'

		},
		defaultAction:function(){},
		getPlusOptions:function(){},
		settingScript:function($frm){},
		setPlusOptions:function($frm){},
		getDynamicOptions:function(){},
		addDynamicNode:function(){},
		modDynamicNode:function($frm, id){},
		deleteDynamicNode:function(id){}

	});

	var ChosunComGNB = function(cid){
		this.name = "ChosunComGNB";
		this.options = $.extend({}
		,this.options
		,{plusOptions:{
		},
		dynamicMeta:{
			tab:{Count:2,
				LastNum:2}
		},
		dynamicOptions:{

		}});
		this.cid = cid;
	}

	ChosunComGNB.prototype = new Component();

	$.extend(ChosunComGNB.prototype,{

		makeDefaultHtml:function(){

			this.defaultHtml =  '<div id="'+this.cid+'" class = "com" data-com-type="'+this.name+'"><button type="button" class="close">X</button>'
			+'<div id="csHeader">		    <h1><a href="http://www.chosun.com/index.html?gnb_logo" id="gnb_logo"><span class="hide">1등 인터넷뉴스 조선닷컴</span><img src="http://image.chosun.com/main/201003/chosun_logo.gif" alt="chosun.com"><img src="http://image.chosun.com/main/201412/logo_final.jpg" alt="chosun.com" style="display:none"></a></h1>		    <link rel="stylesheet" type="text/css" href="http://news.chosun.com/dhtm/css/main/201409/cs_top_2014_gnb.css">                <h1 id="news_logoh1">	<a href="http://news.chosun.com/index.html?gnb_logo">		<img align="top" style="margin:0px 11px 0px 3px;" title="조선닷컴" alt="chosun.com" src="http://image.chosun.com/main/201109/logo_chosun_s2011.gif">	</a>	<a id="Catlogo" href="http://news.chosun.com/index.html?gnb_menu">		<img id="Catlogo_img" style="margin-top:1px;" title="뉴스" alt="chosun.com" src="http://image.chosun.com/cs/201109/chosun_title_news.gif">	</a></h1><iframe id="under_if" class="under_if" style="position:absolute; top:131px; left:0px; width:970px; height:1px; z-index:-99; filter:alpha(opacity=0);" title="not"></iframe><div class="chosunSet_2011">	<dl>	<dt>조선닷컴을 설정</dt>	<dd class="chosunSet_2011Con1"><a href="http://chn.chosun.com/?gnb_bar" target="_blank" title="Open in new window">中文</a> · <a href="http://english.chosun.com/?gnb_bar" target="_blank" title="Open in new window">English</a> · <a href="http://www.chosunonline.com/?gnb_bar" target="_blank" title="Open in new window">日本語</a></dd>	<dd class="chosunSet_2011Con2"><a href="http://morningplus.chosun.com/service/supp/pr_supp_benefit_01.jsp?gnb_sub" target="_blank" title="구독신청(새창)">구독신청</a></dd>	</dl></div><div class="headTopNav_2011">	<dl class="familyMenu_2011" style="display:none">	<dt>페밀리사이트</dt>	<dd><a href="http://morningplus.chosun.com/?gnb_bar" target="_blank" title="모닝플러스(새창)">모닝플러스</a></dd>	<dd><a href="http://sports.chosun.com/index.htm?gnb_bar" target="_blank" title="스포츠조선(새창)">스포츠조선</a></dd>	<dd><a href="http://www.tvchosun.com/main.html?gnb_bar" target="_blank" title="TV조선(새창)">TV조선</a></dd>	</dl>	<dl class="favorMenu_2011" style="display:none;">	<dt>서비스 사이트 목록</dt>	<dd><a href="http://blog.chosun.com/main.screen?gnb_bar" target="_blank" title="블로그(새창)">블로그</a></dd>	<dd><a href="#link8" class="hFavorMore" onmouseover="ShowBx(\'hFavorMoreList\');" onfocus="ShowBx(\'hFavorMoreList\');" onmouseout="HideBx(\'hFavorMoreList\');" onblur="HideBx(\'hFavorMoreList\');">더보기</a>		<ul id="hFavorMoreList" class="hFavorMoreList" onmouseover="ShowBx(\'hFavorMoreList\');" onmouseout="HideBx(\'hFavorMoreList\');">		<li>· <a href="http://myhome.chosun.com/scrap/scrap.html?gnb_bar">내스크랩</a></li>		<li>· <a href="http://newsplus.chosun.com/inside/index.html?gnb_bar">인사이드</a></li>		<li>· <a href="http://newsplus.chosun.com/inside/list.html?in_theme=4&amp;in_sitecd=H&amp;in_categ=H1&amp;gnb_bar">Why</a></li>		<li>· <a href="http://inside.chosun.com/?gnb_bar">인포그래픽스</a></li>		<li>· <a href="http://focus.chosun.com/index.html?gnb_bar">포커스</a></li>		<li>· <a href="http://db.chosun.com/people/index.html?gnb_bar">인물DB</a></li>		<li>· <a href="http://bemil.chosun.com/?gnb_bar">유용원M</a></li>		<li>· <a href="http://srchdb1.chosun.com/pdf-ach/i_service/?gnb_bar">지면 보기</a></li>		<li>· <a href="http://car.chosun.com/?gnb_bar">카조선</a></li>		<li>· <a href="http://danmee.chosun.com/?gnb_bar">단미조선</a></li>		<li>· <a href="http://photo.chosun.com/?gnb_bar">포토</a></li>		<li>· <a href="http://news.chosun.com/ranking/index.html?gnb_bar">캘린더뉴스</a></li>		<li>· <a href="http://forum.chosun.com/?gnb_bar">토론마당</a></li>		<li>· <a href="http://health.chosun.com/?gnb_bar">헬스조선</a></li>		<li>· <a href="http://review.chosun.com/?gnb_bar">리뷰조선</a></li>		<li><a href="http://news.chosun.com/section/customer/sitemap.html?gnb_bar" class="hTotalView">전체보기</a></li>		</ul>	</dd>	</dl> 	<dl class="memberTools_2011">	<dt>회원메뉴</dt>	<!--[if IE]><dd class="add_fav"><a href="http://news.chosun.com" onclick="this.style.behavior=\'url(#default#homepage)\';this.setHomePage(this.href); return false;">조선닷컴을 시작페이지로</a></dd><![endif]-->	<dd><a id="memberLink" href="https://membership.chosun.com/join/registUser.jsp?site=chosun" target="_top"><img id="memberImg" src="http://image.chosun.com/main/201305/join_bt.gif" alt="회원가입" title="회원가입"></a></dd><dd style="color:#d5d5d5;margin: 0; padding:0;">|</dd><dd><a id="logLink" href="https://membership.chosun.com/login/protect_sso/sso_user_info.jsp?returl=http%3A//chosun.com/" target="_top"><img id="logImg" src="http://image.chosun.com/main/201305/login_bt.gif" alt="로그인" title="로그인"></a></dd>	</dl>	<div class="c"></div></div><hr><div class="headMain">	<dl class="searchFormBx">	<dt>검색</dt>	<dd>		<form method="get" id="id_searchForm" name="id_searchForm" action="http://search.chosun.com/search/total.search" target="_blank" accept-charset="utf-8" onsubmit="goSearch(); return false;">		<fieldset>			<legend>통합검색</legend>			<span class="InputOutline"><input type="text" class="searchTerm" id="query" name="query" title="검색어 입력" onfocus="s_clear();"></span>			<input type="submit" alt="검색" title="검색" class="searchBtn" value="검색">			<input type="hidden" name="pageconf" id="pageconf" value="total">		</fieldset>		</form>	</dd>	</dl><!-- 2014 new gnb s --><ul class="csmenu" id="csmenu_id">	<li><a href="http://news.chosun.com/index.html?gnb_menu" class="cm_news_on" id="cm_news_id">뉴스</a></li>	<li><a href="http://news.chosun.com/editorials/index.html?gnb_menu" class="cm_opi" id="cm_opi_id">오피니언</a></li>	<li><a href="http://biz.chosun.com/index.html?gnb_menu" target="cs_new" class="cm_biz" id="cm_biz_id">경제</a></li>	<li><a href="http://news.chosun.com/sports/index.html?gnb_menu" class="cm_spo" id="cm_spo_id">스포츠</a></li>	<li><a href="http://news.chosun.com/ent/index.html?gnb_menu" class="cm_ent" id="cm_ent_id">연예</a></li>	<li><a href="http://life.chosun.com/index.html?gnb_menu" class="cm_life" id="cm_life_id">라이프</a></li>	<li><a href="javascript:void(0)" class="cm_more" id="cm_more_id" onclick="csmenu_more()">더보기</a>    	<div class="csmenu_more" id="csmenu_more_id" style="display:none;">        	<ul class="csmenu_more_sub">            	<li><a href="http://news.chosun.com/svc/list_in/list.html?gnb_more" class="cms_brd">전체기사</a></li>                <li><a href="http://news.chosun.com/politics/index.html?gnb_more">정치</a></li>                <li><a href="http://biz.chosun.com/index.html?gnb_more" target="cs_new">경제</a></li>                <li><a href="http://news.chosun.com/national/index.html?gnb_more">사회</a></li>                <li><a href="http://news.chosun.com/national/metro/index.html?gnb_more">전국</a></li>                <li><a href="http://news.chosun.com/international/index.html?gnb_more">국제</a></li>                <li><a href="http://news.chosun.com/culture/index.html?gnb_more">문화</a></li>            </ul>            <ul class="csmenu_more_sub">            	<li><a href="http://news.chosun.com/editorials/index.html?gnb_more" class="cms_brd">오피니언</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=617&amp;gnb_more">사설</a></li>            	<li><a href="http://premium.chosun.com/svc/news/nlist.html?catid=11&amp;gnb_more">사내칼럼</a></li>            	<li><a href="http://premium.chosun.com/svc/news/nlist.html?catid=13&amp;gnb_more">전문가칼럼</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=621&amp;gnb_more">시론 · 기고</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=61D&amp;gnb_more">팔면봉</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=624&amp;gnb_more">독자의견</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=62b&amp;gnb_more">발언대</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=62c&amp;gnb_more">아침편지</a></li>            </ul>            <ul class="csmenu_more_sub">            	<li><a href="http://biz.chosun.com/index.html?gnb_more" target="cs_new" class="cms_brd">경제</a></li>            	<li><a href="http://biz.chosun.com/market/index.html?gnb_more" target="cs_new">MARKET</a></li>            	<li><a href="http://biz.chosun.com/estate/index.html?gnb_more" target="cs_new">부동산</a></li>            	<li><a href="http://biz.chosun.com/car_news/index.html?gnb_more" target="cs_new">자동차</a></li>            	<li><a href="http://biz.chosun.com/global/index.html?gnb_more" target="cs_new">글로벌</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=1L&amp;gnb_more">기업</a> · <a href="http://news.chosun.com/svc/list_in/list.html?catid=1M&amp;gnb_more">산업</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=16&amp;gnb_more">IT</a> · <a href="http://news.chosun.com/svc/list_in/list.html?catid=1S&amp;gnb_more">과학</a></li>            	<li><a href="http://news.chosun.com/svc/list_in/list.html?catid=15&amp;gnb_more">유통 · 소비자</a></li>            </ul>            <ul class="csmenu_more_sub">            	<li><a href="http://news.chosun.com/sports/index.html?gnb_more" class="cms_brd">스포츠</a></li>            	<li><a href="http://news.chosun.com/sports/baseball/index.html?gnb_more">야구</a></li>            	<li><a href="http://news.chosun.com/sports/soccer/index.html?gnb_more">축구</a></li>            	<li><a href="http://news.chosun.com/sports/others/index.html?gnb_more">종합</a></li>                <li><a href="http://news.chosun.com/ent/index.html?gnb_more" class="cms_brd">연예</a></li>            	<li><a href="http://news.chosun.com/ent/star/index.html?gnb_more">연예존</a></li>            	<li><a href="http://news.chosun.com/ent/movie/index.html?gnb_more">영화</a></li>            	<li><a href="http://news.chosun.com/ent/for/index.html?gnb_more">TV/방송</a></li>            </ul>            <ul class="csmenu_more_sub">            	<li><a href="http://life.chosun.com/index.html?gnb_more" class="cms_brd">라이프</a></li>				<li><a href="http://danmee.chosun.com/index.html?gnb_more">살림·재테크·육아</a></li>            	<li><a href="http://style.chosun.com/index.html?gnb_more">패션·뷰티</a></li>            	<li><a href="http://travel.chosun.com/index.html?gnb_more">여행</a></li>            	<li><a href="http://food.chosun.com/index.html?gnb_more">푸드</a></li>            	<li><a href="http://books.chosun.com/index.html?gnb_more">북스</a></li>            	<li><a href="http://art.chosun.com/index.html?gnb_more">전시·공연</a></li>            </ul>            <ul class="csmenu_more_bottom">            	<li class="cmb_sns"><a href="http://www.facebook.com/chosun" target="cs_new" class="fb">페이스북</a><a href="http://twitter.com/TheChosunilbo" target="cs_new" class="tw">트위터</a><a href="https://plus.google.com/+Chosun/" target="cs_new" class="gp">구글플러스</a></li>				<li>주요서비스<span></span></li>            	<li><a href="http://inside.chosun.com/index.html?gnb_more">인포그래픽스</a></li>            	<li><a href="http://photo.chosun.com/index.html?gnb_more">포토 · 동영상</a></li>            	<li><a href="http://forum.chosun.com/index.html?gnb_more">토론마당</a></li>            	<li><a href="http://news.chosun.com/ranking/index.html?gnb_more">랭킹</a> | <a href="http://focus.chosun.com/index.html?gnb_more">포커스</a></li>				<li><a href="javascript:void(0)" class="cmb_close" id="cm_more_close" onclick="csmenu_more()" title="닫기">닫기</a></li>            </ul>        </div><!-- csmenu_more -->    </li>    <li class="site_scroll_box_csmenu">	  <div class="site_scroll_box">	  <a class="site_prev browse left" title="이전">이전</a>	  <div class="site_scroll" id="site_scroll">		<div class="items" style="left: -220px;"><div style="text-align:left;" class="cloned">			<a href="http://edu.chosun.com/index.html?gnb_bar" title="맛있는교육(새창)" target="cs_new" class="site_educs">맛있는교육</a>		  </div>		  <div>			<a href="http://tv.chosun.com/main.html?gnb_bar" title="TV조선(새창)" target="cs_new" class="site_tvcs">TV조선</a><a href="http://biz.chosun.com/index.html?gnb_bar" title="조선비즈(새창)" target="cs_new" class="site_csbiz">조선비즈</a><a href="http://sports.chosun.com/index.htm?gnb_bar" title="스포츠조선(새창)" target="cs_new" class="site_spocs">스포츠조선</a>		  </div>		  <div>			<a href="http://businesstv.chosun.com/index.do?gnb_bar" title="비즈니스앤(새창)" target="cs_new" class="site_bntv">비즈니스앤</a><a href="http://health.chosun.com/index.html?gnb_bar" title="헬스조선(새창)" target="cs_new" class="site_health">헬스조선</a><a href="http://pub.chosun.com/index_main.asp?gnb_bar" title="조선pub(새창)" target="cs_new" class="site_pub">조선pub</a>		  </div>		  <div style="text-align:left;">			<a href="http://edu.chosun.com/index.html?gnb_bar" title="맛있는교육(새창)" target="cs_new" class="site_educs">맛있는교육</a>		  </div>		<div class="cloned">			<a href="http://tv.chosun.com/main.html?gnb_bar" title="TV조선(새창)" target="cs_new" class="site_tvcs">TV조선</a><a href="http://biz.chosun.com/index.html?gnb_bar" title="조선비즈(새창)" target="cs_new" class="site_csbiz">조선비즈</a><a href="http://sports.chosun.com/index.htm?gnb_bar" title="스포츠조선(새창)" target="cs_new" class="site_spocs">스포츠조선</a>		  </div></div>	  </div>	  <a class="site_next browse right" title="다음">다음</a>	  </div><!-- site_scroll_box end -->    </li></ul><!-- csmenu --><!-- 2014 new gnb e --><!-- #e2012 start --><link rel="stylesheet" href="http://news.chosun.com/choice1219/css/choice1219_all_gnb.css"><style type="text/css">div.e2012small { position:absolute; top:100px; left:628px;}</style><div class="e2012small"><a href="http://news.chosun.com/special/issue/choice1219/index.html?gnb_btn" title="조선닷컴 18대 대선"></a></div><!-- #e2012 end --></div>		    <div class="etc_box" style="position:relative;"> 		          <!-- 속보--> 		          <span class="b_news" id="b_news"><b>속보</b><a href="http://news.chosun.com/site/data/html_dir/2015/01/16/2015011601557.html?gnb_sub" onmouseover="stopSokbo()" onmouseout="startSokbo()" onclick="startSokbo()">필리핀 당국, 교황 방문 계기 \'유랑아 청소\' 논란</a></span>		          <span class="db" style="right:213px; top:5px;">		            <a href="http://srchdb1.chosun.com/pdf/i_service/?gnb_sub" target="_blank">지면 보기</a> | 		            <a href="http://db.chosun.com/people/index.html?gnb_sub" target="_blank">인물검색</a> | 		            <a href="http://inside.chosun.com/newsletter_new/Newsletter.html?gnb_sub" target="_blank">뉴스레터신청</a>&nbsp;&nbsp;		            <a href="https://members.chosun.com/service/supp/regist_chosun_choice_prd.jsp" target="_blank" title="구독신청"><img src="http://image.chosun.com/main/201409/cs_top_btn_subscribe.gif" alt="구독신청" style="vertical-align:middle"></a>		          </span>				   <span class="earlyedition" style="display:none; position:absolute;right:3px; top:3px;"><a href="http://early.chosun.com" target="_blank" title="초판서비스"><img src="http://image.chosun.com/cs/201312//earlybtn.gif"></a></span>		 <span style="position:absolute; top:10px; right:158px;"></span> </div>		    <iframe id="info_box" src="http://www.chosun.com/event/GnbIssue/" width="300" height="70" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="프로모션 배너"></iframe>		<!-- 날씨 s -->		<div class="weather_box">	<script type="text/javascript" src="http://news.chosun.com/svc/wsdata/chosunWeather_20110920.js"></script>			<script type="text/javascript" src="http://news.chosun.com/svc/wsdata/weather_pop_20110920.js" charset="euc-kr"></script><style type="text/css">	#weather_pop{z-index:2002; position:absolute; width:502px; height:300px; top:120px; right:0px; background:url("http://image.chosun.com/main/201109/layer_under.png") repeat-x 0 100%;  display:none; font:normal 12px/18px "돋움", "Dotum", "AppleGothic", "Sans-serif";}	#weather_warp{width:502px; height:295px; background:url("http://image.chosun.com/main/201109/weather_back_2.png") no-repeat; margin-top: 5px;}	.wpopClose{position:absolute; bottom:7px; right:1px; z-index:100; cursor:pointer;}	#weekly_w{position:absolute; top:26px; right:16px; width:255px; height:246px; color:#676767; border:solid 3px #f8f8f8; background:url("http://image.chosun.com/main/201109/weekly_back_2.gif") repeat-y; overflow:hidden;}	#weekly_w li{text-align:center;}	#tw_info{width:175px; height:10px; margin-left: 30px; letter-spacing: -1px;}	#ww_info{width:64px;line-height: 13px;margin-left: 10px;}	#today_top{padding-top: 20px; width:230px; text-align:center;}	#today_top dd{margin-top:3px; font:bold 16px/17px "돋움";}	#today_btm {padding:15px 0 0 25px;width:250px; color:#676767;}	#today_btm li {float:left; width:100px; }	.weekly_1{text-align:center; float:left; width:85px; height:120px; }	#set_list{position:absolute; top:66px; left:138px; display:none; background-color:#fff; border:solid 1px #b8b8b8; font:normal 11px/18px "돋움";}	#set_list li:hover{background-color:#f5f5f5; cursor:pointer;}	#set_list ul{margin:2px;}	.date{letter-spacing:-1px;}</style><div id="weather_pop" onmouseover="weather_show();" onmouseout="weather_hide()">	<div id="weather_warp">		<div id="today_w">			<dl id="today_top"><dt class="date">01/16 (금) 오늘 날씨</dt><dd id="tw_dd" name="tw_dd" style="padding-left:40px;">서울 <img src="http://news.chosun.com/test_2010/test/img/set_bt.gif" style="cursor:pointer;" onclick="set_op();"></dd><dd id="tw_dd" name="tw_dd" style="padding:5px 0;"><img src="http://image.chosun.com/weather/img/160120/200.png"></dd><dd id="tw_dd" name="tw_dd">1.1 ℃</dd><dd id="tw_info"><div id="leftCheck">구름많음</div></dd></dl>			<ul id="today_btm"><li>풍향: 서</li><li>풍속: 4.6 ㎧</li><li>습도: 77%</li><li>강수확률: 0.0%</li></ul>		</div>		<div id="weekly_w"><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/17 (토)</li><li><img src="http://image.chosun.com/weather/img/4848/100.png"></li><li class="date">-5/1℃</li><li id="ww_info"><div id="rightCheck">맑음</div></li></ul><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/18 (일)</li><li><img src="http://image.chosun.com/weather/img/4848/118.png"></li><li class="date">-5/3℃</li><li id="ww_info"><div id="rightCheck">흐려져 눈비</div></li></ul><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/19 (월)</li><li><img src="http://image.chosun.com/weather/img/4848/361.png"></li><li class="date">-2/5℃</li><li id="ww_info"><div id="rightCheck">눈 후 갬</div></li></ul><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/20 (화)</li><li><img src="http://image.chosun.com/weather/img/4848/200.png"></li><li class="date">-3/5℃</li><li id="ww_info"><div id="rightCheck">구름많음</div></li></ul><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/21 (수)</li><li><img src="http://image.chosun.com/weather/img/4848/200.png"></li><li class="date">-2/5℃</li><li id="ww_info"><div id="rightCheck">구름많음</div></li></ul><ul class="weekly_1" id="weekly_name" name="weekly_name"><li class="date" style="margin-top:15px;">01/22 (목)</li><li><img src="http://image.chosun.com/weather/img/4848/316.png"></li><li class="date">-2/4℃</li><li id="ww_info"><div id="rightCheck">눈비 후 갬</div></li></ul></div>		<img src="http://news.chosun.com/test_2010/test/img/w_close.gif" onclick="weather_hide()" class="wpopClose" width="14" height="14" alt="X" title="닫기">	</div>	<div id="set_list">		<ul>			<li onclick="localWeather(\'11B10101\'); set_op();">서울/경기</li>			<li onclick="localWeather(\'11D10301\'); set_op();">춘천</li>			<li onclick="localWeather(\'11D20501\'); set_op();">강릉</li>			<li onclick="localWeather(\'11E00101\'); set_op();">울릉도</li>			<li onclick="localWeather(\'11C20401\'); set_op();">대전</li>			<li onclick="localWeather(\'11C10301\'); set_op();">청주</li>			<li onclick="localWeather(\'11H10701\'); set_op();">대구</li>			<li onclick="localWeather(\'11G00201\'); set_op();">제주</li>			<li onclick="localWeather(\'11F20501\'); set_op();">광주</li>			<li onclick="localWeather(\'11F10201\'); set_op();">전주</li>			<li onclick="localWeather(\'11H20201\'); set_op();">부산</li>		</ul>	</div></div>		<span class="weather_date">		2015.01.16(금)		</span> | 		<span id="weather_text"><span>춘천 2.2℃</span></span>		<a href="http://weather.chosun.com/?gnb_sub" title="날씨">		            <span id="weather_info"><img id="weather_view0" style="display: none;" src="http://image.chosun.com/weather/img/3632/200.png"><img id="weather_view1" style="display: block;" src="http://image.chosun.com/weather/img/3632/400.png"><img id="weather_view2" style="display: none;" src="http://image.chosun.com/weather/img/3632/200.png"><img id="weather_view3" style="display: none;" src="http://image.chosun.com/weather/img/3632/400.png"><img id="weather_view4" style="display: none;" src="http://image.chosun.com/weather/img/3632/340.png"><img id="weather_view5" style="display: none;" src="http://image.chosun.com/weather/img/3632/340.png"><img id="weather_view6" style="display: none;" src="http://image.chosun.com/weather/img/3632/200.png"><img id="weather_view7" style="display: none;" src="http://image.chosun.com/weather/img/3632/340.png"><img id="weather_view8" style="display: none;" src="http://image.chosun.com/weather/img/3632/340.png"><img id="weather_view9" style="display: none;" src="http://image.chosun.com/weather/img/3632/200.png"><img id="weather_view10" style="display: none;" src="http://image.chosun.com/weather/img/3632/340.png"><img id="weather_view11" style="display:none" src="http://image.chosun.com/weather/img/3632/200.png"></span>		</a>		   		<script type="text/javascript">weatherLoad();</script>		</div><!-- weather_box -->		<!-- 날씨 e -->		</div>'
			+'</div>'



		},
		defaultAction:function(){},
		getPlusOptions:function(){},
		settingScript:function($frm){},
		setPlusOptions:function($frm){},
		getDynamicOptions:function(){},
		addDynamicNode:function(){},
		modDynamicNode:function($frm, id){},
		deleteDynamicNode:function(id){}

	});

	////////////////////////////////////////////
	var ChosunImage = function(cid) {

		this.cid = cid;
		this.name = 'ChosunImage';
		this.asyncMake = true;
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'텍스트': '',
					'텍스트 위치': ['상단', '하단'],
					'텍스트 겹침' : ['겹침', '안 겹침'],
					'주소': '',
					'이미지를 배경으로': ['설정하지 않음', '설정'],
					'배경 이미지 크기': 'auto',
					'배경 이미지 위치': '0% 0%',
					'배경 이미지 높이': '200px'
				},

				dynamicMeta: {},

				dynamicOptions: {}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				plusOptions: {

					'최대 넓이': {selector: '.imgarea', style: 'max-width'},
					'텍스트': {selector: 'a', action: 'text'},
					'텍스트 위치': {selector: '.imgarea', prop: ['atop ttop', 'under above']},
					'텍스트 겹침' : {selector: '.imgarea', prop: ['overlap', '']},
					'주소': {selector: 'a', action: 'attr', arg: 'href'},
					'이미지를 배경으로': {selector: '.imgarea', prop: ['image-tag', 'image-bg']},
					'배경 이미지 크기': {selector: '.imgarea span', style: 'background-size'},
					'배경 이미지 위치': {selector: '.imgarea span', style: 'background-position'},
					'배경 이미지 높이': {selector: '.imgarea span', style: 'height'}
				},

				plusAction: {

					'텍스트': {selector: 'dt', action: [

						function($selector, options) {

							if (options)
								$selector.removeClass('hidden');

							else
								$selector.addClass('hidden');
						}
					]},

					'텍스트 위치': {selector: 'dl', action: [

						function($selector, options) {

							var $dt = $selector.find('dt');
							$selector.prepend($dt);
						},

						function($selector, options) {

							var $dt = $selector.find('dt');
							$selector.append($dt);
						}
					]},

					'이미지를 배경으로': {selector: '.imgarea', action: [

						function($selector, options) {

							$selector.find('span').hide();
							$selector.find('img').show();
						},

						function($selector, options) {

							$selector.find('img').hide();
							$selector.find('span').css('display', 'block');
						}
					]}
				},

				settingScript: {

					'이미지를 배경으로': {

						'설정': [

							{'배경 이미지 크기': true},
							{'배경 이미지 위치': true},
							{'배경 이미지 높이': true}
						],

						'설정하지 않음': [

							{'배경 이미지 크기': false},
							{'배경 이미지 위치': false},
							{'배경 이미지 높이': false}
						]
					}
				}
			}
		);
	},

	setMaxWidth = function() {

		var $this = $(this);
		$this.closest('.imgarea').css('max-width', $this.width());
	};

	$imageInp = $(parent.document).find('.image-inp'),

	reader = new FileReader();

	$imageInp.change(function() {

		var asyncCom = parent.dpub.ui.asyncComponent;

		if (!asyncCom)
			return;

		asyncCom.makeNode(asyncCom.elem);
		reader.readAsDataURL(this.files[0]);
	});

	$imageInp.click(function() {

    	this.value = null;
    });

	reader.onload = function(event) {

		var $img = $('<img>').attr('src', event.target.result),
			$component = $('#component' + parent.dpub.ui.count),
			$row = $component.closest('.row');

		$component.find('dd').append($img);
		$component.find('span').css('background-image', 'url("' + $img.attr('src') + '")');
		$component.css('max-width', '');

		//$img.one('load', setMaxWidth);
        $img.one('load', function() { calHeight($row); });

		destroySelectable();
        makeSelectable(':not(:has(.row, .component, .com))');
    };

	ChosunImage.prototype = new Component();

	$.extend(ChosunImage.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
				'<button type="button" class="close">X</button>',
				'<div class="imgarea atop ttop image-tag">',
					'<dl>',
						'<dt class="hidden"><a href="#"></a></dt>',
						'<dd><span style="height: 200px"></span></dd>',
					'</dl>',
				'</div>',
				'</div>'

			].join('');
		},

		defaultAction: function() {

		},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		settingScript: function($frm) {

			this.settingScriptByMeta();
			$frm.find('input').click({meta: this.meta.settingScript}, this.settingScriptByMeta);
		},

		setPlusOptions: function($frm) {

			this.setPlusOptionsByMeta();
		},

		getDynamicOptions: function() {},

		addDynamicNode: function() {},

		modDynamicNode: function() {},

		deleteDynamicNode: function(id) {}
	});

	$(document).on('click', '.com .close', function(){

		var $this = $(this),
        $row = $this.closest('.row');

	    $this.closest('.com').remove();
        $this.closest('col-')
	    calHeight($row);
        destroySelectable();
        makeSelectable(':not(:has(.row, .component, .com))');
	});

	window.ChosunImage = ChosunImage;
	window.ChosunComGNB = ChosunComGNB;
	window.ChosunLifeGNB = ChosunLifeGNB;
	window.ChosunFooter = ChosunFooter;
	window.ChosunFrameList = ChosunFrameList;
	window.ChosunGallery = ChosunGallery;
	window.ChosunGNB = ChosunGNB;
	window.ChosunTab = ChosunTab;
	window.ChosunImageSlider = ChosunImageSlider;
	window.Component = Component;

})(window);

(function() {

	var $parent = $(window.parent.document),
		$comAttrPanel = $parent.find('#component-attr-panel'),
		$comImgInp = $parent.find('.component-image-inp'),
		reader = new FileReader(),
		$imageInp;

	$comAttrPanel.on('click', '.image-selection', function() {

		$imageInp = $(this).parent().find('input');

		if (!parent.checkDisabled.call($imageInp.get(0)))
            return false;

        $comImgInp.click();
	});

	$comImgInp.change(function() {

		reader.readAsDataURL(this.files[0]);
	});

	$comImgInp.click(function() {

		this.value = null;
	});

	reader.onload = function(event) {

		$imageInp.val(event.target.result);
	};

})();
