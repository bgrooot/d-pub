(function() {

	var $parent = $(window.parent.document),
		$document = $(document),
        $content = $parent.find('#content'),
		$gridFrame = $parent.find('#grid-frame'),
		$panel = $parent.find('.panel'),
		$mask = $parent.find('#mask'),
		$componentAttrPanel = $parent.find('#component-attr-panel'),
		$comAttr = $parent.find('#com-attr'),
		$comStyleAttr = $parent.find('#com-style-attr'),
		$comSetAttr = $parent.find('#com-setting-attr'),
		$comSetNode = $parent.find('#com-setting-node'),

	prohibitedSelector = ['.resize-bar', '.close'],
	tagItem = '<li><input type="checkbox" checked="checked" class="style-check" /><input type="text" class="style-key" /><input type="text" class="style-val" /></li>',

	isProhibitedSelector = function(selMap, selector) {

		var selLen = selMap.length,
			i;

		for (i=0; i<selLen; i++) {

			if (selector.indexOf(selMap[i]) > -1)
				return true;
		}

		return false;
	},

	cssin = function(a) {

		var sheets = document.styleSheets,
			o = [],
			sheetLen = sheets.length,
			sheet, href, i, r, rules, st;

		a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;

		for (i=0; i<sheetLen; i++) {

			sheet = sheets[i];
			href = sheet.href;

			if (!href || (!href.indexOf('fastdev1') && !href.indexOf('127.0.0.1')))
				continue;

            try {
			    rules = sheet.rules || sheet.cssRules;
            } catch {
                return;
            }

			for (r in rules) {

				st = rules[r].selectorText;

				if (st) {
					st = st.split(':')[0];
                    st = st.split(',')[0];
                }

				if (st) {
					if (a.matches(st))
						o.push(rules[r]);
				}
			}
		}

		return o;
	},

	showComAttrToPanel = function($com) {

		$comAttr.empty();
		getChildren($com, $.extend([], prohibitedSelector));
	},

	showComInlineAttrToPanel = function($com) {

		$comStyleAttr.empty();
		getChildrenInline($com, $.extend([], prohibitedSelector));
	},

	setPlusOptions = function(com, options) {

		var	$com = $('#' + com.id),
			comType = com.name,
    		plusOptions = options,
    		kvTemplate = [

    			'<form id="attr-setting-frm">',
    				'<div id="plus-option">',
    					'<p><b>' + comType + ' 속성</b></p>',
    					'<ul>',
    					'</ul>',
    				'</div>',
    				'<button id="attr-apply-btn">적용</button>',
    			'</form>'

    		].join(''),

    		titleTemplate = '<li><span class="tit_option"></span></li>',
    		inpTemplate = '<span><input /></span>',
    		key, value, type, val, i,
    		$kvTemplate = $(kvTemplate), kvList = $(), kvTitle, kvLine, kvInp, inp;

    	for (key in plusOptions) {

    		value = plusOptions[key];
    		type = typeof value;
    		kvTitle = $(titleTemplate);
    		kvLine = $();

    		switch (type) {

    			case 'string':
    			kvInp = $(inpTemplate);

				if (value.indexOf('rgb') > -1)
					value = colorToHex(value);

    			case 'number':
    			kvInp.find('input').attr({type: 'text', name: key}).val(value);
    			kvLine = kvLine.add(kvInp);
    			break;

    			case 'object':
    			for (i=0; i<value.length; i++) {

    				kvInp = $(inpTemplate);
    				inp = kvInp.find('input');
    				val = value[i];

    				if (val.indexOf(':S') > -1)
    					inp.prop('checked', true);

    				val = val.replace(':S', '');
    				inp.attr({type: 'radio', name: key}).after(val).val(val);
    				kvLine = kvLine.add(kvInp);
    			}

    			break;
    		}

    		kvTitle.find('span').text(key);
    		kvTitle.append(kvLine);
    		kvList = kvList.add(kvTitle);
    	}

    	$kvTemplate.find('ul').append(kvList);
    	$comSetAttr.append($kvTemplate);
	},

	setDynamicOptions = function(com, options) {

		var	$com = $('#' + com.id),
			comType = com.name,
    		dynamicOptions = options,
    		anTemplate = [

    			'<div id="dynamic-option">',
    				'<p><b>추가 속성</b><button id="dynamic-add">추가</button></p>',
    				'<ul>',
    				'</ul>',
    			'</div>'

    		].join(''),

    		titleTemplate = '<p><b></b><button id="dynamic-mod">수정</button><button id="dynamic-delete">삭제</button></p>',
    		inpTemplate = '<li><span class="tit_option"></span><span><input type="text"></span></li>',
    		btnTemplate = '<button class="image-selection">파일선택</button>',
    		$anTemplate = $(anTemplate), anList = $(), anTitle, anInp,
    		key, k, value, val;

    	for (key in dynamicOptions) {

    		value = dynamicOptions[key];

    		anTitle = $(titleTemplate);
    		anTitle.find('b').text(parseInt(key) + 1 + '번째 항목');
    		anTitle.find('button').data('key', key);
    		anList = anList.add(anTitle);

    		for (k in value) {

    			val = value[k];

    			anInp = $(inpTemplate);
    			anInp.find('span').eq(0).text(k);
    			anInp.find('input').attr({id: key, name: k}).val(val);

    			if (k.indexOf('이미지') > -1) {

    				$(btnTemplate).appendTo(anInp);
					anInp.find('input').addClass('imageInp');
				}

    			anList = anList.add(anInp);
    		}
    	}

    	$anTemplate.find('ul').append(anList);
    	$comSetNode.append($anTemplate);
	},

	showComSettingPanel = function($com) {

    	$comSetAttr.empty();
		$comSetNode.empty();

    	if (!$com.hasClass('com'))
    		return;

    	var id = $com.attr('id'),
			comType = $com.data('com-type');

		if (!comType)
			return;

		var com = new window[comType](id),
			options;

		if (!com)
			return;

		parent.dpub.ui.contextComponent = com;
    	options = com.getOptions($com);

    	setPlusOptions(com, options.plusOptions)
    	setDynamicOptions(com, options.dynamicOptions);

    	com.settingScript($parent.find('#attr-setting-frm'));
    },

	getChildren = function($elem, selMap) {

		$elem = $elem.find('*').add($elem);

		var elemLen = $elem.length,
			cnode = '<ul class="selector"><div class="selector-href"></div><div class="selector-text"></div></ul>',
			$cnode, elem, cssSelectors, cssSelectorLen, selector, selectorText, cssText, cssTextLen, attr, i, j, k;

		for (i=0; i<elemLen; i++) {

			elem = $elem[i];

			if (!elem.tagName)
				return;

			cssSelectors = cssin(elem);
            if (!cssSelectors) continue;
			cssSelectorLen = cssSelectors.length;

			for (j=0; j<cssSelectorLen; j++) {

				selector = cssSelectors[j];
				selectorText = $.trim(selector.selectorText);

				if (isProhibitedSelector(selMap, selectorText))
					continue;

				selMap.push(selectorText);

				$cnode = $(cnode);
				$cnode.data('cssRule', selector);
				$cnode.find('.selector-href').text(selector.parentStyleSheet.href);
				$cnode.find('.selector-text').text(selectorText);
				$cnode.appendTo($comAttr);

				cssText = selector.cssText.replace(selectorText, '').replace(/(\{|\})/g, '').split(';');
				cssTextLen = cssText.length;

				for (k=0; k<cssTextLen; k++) {

					attr = $.trim(cssText[k]);

					if (!attr)
						continue;

					if (attr.indexOf('rgb') !== -1)
						attr = rgbAttrToHex(attr);

					$cnode.append('<li data="' + attr + '">' + attr + '</li>');
				}
			}
		}
	},

	getChildrenInline = function($elem, selMap) {

		$elem = $elem.find('*').add($elem);

		var elemLen = $elem.length,
			$el, el, tagName, elemId, elemClass, elemStyleSplit, elemStyleLen, nodeName,
			$tagLine, style, styleSplit, styleKey, styleVal, i, j,

			tagLine = '<ul class="inline"><div class="node-name"></div></ul>',
			tagAttrSet = '<input class="attr-set" type="button" value="style set" />',
			$tagLine, $tagItem;

		for (i=0; i<elemLen; i++) {

			$el = $elem.eq(i);
			el = $elem[i];
			tagName = el.tagName;
			elemId = $el.attr('id') ? '#' + $el.attr('id') : '';
			elemClass = $el.attr('class') ? '.' + $el.attr('class') : '';
			elemStyleSplit = ($el.attr('style') || '').split(';');
			elemStyleLen = elemStyleSplit.length;
			nodeName = tagName + elemId + elemClass;
			$tagLine = $(tagLine);

			if (!tagName || isProhibitedSelector(selMap, nodeName))
				continue;

			$tagLine.find('.node-name').text(nodeName);

			for (j=0; j<elemStyleLen; j++) {

				style = elemStyleSplit[j];
				styleSplit = style.split(':');

				if (styleSplit.length !== 2)
					continue;

				styleKey = styleSplit[0];
				styleVal = styleSplit[1];

				$tagItem = $(tagItem);
				$tagItem.find('.style-key').val(styleKey);
				$tagItem.find('.style-val').val(styleVal);

				$tagLine.append($tagItem);
			}

			$tagLine.data('node', $el);
			$(tagItem).appendTo($tagLine);
			$(tagAttrSet).appendTo($tagLine);
			$tagLine.appendTo($comStyleAttr);
		}
	},

	rgbAttrToHex = function(attr) {

		var attrSplit = attr.split(':');

		return attrSplit[0] + ':' + colorToHex(attrSplit[1]);
	},

	colorToHex = function(color) {

		var digits = /(.*?)rgba?\(([\d.]+), ([\d.]+), ([\d.]+)[, ]*?([\d.]+)?\)/.exec(color);

    	var red = parseInt(digits[2]),
			green = parseInt(digits[3]),
			blue = parseInt(digits[4]),
			rgb = blue | (green << 8) | (red << 16),
			deficientNum, deficientChar = '', i;

		rgb = rgb.toString(16);
		deficientNum = 6 - rgb.length;

		for (i=0; i<deficientNum; i++)
			deficientChar += '0';

		rgb = deficientChar + rgb;

		return digits[1] + '#' + rgb.toUpperCase();
	};

	//$document.on('contextmenu', '.component, .com, [class*="col-"]:not(.init-row, :has(.row, .com, .component))', function(event) {
    $document.on('contextmenu', '.component, .com', function(event) {

		event.preventDefault();

		var $this = $(this);

		$this.mousedown();

		showComAttrToPanel($this);
		showComInlineAttrToPanel($this);
		showComSettingPanel($this);

		$panel.hide();
        $content.removeClass('full');
        $parent.find('.typcn-media-play').removeClass('typcn-media-play').addClass('typcn-media-play-reverse');
		$componentAttrPanel.show();

		parent.setLastClosed();
	});

	$componentAttrPanel.on('click', '#com-attr li', function() {

		var $this = $(this),
			$clicked = $comAttr.find('li.modify'),
			$attrCheck = $('<input type="checkbox" class="attr-check" />'),
			$attrText = $('<input type="text" class="attr-text" />');

		if ($this.children('input').length)
			return;

		$this.empty();
		$clicked.text($clicked.attr('data'));
		$clicked.children().remove();

		$attrText.attr('value', $this.attr('data'));

		if ($this.css('text-decoration') !== 'line-through')
			$attrCheck.attr('checked', 'checked');

		$clicked.removeClass('modify');
		$this.addClass('modify');
		$this.append($attrCheck);
		$this.append($attrText);
		$attrText.focus();
	});

	$componentAttrPanel.on('change', '#com-attr .attr-check', function() {

		var $this = $(this),
			$clicked = $comAttr.find('li.modify'),
			$selector = $($this.closest('.selector').data('cssRule')),
			clickedSplit = $clicked.attr('data').split(':');

		if ($this.prop('checked')) {

			$selector.css(clickedSplit[0], clickedSplit[1]);
			$clicked.css('text-decoration', '');
		}

		else {

			$selector.css(clickedSplit[0], '');
			$clicked.css('text-decoration', 'line-through');
		}
	});

	$componentAttrPanel.on('keypress', '#com-attr .attr-text', function(event) {

		if (event.which === 13) {

			var $this = $(this),
				$clicked = $comAttr.find('li.modify'),
				$clickedInput = $clicked.find('.attr-text'),
				$selector = $($this.closest('.selector').data('cssRule')),
				clickedVal = $clickedInput.val(),
				clickedSplit = clickedVal.split(':');

			$clicked.text(clickedVal);
			$clicked.attr('data', clickedVal);
			$selector.css(clickedSplit[0], clickedSplit[1]);
		}
	});

	$componentAttrPanel.on('click', '#com-style-attr .attr-set', function() {

		var $this = $(this),
			$styleList = $this.closest('.inline'),
			$elem = $styleList.data('node'),
			$styleItem = $styleList.find('li'),
			$lastItem = $styleList.find('li.last'),
			styleItemLen = $styleItem.length,
			isSet = true,
			item, styleKey, styleVal, setStyle = '', i;

		for (i=0; i<styleItemLen; i++) {

			item = $styleItem.eq(i);
			styleKey = item.find('.style-key').val();
			styleVal = item.find('.style-val').val();

			if (item.find('.style-check').prop('checked')) {

				if (styleKey && styleVal)
					setStyle = setStyle + styleKey + ': ' + styleVal + ';';
			}

			if (!styleKey || !styleVal)
				isSet = false;
		}

		$elem.attr('style', setStyle);

		if (isSet) {

			$comStyleAttr.find('.last').removeClass('last');
			$this.before($(tagItem).addClass('last'));
		}
	});

	$componentAttrPanel.on('mouseover', '#com-style-attr .node-name', function() {

		var $this = $(this),
			$elem = $this.parent().data('node'),
			parentOffset = $gridFrame.offset(),
			elemOffset = $elem.offset();

		$mask.css({

			width: $elem.width(),
			height: $elem.height(),
			top: parentOffset.top + elemOffset.top,
			left: parentOffset.left + elemOffset.left
		});

		$mask.show();
	});

	$componentAttrPanel.on('mouseout', '#com-style-attr .node-name', function() {

		$mask.hide();
	});

	$comSetAttr.on('click', '#attr-apply-btn', function(event) {

		event.preventDefault();

		var component = parent.dpub.ui.contextComponent;
		component.applySettings($parent.find('#attr-setting-frm'));
	});

	$comSetNode.on('click', '#dynamic-add', function() {

		var component = parent.dpub.ui.contextComponent;

		component.addDynamicNode();
		showComSettingPanel($('#' + component.cid));
	});

	$comSetNode.on('click', '#dynamic-mod', function() {

		var component = parent.dpub.ui.contextComponent;

		component.modDynamicNode($parent.find('#dynamic-option'), $(this).data('key'));
		component.applySettings($parent.find('#attr-setting-frm'));
		showComSettingPanel($('#' + component.cid));
	});

	$comSetNode.on('click', '#dynamic-delete', function() {

		var component = parent.dpub.ui.contextComponent;

		component.deleteDynamicNode($(this).data('key'));
		showComSettingPanel($('#' + component.cid));
	});

	window.colorToHex = colorToHex;

})(window);
