var dpub = {

    lastClosed: 'component-attr-panel',
    device: ['xs', 'sm', 'md'],
    grid: {device: 'md', initRow: null, initCol: null, frame: null},
    article: {count: 0},
    search: {count: 0, pageCnt: 5},
    ui: {count: 0}
};

window.dpub = dpub;
//ui
(function() {

    var gridFrame = document.getElementById('grid-frame'),
        $document = $(document),
        $window = $(window),
        $panel = $('.panel'),
        $gridPanel = $('#grid-panel'),
        $searchPanel = $('#search-panel'),
        $articlePanel = $('#article-panel'),

        headerHeight = parseInt($('.navbar').css('height').split('px')[0]),

    gapiInit = function() {

        gapi.client.setApiKey('');
        gapi.client.load('youtube', 'v3');
    },

    resizeGrid = function() {

        dpub.grid.width = $gridPanel.width();
        dpub.grid.height = $gridPanel.height();

        var text = dpub.grid.initCol.children('h1'),
            fontsize;

        if (!text.length)
            return;

        fontsize = text.css('fontSize').split('px')[0];
        // text.css('margin-top', dpub.grid.height / 2 - fontsize / 2 + 'px');
    },

    gridReady = function() {

        dpub.grid.frame = $(gridFrame.contentWindow.document.body);
        dpub.grid.initRow = dpub.grid.frame.find('.init-row');
        dpub.grid.initCol = dpub.grid.frame.find('.init-col');

        dpub.grid.resizeGrid();
    };

    $document.on('articleRenderComplete', function() {

        var articleId = '#article-' + dpub.article.count,
            $article = $(articleId),
            $media = $article.find('.cs_video iframe'),
            $mediaLayer = $media.closest('.cs_video').find('.media-layer');

        $article.css('display', '');
        $mediaLayer.width($media.width()).height($media.height());
        $('.left_img, .right_img').removeClass('left_img right_img').addClass('center_img');
    });

    $panel.on('click', '.movable', function(event) {

        event.preventDefault();

        var $this = $(this);

        $this.toggleClass('clicked');

        if (!$this.hasClass('clicked'))
            $this.removeClass('active');

        else
            $this.addClass('active');

        $panel.find('.clicked').not(this).removeClass('active clicked');

    }).on('mouseenter', '.movable', function() {

        var $this = $(this);

        if (!$this.hasClass('clicked'))
            $this.addClass('active');

    }).on('mouseleave', '.movable', function() {

        var $this = $(this);

        if (!$this.hasClass('clicked'))
            $this.removeClass('active');
    });

    dpub.grid.resizeGrid = resizeGrid;

    $window.resize(dpub.grid.resizeGrid);

    gridReady();

    $(gridFrame).load(gridReady);

    // $searchPanel.show();

    window.gapiInit = gapiInit;
    window.gridReady = gridReady;

})();

