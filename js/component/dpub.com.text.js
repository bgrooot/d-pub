(function(window) {

	var $parent = $(window.parent.document),
		$popover = $parent.find('.popover'),
		$popoverBtn = $parent.find('.popover-btn'),
		$alignBtn = $popover.find('.align-btn-group button'),
		iframeOffset = $parent.find('iframe').offset(),
		isOver = false;

	ChosunText = function(cid) {

		this.cid = cid;
		this.name = 'ChosunText';
		this.options = $.extend(

			true,
			{},
			this.options
		);
	},

	showTextarea = function() {

		var $this = $(this),
			$textarea = $this.find('textarea'),
			$row = $this.closest('.row');

		if (!$textarea.hasClass('hidden'))
			return;

		$textarea.removeClass('hidden').focus();
		$this.find('.text').addClass('hidden');

		calHeight($row);
	},

	hideTextarea = function(event) {

		var $this = $(this),		
			$row = $this.closest('.row'),
			text = $this.val().split('\n').join('<br>');	

		if (isOver)
			return;

		$popover.removeClass('show');
		$this.addClass('hidden').focus();
		$this.siblings('.text').removeClass('hidden').html(text);

		calHeight($row);
	},

	keyupTextarea = function() {

		var $this = $(this),
			$textarea = $this.find('textarea'),
			$row = $this.closest('.row');

		$this.css('height', 'auto');
        $this.height(this.scrollHeight);

		calHeight($row);
	},

	showPopup = function() {

		var $this = $(this),
			offset = $this.offset(),
			top = iframeOffset.top + offset.top - 40,
			left = iframeOffset.left + offset.left + ($this.width() / 2  - $popover.width() / 2);

		setPopover();

		$popover.addClass('show');		
		$popover.css({top: top, left: left});
	},

	setPopover = function() {

		var $text = $('.com.ui-selected .text'),
			$colorInp = $popover.find('.color-inp'),
			$btn, cssKey, cssVal, i;

		for (i=0; i<$popoverBtn.length; i++) {

			$btn = $popoverBtn.eq(i);
			cssKey = $btn.data('cssKey');
			cssVal = $btn.data('cssValue');

			if ($text.css(cssKey) === cssVal)
				$btn.addClass('active');

			else
				$btn.removeClass('active');
		}

		$colorInp.val(colorToHex($text.css('color')));
	};

	ChosunText.prototype = new Component();

	$.extend(ChosunText.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="text com" data-com-type="' + this.name + '">',
				'<button type="button" class="close">X</button>',
					'<div class="text">텍스트</div>',
					'<textarea class="hidden">텍스트</textarea>',					
				'</div>'

			].join('');
		},

		defaultAction: function() {

			var $cid = $('#' + this.cid),
				$close = $cid.find('.close'),
				$textarea = $cid.find('textarea');		
			
			$cid.click(showTextarea);
			$textarea.focusout(hideTextarea);
			$textarea.keyup(keyupTextarea);
			$textarea.select(showPopup);	
			$close.click(hideTextarea);
		}
	});

	$popover.mouseover(function() { isOver = true; }).mouseleave(function() { isOver = false; });

	$popover.focusout(function() {

		hideTextarea.call($('.com.ui-selected textarea')[0]);
	});	

	$popover.find('.popover-btn').click(function(event) {

		var $this = $(this),
			cssKey = $this.data('cssKey');
			cssVal = $this.hasClass('active') ? '' : $this.data('cssValue');

		if ($this.parent('.btn-group').hasClass('align-btn-group'))
			$alignBtn.removeClass('active');		

		$('.com.ui-selected .text').css(cssKey, cssVal);
		$('.com.ui-selected textarea').css(cssKey, cssVal);
		$this.toggleClass('active');
	});

	$popover.find('.font-size-btn-group button').click(function(event) {

		var $text = $('.com.ui-selected .text'),
			$textArea = $('.com.ui-selected textarea'),
			$row = $text.closest('.row'),
			fontSize = parseInt($text.css('fontSize').replace('px', ''));

		fontSize = $(this).hasClass('plus-btn') ? fontSize + 2 : fontSize - 2;

		$text.css('fontSize', fontSize);
		$textArea.css('fontSize', fontSize);
		calHeight($row);
	});

	$popover.find('.color-inp').change(function() {

		var color = $(this).val();

		$('.com.ui-selected .text').css('color', color);
		$('.com.ui-selected textarea').css('color', color);
	})

	window.ChosunText = ChosunText;

})(window);