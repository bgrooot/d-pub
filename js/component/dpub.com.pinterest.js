(function(window) {

	var ChosunPinterest = function(cid) {

		this.cid = cid;
		this.name= 'ChosunPinterest';
		this.options = $.extend(

			true,
			{},
			this.options,
			{
				plusOptions: {

				},

				dynamicMeta: {

					pinterest: {

						Count: 15,
						LastNum: 15
					}
				},

				dynamicOptions: {}
			}
		);

		this.meta = $.extend(

			true,
			{},
			this.meta,
			{
				dynamicOptions: {

					'이미지': {selector: '.dynamic img', action: 'attr', arg: 'src'},
					'텍스트': {selector: '.dynamic p', action: 'html'}
				}
			}
		);
	}

	ChosunPinterest.prototype = new Component();

	$.extend(ChosunPinterest.prototype, {

		makeDefaultHtml: function() {

			this.defaultHtml = [

				'<div id="' + this.cid + '" class="com" data-com-type="' + this.name + '">',
				'<button type="button" class="close">X</button>',
				'<div class="pinterest">',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/10/2015021000796_0.jpg">',
						'<p>운해 사이로 솟아 오른 날카로운 봉우리일까. 새벽 높은 산에 올라 담아낸 풍경일까. 대만의 사진가는 북유럽 하늘에서 촬영했다고 설명한다. 이미지에는 역설이 있다. 인공물이 자연의 일부가 되고 자연의 아름다움을 더욱 빛나게 만들 수 있다는 사실을 보여준다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/12/2015021201697_0.jpg">',
						'<p><strong>김우빈,\'조명 때문에 안 보여요\'</strong></p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021100847_1.jpg">',
						'<p>1969년 인류 최초로 달에 착륙한 미국의 우주 비행사 닐 암스트롱이 지구에 돌아올 때 헝겊 가방에 담아 가지고 온 물건들을 미국 국립항공우주박물관이 9일(현지 시각) 공개했다. 사진은 암스트롱이 물품을 담아온 헝겊 가방./AP 뉴시스</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021101000_0.jpg">',
						'<p><strong>시선 교환하는 광대 물고기 ‘니모 ’</strong>흔히 ‘니모’라고 불리는 클라운 피시가 카메라를 바라본다. 사진을 보는 사람은 물고기와 눈을 맞추고 시선을 교환하게 기분이 든다. 입을 열어 인사말을 할 것 같다. 사진은 남태평양 보라보람 섬 바다에서 촬영되었다. 클라운피시는 인도양과 태평양의 따뜻한 바다에 살며 영어 단어 뜻 그래도 번역하면 ‘광대 물고기’이고 우리말로는 ‘흰동가리’이다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021102906_1.jpg">',
						'<p><strong>양식장 줄에 걸린 긴수염고래</strong>지구상에 300마리 정도만 남아 있는 대표적인 멸종위기종인 북태평양 긴수염고래는 몸길이가 17~18m까지 성장하는 대형 종이다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021101000_0.jpg">',
						'<p><strong>시선 교환하는 광대 물고기 ‘니모 ’</strong></p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021102906_1.jpg">',
						'<p>40여년 만에 남해에 멸종위기종인 긴수염고래(Right whale)가 나타났다. 11일 국립수산과학원에 따르면 이날 오전 10시 12분께 경남 남해군 미조리 인근 해역의 홍합 양식장에서 긴수염고래 1마리가 양식장 부이 줄에 걸려 있다는 신고가 접수됐다. 지구상에 300마리 정도만 남아 있는 대표적인 멸종위기종인 북태평양 긴수염고래는 몸길이가 17~18m까지 성장하는 대형 종이다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/12/2015021201697_0.jpg">',
						'<p><strong>김우빈,\'조명 때문에 안 보여요\'</strong></p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/10/2015021000796_0.jpg">',
						'<p>운해 사이로 솟아 오른 날카로운 봉우리일까. 새벽 높은 산에 올라 담아낸 풍경일까. 대만의 사진가는 북유럽 하늘에서 촬영했다고 설명한다. 이미지에는 역설이 있다. 인공물이 자연의 일부가 되고 자연의 아름다움을 더욱 빛나게 만들 수 있다는 사실을 보여준다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021100847_1.jpg">',
						'<p>1969년 인류 최초로 달에 착륙한 미국의 우주 비행사 닐 암스트롱이 지구에 돌아올 때 헝겊 가방에 담아 가지고 온 물건들을 미국 국립항공우주박물관이 9일(현지 시각) 공개했다. 사진은 암스트롱이 물품을 담아온 헝겊 가방./AP 뉴시스</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/12/2015021201697_0.jpg">',
						'<p>12일 오전 서울 압구정 CGV에서 열린 영화 ‘스물’ 제작보고회에서 김우빈이 질문하는 취재진을 바라보고 있다. 배우 김우빈과 강하늘, 2PM 준호가 주연을 맡은 영화 ‘스물’은 자체발광 코미디를 표방하며 실제로도 동갑내기 친구인 대세배우 김우빈, 강하늘, 준호의 남다른 앙상블이 돋보인다. </p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021100847_1.jpg">',
						'<p>1969년 인류 최초로 달에 착륙한 미국의 우주 비행사 닐 암스트롱이 지구에 돌아올 때 헝겊 가방에 담아 가지고 온 물건들을 미국 국립항공우주박물관이 9일(현지 시각) 공개했다. 사진은 암스트롱이 물품을 담아온 헝겊 가방./AP 뉴시스</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021102906_1.jpg">',
						'<p><strong>양식장 줄에 걸린 긴수염고래</strong></p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/10/2015021000796_0.jpg">',
						'<p>운해 사이로 솟아 오른 날카로운 봉우리일까. 새벽 높은 산에 올라 담아낸 풍경일까. 대만의 사진가는 북유럽 하늘에서 촬영했다고 설명한다. 이미지에는 역설이 있다. 인공물이 자연의 일부가 되고 자연의 아름다움을 더욱 빛나게 만들 수 있다는 사실을 보여준다.</p>',
					'</div>',
					'<div class="pin dynamic">',
						'<img src="http://image.chosun.com/sitedata/image/201502/11/2015021101000_0.jpg">',
						'<p>흔히 ‘니모’라고 불리는 클라운 피시가 카메라를 바라본다. 사진을 보는 사람은 물고기와 눈을 맞추고 시선을 교환하게 기분이 든다. 입을 열어 인사말을 할 것 같다. 사진은 남태평양 보라보람 섬 바다에서 촬영되었다. 클라운피시는 인도양과 태평양의 따뜻한 바다에 살며 영어 단어 뜻 그래도 번역하면 ‘광대 물고기’이고 우리말로는 ‘흰동가리’이다.</p>',
					'</div>',
				'</div>',
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

			var $cid = $('#' + this.cid),
				$row = $cid.closest('.row'),
				$pinterList = $cid.find('.dynamic'),
				$newPinter = $pinterList.first().clone();

			$pinterList.last().after($newPinter);

			this.options.dynamicMeta.pinterest.Count++;

			this.getDynamicOptions();
			this.setPlusOptions();
			calHeight($row);
		},
		
		modDynamicNode: function($frm, index) {

			this.modDynamicNodeByMeta($frm, index);				
		},
		
		deleteDynamicNode: function(index) {

			var $cid = $('#' + this.cid),
				$row = $cid.closest('.row');

			$cid.find('.dynamic').eq(index).remove();			

			this.options.dynamicMeta.pinterest.Count--;

			this.getDynamicOptions();
			this.setPlusOptions();
			calHeight($row);
		}		

	});

	window.ChosunPinterest = ChosunPinterest;

})(window);