//menu-ui
(function() {

    var gridFrame = document.getElementById('grid-frame'),
        $content = $('#content'),
        $panel = $('.panel'),
        $gridPanel = $('#grid-panel'),
        $articlePanel = $('#article-panel'),
        $searchPanel = $('#search-panel'),
        $searchInp = $searchPanel.find('.form-control'),
        $videoPanel = $('#video-panel'),
        $videoSearchInp = $videoPanel.find('.form-control'),
        $imagePanel = $('#image-panel'),
        $imageSearchInp = $imagePanel.find('.form-control'),
        $modal = $('.modal'),
        $gridSetting = $('.grid-setting'),
        $gridImportInp = $('.import-grid-inp'),
        $gridWidthInp = $('#width-inp'),
        $gridRwdInp = $('#rwd-inp'),
        $fileInp = $('#file-inp'),
        $sidemenuIcon = $('.typcn-media-play'),
        $imgInp = $('.image-inp'),
        $deviceBtn = $('#device-btn .typcn'),
        $targetRow,

    reader = new FileReader(),
    gridWidth,

    setCollapsedHeight = function() {

        var deviceIdx = dpub.device.indexOf(dpub.grid.device),
            $collapsed = dpub.grid.initCol.find('[class*="col-"]'),
            $row, $cols, $col, colLen, collapsedLen, i, j;

        for (i=deviceIdx; i>=0; i--)
            $collapsed = $collapsed.not('[class*="' + dpub.device[i] + '"]');

        // $collapsed = $collapsed.parent().not('.collapsed');
        $collapsed = $collapsed.parent();
        $collapsed = $.unique($collapsed);
        collapsedLen = $collapsed.length;

        for (i=collapsedLen-1; i>=0; i--) {

            $row = $collapsed.eq(i);
            $cols = $row.children();
            colLen = $cols.length;

            for (j=0; j<colLen; j++) {

                $col = $cols.eq(j);

                if (!$col.children('.component, .row, .com').length)
                    $col.css('height', 100 / colLen + '%');
            }

            $row.addClass('collapsed');

            setTimeout(function($row) {

                gridFrame.contentWindow.calHeight($row);

            }, 1, $row);
        }
    },

    setNotCollapsedHeight = function() {

        var deviceIdx = dpub.device.indexOf(dpub.grid.device),
            $notCollapsed = $(), $row, notCollapsedLen, i;

        for (i=deviceIdx; i>=0; i--)
            $notCollapsed = $notCollapsed.add(dpub.grid.initCol.find('[class*="col-' + dpub.device[i] + '"]'));

        $notCollapsed = $notCollapsed.parent('.collapsed');
        $notCollapsed.removeClass('collapsed');
        notCollapsedLen = $notCollapsed.length;

        for (i=notCollapsedLen-1; i>=0; i--) {

            $row = $notCollapsed.eq(i);
            gridFrame.contentWindow.calUp($row);
        }

        gridFrame.contentWindow.calDown();
    },

    checkDisabled = function() {

        var $this = $(this);

        if ($this.hasClass('disabled') || $this.prop('disabled'))
            return false;

        else
            return true;
    },

    setLastClosed = function() {

        var $visiblePanel = $panel.filter(':visible');
        dpub.lastClosed = $visiblePanel.attr('id');
    },

    runCalHeight = function() {

        gridFrame.contentWindow.calHeight($targetRow);
    };

    $('.com-menu').click(function(event) {

        if (!checkDisabled.call(this))
            return false;

        event.preventDefault();

        var componentName = $(this).attr('component-name'),
            componentId = 'component' + (dpub.ui.count + 1),
            com = new gridFrame.contentWindow[componentName](componentId),
            $selected = dpub.grid.frame.find('.ui-selected'),
            $col = $selected.closest('[class*="col-"]'),
            $row = $selected.closest('.row'),
            $com;

        $targetRow = $row;
        $row.removeClass('empty');
        $selected.removeClass('ui-selected');

        if (com.asyncMake) {

            com.elem = $col;
            dpub.ui.asyncComponent = com;
        }

        else {

            $com = com.makeNode($col);
            $com.find('img').one('load', function() {
                runCalHeight();
            });
        }

        dpub.ui.count++;

        runCalHeight();
        gridFrame.contentWindow.destroySelectable();
        gridFrame.contentWindow.makeSelectable(':not(:has(.row, .component, .com))');
    });

    $('[component-name="ChosunImage"]').click(function() {

        if (!checkDisabled.call(this))
            return false;

        $imgInp.click();
    });

    $('.device-menu').on('click', 'a', function(event) {

        event.preventDefault();

        var $this = $(this),
            device = $this.data('device'),
            fontClass = $this.children('.typcn').attr('class'),
            size = $gridWidthInp.val()|| $this.data('size');

        dpub.grid.frame.removeClass(dpub.grid.device);
        dpub.grid.frame.addClass(device);

        dpub.grid.device = $this.data('device');

        $deviceBtn.attr('class', fontClass + ' no-font-size');

        size = size ? size : '';
        $gridPanel.width(size);

        if (!dpub.grid.initCol.children('.row').length || !$gridRwdInp.prop('checked'))
            return;

        setCollapsedHeight();
        setNotCollapsedHeight();
        gridFrame.contentWindow.calResize();
        dpub.grid.resizeGrid();
    });

    $('#sidemenu-btn').click(function() {

        $panel.hide();

        if ($content.hasClass('full'))
            $('#' + dpub.lastClosed).show();

        $content.toggleClass('full');
        $sidemenuIcon.toggleClass('typcn-media-play');
        $sidemenuIcon.toggleClass('typcn-media-play-reverse');

        dpub.grid.initRow.find('.row:not(:has(.row))').each(function(index, elem) {
            gridFrame.contentWindow.calHeight($(elem));
        })
    });

    $('#save-btn').click(function(event) {

        event.preventDefault();

        var zip = new JSZip(),
            $html = $(dpub.grid.initRow.html()),
            files = window.files.slice(0),
            layout = files.shift().result,
            fileLen = files.length, i;

        $html.find('.close').remove();
        $html.find('.resize-bar').remove();
        $html.find('.row').height('');
        $html.find('.row').removeClass('ui-selectee ui-selected');

        for (i=0; i<fileLen; i++)
            zip.file(files[i].target, files[i].result);

        // zip.folder('js').file('component.js', componentScript);
        // zip.folder('css').file('component.css', componentCss);
        // img.file('img/example-slide-1.jpg', , {base64: true});

        zip.file('d-pub.html', layout.replace('<!--insert-->', $html.html()));
        saveAs(zip.generate({type: 'blob'}), 'd-pub.zip');
    });

    $('#search-btn').click(function(event) {

        event.preventDefault();

        $panel.hide();
        $searchPanel.show();
        $searchInp.focus();

        setLastClosed();
    });

    $('#image-btn').click(function(event) {

        event.preventDefault();

        $panel.hide();
        $imagePanel.show();
        $imageSearchInp.focus();

        setLastClosed();
    });

    $('#video-btn').click(function(event) {

        event.preventDefault();

        $panel.hide();
        $videoPanel.show();
        $videoSearchInp.focus();

        setLastClosed();
    });

    $('.back-btn').click(function(event) {

        event.preventDefault();

        $articlePanel.hide();
        $searchPanel.show();

        setLastClosed();
    });

    /*
    $('.downloadify').downloadify({

        filename: 'layout.grid',

        data: function() {

            var $html = dpub.grid.initCol.clone();

            // $html.find('.com').remove();
            // $html.find('.component').remove();
            $html.find('.ui-selected').removeClass('ui-selected');

            return $html.html();
        },

        downloadImage: 'img/grid.png',
        width: '158',
        height: '31'
    });
    */

    $('.import-grid').click(function(event) {

        event.preventDefault();

        $gridImportInp.click();
    });

    $gridImportInp.click(function() {

        this.value = null;
    });

    reader.onload = function(event) {

        dpub.grid.initCol.removeClass('ui-selected');
        dpub.grid.initCol.html(event.target.result);

        gridFrame.contentWindow.destroySelectable();
        gridFrame.contentWindow.makeSelectable(':not(:has(.row, .component, .com))');
        dpub.grid.frame.find('[class*="col-"]:not(:has(.row))').sortable({ items: '>.component, >.com', scroll: false });
        gridFrame.contentWindow.calResize();
    };

    $gridImportInp.change(function() { reader.readAsText(this.files[0]); });

    $('#grid-setting-btn').click(function() {

        var width = $gridWidthInp.val(),
            width = width || $('[data-device="' + dpub.grid.device + '"]').data('size');

        $gridPanel.css('width', width);
        dpub.grid.width = width;

        $gridSetting.addClass('disabled');

        if (!$gridRwdInp.prop('checked')) {
            dpub.grid.frame.addClass('no-rwd');
        } else {
            dpub.grid.frame.removeClass('no-rwd');
        }
    });

    $('#grid-save-btn').click(function() {
        var fileName = $fileInp.val(),
            html, blob;

        if (fileName) {
            $html = dpub.grid.initCol.clone();
            $html.find('.ui-selected').removeClass('ui-selected');
            blob = new Blob([$.trim($html.html())], {type: 'text/plain;charset=utf-8'});
            saveAs(blob, fileName + '.grid');
        }
    });

    $('.modal .btn').click(function() { $modal.modal('hide'); });

    window.checkDisabled = checkDisabled;
    window.setLastClosed = setLastClosed;

})();

