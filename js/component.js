(function() {

	var $document = $(document);

	////////////////GNB///////////////////////
	$document.on('mouseenter', '.gnb a', function() {

		var $this = $(this),
			$gnb = $this.closest('.gnb'),
			color = $gnb.attr('data-hover-text-color'),
			bgColor = $gnb.attr('data-hover-bg-color');

		$this.css({'color': color, 'background-color': bgColor});
	});

	$document.on('mouseleave', '.gnb a', function() {

		var $this = $(this),
			$gnb = $this.closest('.gnb'),
			color = $gnb.attr('data-text-color'),
			bgColor = $gnb.attr('data-bg-color');

		$this.css({'color': color, 'background-color': bgColor});
	});

	////////////////SLIDER///////////////////////
	$document.on('click', '.slider .btn-control a', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),
			$btnList = $com.find('.btn-control a'),
			$sliderList = $com.find('.dynamic'),
			index = $btnList.index(this);

		$btnList.removeClass('active');
		$btnList.eq(index).addClass('active');

		$sliderList.hide();
		$sliderList.eq(index).show();
	});

	$document.on('click', '.prev', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),
			$btnList = $com.find('.btn-control a'),
			$sliderList = $com.find('.dynamic'),
			$activeBtn = $com.find('.btn-control .active'),
			index = $btnList.index($activeBtn) - 1,
			prevIndex = index < 0 ? $btnList.length - 1 : index;

		$btnList.eq(prevIndex).click();
	});
	
	$document.on('click', '.next', function() {
		
		event.preventDefault();

		var $com = $(this).closest('.com'),
			$btnList = $com.find('.btn-control a'),
			$sliderList = $com.find('.dynamic'),
			$activeBtn = $com.find('.btn-control .active'),
			index = $btnList.index($activeBtn) +1,
			nextIndex = index  > $btnList.length - 1 ? 0 : index;

		$btnList.eq(nextIndex).click();
	});

	//////////////////////TAB////////////////////////	
	$document.on('click', '.tabs-navi li', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),
			$navList = $com.find('.tabs-navi li'),
			$panel = $com.find('.tabs-panel'),
			index = $navList.index(this);

		$navList.removeClass('selected');
		$panel.hide();

		$navList.eq(index).addClass('selected');
		$panel.eq(index).show();	
	});

	$document.on('click', '.tabs-img .tabs-navi li', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),
			$imgList = $com.find('.tabs-navi img'),		
			index = $com.find('.tabs-navi li').index(this),
			imgLen = $imgList.length, $img, i;

		for (i=0; i<imgLen; i++) {

			$img = $imgList.eq(i);
			$imgList.eq(i).attr('src', $img.data('off-image'));
		}
		
		$img = $imgList.eq(index);
		$img.attr('src', $img.data('on-image'));
	});

	$document.on('mouseover', '.tabs-img .tabs-navi li', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),			
			$imgList = $com.find('.tabs-navi img'),		
			index = $com.find('.tabs-navi li').index(this),
			$img = $imgList.eq(index);
		
		$img.attr('src', $img.attr('data-hover-image'));
	});

	$document.on('mouseout', '.tabs-img .tabs-navi li', function(event) {

		event.preventDefault();

		var $com = $(this).closest('.com'),
			$navList = $com.find('.tabs-navi li'),
			$imgList = $com.find('.tabs-navi img'),		
			index = $navList.index(this),
			$img = $imgList.eq(index),
			imageOption =  $navList.eq(index).hasClass('selected') ?  $img.attr('data-on-image') : $img.attr('data-off-image');
		
		$img.attr('src', imageOption);
	});

	/////////////////////GALLERY////////////////////////////	
	$document.on('click', '.gallery > ul > li', function() {

		var $com = $(this).closest('.com'),
			$dynamic = $com.find('.dynamic'),
			index = $com.find('li').index(this);

		$dynamic.hide();
		$dynamic.eq(index).show();
	});

})();

/////////////////////////////ComGNB//////////////////////////////
function csmenu_more () {
	var csmenu_more_btn = document.getElementById("cm_more_id");
	var csmenu_more = document.getElementById("csmenu_more_id").style;
	if (csmenu_more.display == "none") {
        csmenu_more.display = "block";
		csmenu_more_btn.className = "cm_more_on";
    } else {
        csmenu_more.display = "none";
		csmenu_more_btn.className = "cm_more";
    }
}

/*기본 검색어값 지워주기*/
function s_clear(){
	document.getElementById('id_searchForm').query.value ="";
}

