(function(window) {

	var ChosunParallax = function(cid) {

		this.cid = cid;
		this.name = 'ChosunParallax';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

				},

				dynamicMeta: {

					parallax: {

						Count: 4,
						LastNum: 4 
					}
				}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				dynamicOptions: {

					'배경 이미지': {selector: '.dynamic', action: 'css', arg: 'background-image'},
					'최소 높이': {selector: '.dynamic', action: 'css', arg: 'min-height'}
				}
			}
		);
	};

	ChosunParallax.prototype = new Component();

	$.extend(ChosunParallax.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
				'<button type="button" class="close">X</button>',
				'<section id="area01" class="content dynamic" style="min-height:500px;background-image:url(img/bg-parallaxsample06.jpg);">',
					'<article style="margin-top:30px;">',
						'<img src="http://image.chosun.com/thestoryplus/resources/images/palace3/pa3_top_tit.png">',
						'<p>혹시 궁궐을 고리타분하고 재미없는 곳이라고 생각하지는 않았나? 그렇다면 그건 정말 큰 오산이다. <br> 그 동안 궁궐에 대해 가졌던 이미지, 선입견은 모두 버려라. <br> 궁궐은 그대가 생각하는 것보다 훨씬 더 볼거리, 놀 거리가 많은 곳이다. <br> 지금부터 그 어떤 곳보다도 더 신나고, 새롭게 궁궐을 즐길 수 있는 \'꿀팁\'을 소개한다. <br> 궁궐이 가진 무궁무진한 매력 속으로 고고! </p>',
					'</article>',					
				'</section>',
				'<section id="area02" class="content dynamic" style="min-height:800px;background-image:url(img/bg-parallaxsample09.jpg);">',
					'<article>',
						'<h2>넌 밤에 보면 더 이뻐!! 정말??</h2>',
					'</article>',
				'</section>',
				'<section id="area03" class="content dynamic" style="background-image:url(img/bg-parallaxsample05.jpg);">',
					'<article>',
							'<div style="position:relative;">',
							'<h2 style="color:#333;">내 스타일에 맞는 궁궐찾기</h2>',
							'<p>껌 하나를 고를 때도 심사숙고하는 그대, <br> 패키지여행보다는 자유여행을 선호하는 그대, <br> 남들과 다른 자신만의 스타일이 뚜렷한<br> 그대들을 위해 준비했습니다!</p>',
							'</div>',
							'<span style="margin-bottom:1em; background:rgba(51, 51, 51, 0.5);padding:2em 2em"><img src="http://image.chosun.com/thestoryplus/resources/images/palace3/pa3_find_pan.png" alt=""></span>',
					'</article>',
				'</section>',
				'<section id="area00" class="content dynamic" style="background-image:url(http://image.chosun.com/thestoryplus/resources/images/palace1/footer_pager_bg.png);">',
					'<article>',
					'<span style="margin:0 auto"><img src="http://image.chosun.com/storyplus/img_dir/201501/20150126212510.png" alt="궁궐, 어디까지 가봤니?"><span>',
					'<article>',
				'</section>',
				'</div>'

			].join('');
		},

		getPlusOptions: function() {

			this.getPlusOptionsByMeta();
		},

		setPlusOptions: function() {

			this.setPlusOptionsByMeta();					
		},

		getDynamicOptions: function() {

			this.getDynamicOptionsByMeta();
		},

		addDynamicNode: function() {

			// var $cid = $('#' + this.cid),
			// 	$row = $cid.closest('.row'),
			// 	$pinterList = $cid.find('.dynamic'),
			// 	$newPinter = $pinterList.first().clone();

			// $pinterList.last().after($newPinter);

			// this.options.dynamicMeta.pinterest.Count++;

			// this.getDynamicOptions();
			// this.setPlusOptions();
			// calHeight($row);
		},
		
		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);				
		},
		
		deleteDynamicNode: function(index) {

			// var $cid = $('#' + this.cid),
			// 	$row = $cid.closest('.row');

			// $cid.find('.dynamic').eq(index).remove();			

			// this.options.dynamicMeta.pinterest.Count--;

			// this.getDynamicOptions();
			// this.setPlusOptions();
			// calHeight($row);
		}		

	});

	window.ChosunParallax = ChosunParallax;

})(window);