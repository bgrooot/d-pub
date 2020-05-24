(function(window) {

	var self,
		$parent = $(window.parent.document),
		$comAttrPanel = $parent.find('#component-attr-panel'),
		ChosunRanking = function(cid) {

		self = this;
		this.cid = cid;
		this.name = 'ChosunRanking';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

					'XML': 'http://news.thestoryplus.com/rank/newsstoryplus/index/index.xml',
					'타이틀': '라이프 인기기사',
					'리스트 형태': ['점', '숫자', '텍스트'],
					'아이템 갯수': '5',
					'강조된 아이템 갯수': '3'
					// '리스트 색': '',
					// '강조된 리스트 색': ''
				},

				dynamicMeta: {}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{

				plusOptions: {

					'타이틀': {selector: '.aside-ranking h5', action: 'text'},
					'리스트 형태': {selector: '.aside-ranking span', prop: ['listype_dot', 'listype_num', 'listype_text']},
					'아이템 갯수': {selector: '.aside-ranking', action: 'attr', arg: 'data-item-size'},
					'강조된 아이템 갯수': {selector: '.aside-ranking', action: 'attr', arg: 'data-mark-item-size'}
					// '리스트 색': {selector: '.aside-ranking span', style: 'background'}
					// '강조된 리스트 색': {selector: '': prop: ''}
				},

				plusAction: {

					'XML': {selector: '.aside-ranking', action: [

						function($sel, options)	 {

							if (options)
								// $.get('http://fastdev1.chosun.com:8088/servlet/xmlgetter', {url: options}, render);
								$.get('https://10.1.1.180:1937/xmlgetter.dzo', {url: options}, render);
						}
					]},

					'강조된 아이템 갯수': {selector: '.aside-ranking span', action: [

						markRender
					]}
				},

				settingScript: {

					'리스트 형태': {

						'점': [

							{'강조된 아이템 갯수': false}
						],

						'숫자': [

							{'강조된 아이템 갯수': true}
						],

						'텍스트': [

							{'강조된 아이템 갯수': true}
						]
					}
				}
			}
		);
	},

	render = function(xml) {

		var $cid = $('#' + self.cid),
			$xml = $($.parseXML(xml)),
			$desc = $xml.find('item > description'),
			$link = $xml.find('item > link'),
			$list = $cid.find('ul'),
			count = $cid.find('.aside-ranking').attr('data-item-size'),
			markCount = $cid.find('.aside-ranking').attr('data-mark-item-size'),
			$listStyle = $comAttrPanel.find('[name="리스트 형태"]'),
			rankClassIdx = $listStyle.index($listStyle.filter(':checked')),
			rankClass = self.meta.plusOptions['리스트 형태'].prop[rankClassIdx],
			listTemplate = '<li><span></span><a href=""></a></li>',
			$listTemplate, i;

		$list.empty();

		for (i=0; i<count; i++) {

			$listTemplate = $(listTemplate);
			$listTemplate.find('span').text(i + 1).addClass(rankClass);
			$listTemplate.find('a').text($desc.eq(i).text()).attr('href', $link.eq(i).text());
			$list.append($listTemplate);
		}

		markRender($cid.find('span'), markCount);
		calHeight($cid.closest('.row'));
	},

	markRender = function($sel, options) {

		var i,
			markClass = $sel.hasClass('listype_num') ? 'mark' : 'stress';

		$sel.removeClass('mark stress');

		for (i=0; i<options; i++)
			$sel.eq(i).addClass(markClass);
	};

	ChosunRanking.prototype = new Component();

	$.extend(ChosunRanking.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
				'<button type="button" class="close">X</button>',
				'<div class="aside-ranking" data-item-size="5" data-mark-item-size="3">',
					'<h5>랭킹 제목</h5>',
					'<ul>',
					'<li><span class="listype_dot">1</span><a href="">첫번째 랭킹 제목</a></li>',
					'<li><span class="listype_dot">2</span><a href="">두번째 랭킹 제목</a></li>',
					'<li><span class="listype_dot">3</span><a href="">세번째 랭킹 제목</a></li>',
					'<li><span class="listype_dot">4</span><a href="">네번째 랭킹 제목</a></li>',
					'<li><span class="listype_dot">5</span><a href="">다섯번째 랭킹 제목</a></li>',
					'</ul>',
				'</div>'

			].join('');
		},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		setPlusOptions: function($frm) {

			this.setPlusOptionsByMeta();
		},

		settingScript: function($frm) {

			this.settingScriptByMeta();
			$frm.find('input').click({meta: this.meta.settingScript}, this.settingScriptByMeta);
		}

	});

	window.ChosunRanking = ChosunRanking;

})(window);
