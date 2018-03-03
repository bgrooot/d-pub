//search
(function() {

    var $document = $(document),                
        $panel = $('.panel'),
        $searchPanel = $('#search-panel'),
        $seachForm = $('[role="search"]'),        
        $searchInp = $seachForm.find('input'),
        $videoPanel = $('#video-panel'),
        $videoForm = $videoPanel.find('[role="search"]'),
        $videoInp = $videoForm.find('input'),
        $imagePanel = $('#image-panel'),
        $imageForm = $imagePanel.find('[role="search"]'),
        $imageInp = $imageForm.find('input'),
        $articlePanel = $('#article-panel'),
        $articleList = $('#article-list'),
        $mediaList = $('#media-list'),
        $imageList = $('#image-list'),
        $videoList = $('#video-list'),
        $articleTabNav = $('#article-tab-nav'),
        $searchTabNav = $('#search-tab-nav'),
        $keywordSearch = $('#keyword-search'),
        $idSearch = $('#id-search'),
        $div = $('<div>'),
        
        artTitle, searchId, articleId,
        searchItemTemplate = '<li class="page"><a href="#"></a></li>',
        tabTemplate = '<li role="presentation"><a role="tab" data-toggle="tab"><button type="button" class="close">x</button></a></li>',
        tabPaneTemplate = '<div class="tab-pane" role="tabpanel">',
        articleTemplate = $('#article-template').html(),
        mediaTemplate = $('#media-template').html(),
        videoTemplate = $('#video-template').html(),
        imageTemplate = $('#image-template').html(),
        searchURL = 'http://search.chosun.com/openAPI/news.search',
        // searchURL = 'http://search.chosun.com/openAPI/newsinfo.search',
        imageSearchURL = 'http://search.chosun.com/openAPI/image.search',
        searchParam = {

             //search only chosun.com on PILOT VER
            // sTarget: 'chosun',
            target: 'D',
            site: 'thestoryplus',
            // sTarget: 'chosun',
            target: 'D',
            // site: 'thestoryplus',
            site: 'tongplus',
            hitsPerPage: 5,
            returnType: 'json',
            callback: 'callFunction'
        },

        imageParam = {

            hitsPerPage: 5
        },

        videoParam = {
               
            part: 'snippet',
            fields: 'nextPageToken,prevPageToken,items(id(videoId),snippet(title))',
            safeSearch: 'none',
            type: 'video'
        },

    getDomain = function(URL) {

        var deparam = dzo.deparam(URL);

        if (deparam.sname)
            return deparam.sname;

        else {

            if (URL.indexOf('chosun.com') > -1)
                return URL.split('.chosun.com')[0].split('http://').pop();

            else
                return URL.split('.com')[0].split('http://').pop();            
        }
    },

    getID = function(URL) {

        var id = URL.split('/').pop().split('.html')[0];

        if (!$.isNumeric(id))
            id = URL.split('contid=').pop();

        return id;
    },

    setPagination = function($searchPage, data) {

         var $prev = $searchPage.find('.prev'),
            $next = $searchPage.find('.next'),
            pageCnt = dpub.search.pageCnt,
            hitsTotal = data.hitsTotal - 1,
            pageOffset = Math.floor(data.offset / pageCnt),            
            maxPage = Math.floor(hitsTotal / data.hitsPerPage),
            startPage = Math.floor(pageOffset / pageCnt) * pageCnt,
            endPage = Math.min(startPage + pageCnt - 1, maxPage),
            items = $(), item, val;

        for (var i=startPage; i<=endPage; i++) {

            val = i + 1;

            item = $(searchItemTemplate);
            item.find('a').text(val);

            if (i === pageOffset)
                item.addClass('active');

            items = items.add(item);
        }

        if (pageOffset < pageCnt)
            $prev.addClass('disabled');

        if (pageOffset >= Math.floor(maxPage / pageCnt) * pageCnt)
            $next.addClass('disabled');

        $searchPage.find('.page').remove();
        $next.before(items);
        $searchPage.show();
    },

    setVideoPagination = function(data) {

        if (data.prevPageToken)
            $videoPanel.find('.prv').removeClass('disabled');

        if (data.nextPageToken)
            $videoPanel.find('.nxt').removeClass('disabled');
    },

    arrangeData = function(data) {

        var item = data.item,
            itemLen = item.length;

        for (var i=0; i<itemLen; i++) {

            item[i].title = $div.html(item[i].title).text();
            item[i].body = $div.html(item[i].body).text();
            item[i].hasThumb = item[i].timg ? true : false;
            item[i].articleId = getID(item[i].url);
            item[i].articleDomain = getDomain(item[i].url);
        }

        return data;
    },

    loadList = function(offset) {

        var val = $searchInp.val(),
            searchQuery = searchURL,
            art;

        if (offset)
            searchParam.offset = offset;
        else 
            searchParam.offset = 0;

        searchParam.sQuery = val;
        searchQuery = searchQuery + '?' + $.param(searchParam);

        if ($keywordSearch.prop('checked')) 
            $.getJSON('http://fastdev1.chosun.com:8088/servlet/xmlgetter', {url: searchQuery}, renderList);   
            // $.getJSON('https://10.1.1.180:1937/xmlgetter.dzo', {url: searchQuery}, renderList);

        else if ($idSearch.prop('checked')) {           

            art = dzo.article({

                domain: 'news',
                id: val
            });

            dzo('').render(art);
            $document.one('articleRenderComplete', {art: art}, renderById);
        }       
    },

    loadImageList = function(offset) {

        var val = $imageInp.val(),
            imageQuery = imageSearchURL;

        if (offset)
            imageParam.offset = offset;
        else 
            imageParam.offset = 0;

        imageParam.sQuery = val;
        imageQuery = imageQuery + '?' + $.param(imageParam);

        $.getJSON('http://fastdev1.chosun.com:8088/servlet/xmlgetter', {url: imageQuery}, renderImageList);
        // $.getJSON('https://10.1.1.180:1937/xmlgetter.dzo', {url: imageQuery}, renderImageList);
    },

    renderList = function(data, flag) {

        var ardData = arrangeData(data.results[0] || data.results),
            mediaTPL = Hogan.compile(mediaTemplate),
            mediaHTML = mediaTPL.render(ardData);

        $mediaList.find('.active.tab-pane').html(mediaHTML);

        if (flag !== 'byid')
            setPagination($mediaList.find('.active.tab-pane .search-page'), ardData);
    },

    renderById = function(event) {

        var art = event.data.art,
            data = {results:[{item:[]}]}, 
            item = {},           

        image = function() {

            var image = art.article.paragraph_image,
                imageLen = image.length,
                img;

            for (var i=0; i<imageLen; i++) {

                img = image[i];

                if (img.length)
                    return img;
            }

            return '';
        }();

        item.title = art.article.title;
        item.body = art.article.paragraph_text[0].substring(0, 120) + '…';
        item.timg = image;
        item.url = art.xmlUrl;

        data.results[0].item[0] = item;
        renderList(data, 'byid');
    },

    renderImageList = function(data) {

        var imageTPL = Hogan.compile(imageTemplate),
            imageHTML = imageTPL.render(data.results);

        $imageList.html(imageHTML);
        setPagination($imageList.find('.search-page'), data.results);
    },

    renderVideoList = function(data) {

        var videoTPL = Hogan.compile(videoTemplate),
            videoHTML = videoTPL.render(data);           

        $videoList.html(videoHTML);
        setVideoPagination(data);

        var $video = $videoList.find('iframe'),
            videoLen = $video.length,
            i;

        $video.css('width', document.body.clientWidth * 0.15);

        for (i=0; i<videoLen; i++)
            new YT.Player($video.eq(i).attr('id'), {events: {onStateChange: onStateChange}});        
    },

    tabClose = function() {

        var $this = $(this),
            $nav = $this.closest('[role="tablist"]'),
            $tabItem = $this.closest('li'),
            tabId = $tabItem.find('a').attr('href');

        $(tabId).remove();
        $tabItem.remove();
        $nav.find('a').last().tab('show');
    },

    onStateChange = function(event) {

        var iframe = event.target.getIframe(),
            $video = $(iframe).closest('.video');

        if (event.data === 1 || event.data === 3) {

            $video.addClass('active clicked');
            $videoList.find('.active').not($video).removeClass('active clicked');
        }
    };

    $seachForm.submit(function(event) {

        event.preventDefault();

        var val = $searchInp.val(),
            searchId;

        if (!val)
            return;

        dpub.search.count++;
        searchId = 'search-' + dpub.search.count;
        $(tabPaneTemplate).attr('id', searchId).appendTo($mediaList);
        $(tabTemplate).appendTo($searchTabNav).find('a').attr('href', '#' + searchId).prepend(val).tab('show');

        loadList();
    });

    $videoForm.submit(function(event) {

        event.preventDefault();

        var val = $videoInp.val(),
            request;

        if (!val)
            return;

        request = gapi.client.youtube.search.list($.extend(videoParam, {q: val}));
        request.execute(renderVideoList);
    });

    $imageForm.submit(function(event) {

        event.preventDefault();

        var val = $imageInp.val();

        if (!val)
            return;

        loadImageList();
    });

    $mediaList.on('click', '.media', function(event) {      

        event.preventDefault();

        var $this = $(this);  

        artTitle = $this.find('h4').text().substring(0, 8) + '…';         

        art = dzo.article({

            domain: $this.data('articleDomain'),
            id: $this.data('articleId') 
        });

        dpub.article.count++;
        articleId = 'article-' + dpub.article.count;              
        $(tabPaneTemplate).addClass('article').attr('id', articleId).appendTo($articleList).html(articleTemplate);
       
        dzo(articleId).render(art);
    });

    $articleTabNav.on('click', '.close', tabClose);
    
    $searchTabNav.on('click', '.close', tabClose);

    $panel.on('click', '.search-page li', function(event) {

        event.preventDefault();

        var $this = $(this),
            $panel = $this.closest('.panel'),
            panelId = $panel.attr('id'),
            val = $panel.find('.form-control').val(),
            text = $this.text() - 1,
            pageCnt = dpub.search.pageCnt,
            pageOffset = $this.parent().find('.active').text() - 1,
            nextPageOffset = pageOffset;

        if (!val)
            return;

        if ($.isNumeric(text))
            nextPageOffset = text;

        else if (!$this.hasClass('disabled')) {

            if ($this.hasClass('next'))
                nextPageOffset = Math.floor((pageOffset + pageCnt) / pageCnt) * 5;

            else
                nextPageOffset = Math.floor((pageOffset - pageCnt) / pageCnt) * 5;
        }

        if (pageOffset !== nextPageOffset) {

            switch (panelId) {

                case 'article-panel':               
                loadList(nextPageOffset * 5);        
                break;

                case 'image-panel':
                loadImageList(nextPageOffset * 5);
            }            
        }
    });

    $videoList.on('click', 'nav li', function(event) {

        event.preventDefault();

        if (!checkDisabled.call(this))
            return false;      

        var $this = $(this),
            token = $this.data('token');

        request = gapi.client.youtube.search.list($.extend({}, videoParam, {pageToken: token}));
        request.execute(renderVideoList);       
    });

    $videoList.on('click', '.video', function(event) {

        event.preventDefault();

        var $this = $(this);

        $this.toggleClass('clicked');

        if (!$this.hasClass('clicked'))
            $this.removeClass('active');

        else
            $this.addClass('active');

        $panel.find('.clicked').not(this).removeClass('active clicked');

    }).on('mouseenter', '.video', function() {

        var $this = $(this);

        if (!$this.hasClass('clicked'))
            $this.addClass('active');

    }).on('mouseleave', '.video', function() {

        var $this = $(this);

        if (!$this.hasClass('clicked'))
            $this.removeClass('active');
    });

    $document.on('articleLoadComplete', function(event, art) {

        if (art.xml) {

            var articleId = 'article-' + dpub.article.count;

            $articlePanel.show();
            $searchPanel.hide();           
            setLastClosed();
            $(tabTemplate).appendTo($articleTabNav).find('a').attr('href', '#' + articleId).prepend(artTitle).tab('show');

            dzo.relatedArtId = art.xml.find('relatedDataId').text();
            if (dzo.relatedArtId && dzo.relatedArticle) {

                var relatedArt = dzo.relatedArticle({id: dzo.relatedArtId, domain: dzo.domain}),
                    relatedElem = $('[data-dzo="relatedList"]');

                dzo(relatedElem).render(relatedArt);
            }
        }

        else {

            alert('XML 형식이 유효하지 않습니다.');
        }
    });

})();