//file-loader
(function() {

    var files = [

            {target: 'layout.html'},
            {target: 'js/component.js'},
            {target: 'css/component.css'},
            {target: 'css/bootstrap.min.css'},
            {target: 'css/article.css'},
            {target: 'img/example-slide-1.jpg', option: 'image'},
            {target: 'img/example-slide-2.jpg', option: 'image'},
            {target: 'img/example-slide-3.jpg', option: 'image'},
            {target: 'img/tab_hover.png', option: 'image'},
            {target: 'img/tab_on.png', option: 'image'},
            {target: 'img/tab_off.png', option: 'image'},
            {target: 'img/cs_icon20140915.png', option: 'image'},
            {target: 'img/bg-parallaxsample06.jpg', option: 'image'},
            {target: 'img/bg-parallaxsample09.jpg', option: 'image'},
            {target: 'img/bg-parallaxsample05.jpg', option: 'image'}
        ],

        fileLen = files.length,
        xhrArr = [],
        xhr, file, i,

    onload = function() {

        files[xhrArr.indexOf(this)].result = this.response;
    };

    for (i=0; i<fileLen; i++) {

        xhr = new XMLHttpRequest();
        file = files[i];

        xhr.open('GET', file.target, true);
        xhr.onload = onload;

        if (file.option)
            xhr.responseType = 'arraybuffer';

        xhr.send();

        xhrArr.push(xhr);
    }

    window.files = files;

})();

//scroll
// (function() {

//     var $document = $(document),
//         $window = $(window),
//         $gridPanel = $('#grid-panel'),
//         $panel = $('.panel'),
//         gridTopOffset = $gridPanel.offset().top,
//         panelOver = false;

//     $panel.mouseenter(function() {

//         panelOver = true;
//     });

//     $panel.mouseleave(function() {

//         panelOver = false;
//     });

//     $document.on('mousewheel', function() {

//         var $panel = $('.panel'),
//             $panelVislble = $panel.filter(':visible'),
//             scrollTop = $window.scrollTop();

//         if (panelOver) {

//             if ($gridPanel.css('position') !== 'fixed')
//                 $gridPanel.css('top', gridTopOffset - scrollTop);

//             $document.trigger('panelWheel');
//         }

//         else {

//             console.log($panelVislble.outerHeight());

//             if ($panel.css('position') !== 'fixed') {

//                 $panel.css({

//                     top: gridTopOffset - scrollTop,
//                     left: $panelVislble.offset().left,
//                     height: $panelVislble.outerHeight(),
//                     minHeight: 'initial'
//                 });
//             }

//             $document.trigger('gridWheel');
//         }
//     });

//     $document.on('panelWheel', function() {

//         $panel.css({

//             position: '',
//             top: '',
//             left: '',
//             height: '',
//             minHeight: '100%'
//         });

//         $gridPanel.css({

//             position: 'fixed',
//             width: $gridPanel.width(),
//             height: $gridPanel.height()
//         });
//     });

//     $document.on('gridWheel', function() {

//         $gridPanel.css({

//             position: '',
//             top: ''
//         });

//         $panel.css('position', 'fixed');
//     });

// })();
