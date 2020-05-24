(function() {

    var $body = $('body'),
        $parent = $(window.parent.document),
        $gridPanel = $parent.find('#grid-panel'),
        $gridModalBtn = $parent.find('#grid-modal-btn'),
        $uiComponentMenu = $parent.find('.com-menu'),
        $insertGrid = $parent.find('.insert-grid'),
        $removeGrid = $parent.find('.remove-grid'),
        $gridSetting = $parent.find('.grid-setting'),
        $exportGrid = $parent.find('.export-grid'),
        $rowInp = $parent.find('#row-inp'),
        $colInp = $parent.find('#col-inp'),
        $initCol = $('.init-col'),
        $targetRow,
        initText = $initCol.html(),

    selected = function() {

        var disabled = 'disabled',
            $selected = $body.find('.ui-selected'),
            $row = $selected.closest('.row');

        if ($selected.length === 1 && !$selected.hasClass('com')) {

            $insertGrid.removeClass(disabled);

            if (!$selected.hasClass('init-col'))
                $uiComponentMenu.removeClass(disabled);
        }

        else {

            $insertGrid.addClass(disabled);
            $uiComponentMenu.addClass(disabled);
        }

        if ($row.length && !$row.parent().children().children(':not(.ui-selected)').length && !$selected.children(':not(.resize-bar)').length)
            $removeGrid.removeClass(disabled);

        else
            $removeGrid.addClass(disabled);
    },

    makeSelectable = function(fil) {

        var filter = '.com, .component, [class*="col-"]';
        filter = fil ? filter + fil : filter;
        // filter = filter + ', .component';

        $body.selectable({

            cancel: 'a, input, textarea, button, select, option, .component, .close',
            filter: filter,
            selected: selected,
            unselected: selected
        });
    },

    destroySelectable = function() {

        $body.selectable('destroy');
    };

    $gridModalBtn.click(function(event) {

        event.preventDefault();

        var row = $rowInp.val(),
            col = $colInp.val();

        if (!$.isNumeric(row) || !$.isNumeric(col) || col > 12)
            return;

        var colCnt = Math.floor(12 / col),
            colElem = $(''),
            rowElem = $(''),
            $targetCol = $body.find('.ui-selected');

        if (!$targetCol.length)
            return;

        for (var i=0; i<col; i++)
            colElem = colElem.add($('<div class="col-' + parent.dpub.grid.device + '-' + colCnt + '">'));

        for (i=0; i<row; i++)
            rowElem = rowElem.add($('<div class="empty row">').html(colElem.clone()));

        $targetCol.removeClass('ui-selected');
        $targetCol.children(':not(.resize-bar)').remove();
        $targetCol.append(rowElem);

        // $targetCol.parent().removeClass('empty');
        calHeight($targetCol.closest('.row'));

        destroySelectable();
        makeSelectable(':not(:has(.row, .component, .com))');

        $targetCol.find('[class*="col-"]').sortable({ items: '>.component, >.com', scroll: false });

        rowElem.find(':not(:last-child)').html('<div class="resize-bar"></div>');

        $insertGrid.addClass('disabled');
        $gridSetting.addClass('disabled');
        $exportGrid.removeClass('disabled');
    });

    $insertGrid.click(function() {

        if (!parent.checkDisabled.call(this))
            return false;
    });

    $removeGrid.click(function() {

        if (!parent.checkDisabled.call(this))
            return false;

        $body.find('.ui-selected').closest('.row').remove();
        $(this).addClass('disabled');

        destroySelectable();

        if (!$initCol.children().length) {

            $gridSetting.removeClass('disabled');

            $gridPanel.css('height', '');
            $body.css('height', '');

            $initCol.html(initText);
            parent.dpub.grid.resizeGrid();

            makeSelectable();
        } else {
            makeSelectable(':not(:has(.row, .component, .com))');
        }
    });

    $gridSetting.click(function() {

        if (!parent.checkDisabled.call(this))
            return false;
    });

    $exportGrid.click(function() {

        if (!parent.checkDisabled.call(this))
            return false;
    });

    makeSelectable();

    window.makeSelectable = makeSelectable;
    window.destroySelectable = destroySelectable;
    window.selected = selected;

})();

//grid-resize
(function() {

    var $body = $('body'),
        startX, moveX, th, $touched = null,

    resize = function($left, $right, direction) {

        var deviceClass = 'col-' + window.parent.dpub.grid.device + '-',
            deviceRegExp = new RegExp(deviceClass + '(\\d*)'),
            leftClass = $left.attr('class'),
            rightClass = $right.attr('class'),
            leftDeviceClass = deviceRegExp.exec(leftClass) || '',
            rightDeviceClass = deviceRegExp.exec(rightClass) || '',
            leftSize, rightSize;

        if (direction === 'left') {

            leftSize = parseInt(leftDeviceClass[1] || 12) - 1;
            rightSize = parseInt(rightDeviceClass[1] || 0) + 1;
        }

        else if (direction === 'right') {

            leftSize = parseInt(leftDeviceClass[1] || 0) + 1;
            rightSize = parseInt(rightDeviceClass[1] || 12) - 1;
        }

        if (!leftSize || !rightSize)
            return;

        if (direction === 'left') {

            leftSize = Math.max(leftSize, 1);
            rightSize = Math.min(rightSize, 11);
        }

        else if (direction === 'right') {

            leftSize = Math.min(leftSize, 11);
            rightSize = Math.max(rightSize, 1);
        }

        $left.removeClass(leftDeviceClass[0] + ' ui-selected');
        $left.addClass(deviceClass + leftSize);

        $right.removeClass(rightDeviceClass[0] + ' ui-selected');
        $right.addClass(deviceClass + rightSize);

        destroySelectable();
        makeSelectable(':not(:has(.row, .component, .com))');
    };

    $body.on('mousedown', '.resize-bar', function(event) {

        event.stopPropagation();
        $touched = $(event.target);
        startX = event.pageX;
        th = $(this).closest('.row').width() / 12 / 1.2;
    });

    $body.on('mousemove', function(event) {

        var absX, direction,
            $parent;

        if (!$touched)
            return;

        $parent = $touched.parent();

        event.preventDefault();

        moveX = event.pageX - startX;
        absX = Math.abs(moveX);

        if (absX > th) {

            if (moveX < 0)
                direction = 'left';

            else if (moveX > 0)
                direction = 'right';

            $body.trigger('resizeBarMove', {left: $parent, right: $parent.next(), direction: direction});

            startX = event.pageX;
        }
    });

    $body.on('mouseup', function() { $touched = null; });

    $body.on('resizeBarMove', function(event, data) {

        resize(data.left, data.right, data.direction);

        //수정해야함
        calUp(data.left.parent('.row'));
        calResize();
    });

})();

//grid
(function() {

    var $body = $('body'),
        $parent = $(window.parent.document),
        $panel = $parent.find('.panel'),
        $gridPanel = $parent.find('#grid-panel'),
        $initRow = $('.init-row'),
        componentTemplate = '<div class="com"><button type="button" class="close">X</button></div>',
        fontSize = $body.css('fontSize').replace('px', ''),

    getHeight = function($elem) {
        // return parseInt($elem.innerHeight());
        // return parseInt($elem.css('height').replace('px', '')) + 1;
        return parseInt($elem.css('height').replace('px', ''));
    },

    getInnerHeight = function($elem) {
        // return parseInt($elem.innerHeight());
        // return parseInt($elem.css('height').replace('px', '')) + 1;
        return parseInt($elem.innerHeight());
    },

    itemSelector = function() {

        var $clicked = $panel.find('.clicked'),
            $item;

        if (!$clicked.length)
            return;

        $item = getItem($clicked);
        $clicked.removeClass('active clicked');

        return $item;
    },

    getItem = function($elem) {

        var permitTag = ['img', 'iframe'],
            $item = $(),
            it = $elem,
            tag,

        clone = function($elem) {

            return $elem.clone().removeClass('movable active clicked');
        };

        if ($elem.hasClass('media-layer'))
            $elem = $elem.next();

        for (var i=0; i<permitTag.length; i++) {

            tag = $elem.children(permitTag[i]);

            if (tag.length)
                it = tag;
        }

        it = clone(it).removeAttr('data-dzo');
        $item = $item.add(it);

        return $item;
    },

    setMaxWidth = function() {

        var $this = $(this);
        $this.closest('.imgarea').css('max-width', $this.width());
    };

    makeImageComponent = function($item) {

        var $div = $('<div>'),
            componentId = 'component' + (parent.dpub.ui.count + 1),
            com = new ChosunImage(componentId),
            $img, $span, src;

        com.asyncMake = false;
        com.makeNode($div);

        $div.find('dd').append($item);
        $com = $div.find('.com');
        $img = $div.find('img');
        $span = $div.find('span');

        src = $img.attr('src').replace('small', 'org').replace('s_', '');

        $com.css('max-width', '');
        $img.attr('src', src);
        $span.css('background-image', 'url("' + src + '")');
        $img.one('load', setMaxWidth);
        $img.one('load', runCalHeight);

        parent.dpub.ui.count++;

        return $div.children();
    },

    calHeight = function($row) {

        calUp($row);
        calDown();
        calResize();
    },

    calResize = function() {

        $body.css('height', 'auto');
        $gridPanel.css('height',  getHeight($body));

        window.parent.dpub.grid.resizeGrid();
    },

    calCollapsed = function($children) {

        var $child,
            childrenLen = $children.length,
            i, height = 0;

        for (i=0; i<childrenLen; i++) {

            $child = $children.eq(i);
            $child.css('height', '');

            if (!$child.children('.component, .row, .com').length) {
                $child.css('height', fontSize * 10);
            }

            else {
                $child.css('height', getInnerHeight($child));
            }

            height += getHeight($child);
        }

        return height;
    },

    calUp = function($row) {

        var $parents = $row.add($row.parents('.row')).not('.init-row'),
            $parent, $children, $child,
            parentsLen = $parents.length,
            childrenLen, height, childHeight, i, j;

        //up
        for (i=parentsLen-1; i>=0; i--) {

            $parent = $parents.eq(i);
            $parent.css('height', 'auto');

            $children = $parent.children();
            childrenLen = $children.length;
            height = 0;

            if ($parent.hasClass('collapsed'))
                height = calCollapsed($children);

            else {

                for (j=0; j<childrenLen; j++) {

                    $child = $children.eq(j);
                    $child.css('height', '');

                    if (!$child.children('.component, .row, .com').length)
                        childHeight = fontSize * 10;

                    else
                        childHeight = getHeight($child);

                    height = Math.max(height, childHeight);
                    $child.css('height', '');
                }
            }

            if (!height)
                $parent.addClass('empty');

            else {
                if ($parent.find('component, .row, .com')) height +=2;
                $parent.css('height', height);
            }
        }
    },

    calDown = function() {

        var $rows = $initRow.find('.row'),
            $row, $children, $child, $empty, $notEmpty,
            rowsLen = $rows.length,
            childrenLen, notEmptyLen,
            height, heightSum, i, j, k;

        for (i=0; i<rowsLen; i++) {

            $row =  $rows.eq(i);
            height = getHeight($row);

            if ($row.hasClass('collapsed'))
                continue;

            // console.log($row.get(0), height);

            $children = $row.children();
            childrenLen = $children.length;

            for (j=0; j<childrenLen; j++) {

                $child = $children.eq(j);
                $empty = $child.children('.row:not(:has(.component, .com))');
                $notEmpty = $child.children('.row').not($empty);
                notEmptyLen = $notEmpty.length;
                heightSum = 0;

                if (!$empty.length)
                    continue;

                for (k=0; k<notEmptyLen; k++)
                    heightSum += getHeight($notEmpty.eq(k));

                $empty.css('height', (height - heightSum) / $empty.length);
            }
        }
    },

    runCalHeight = function() {

        // var $this = $(this),
            // $com = $this.closest('.com');

        // $com.css('max-width', '').css('max-width', $com.width());
        calHeight($targetRow);
    };

    //leaf col
    $body.on('mousedown', '[class*="col-"]:not(:has(.row))', function() {

        var $this = $(this),
            $row = $this.closest('.row'),
            $item;


        if ($this.hasClass('init-col'))
            return;

        $item = itemSelector();

        if (!$item)
            return;

        $targetRow = $row;
        $row.removeClass('empty');

        if ($item.filter('img').length)
            $item = makeImageComponent($item);

        else
            $item = $(componentTemplate).append($item);

        //$this.children(':not(.resize-bar)').remove();
        $this.removeClass('ui-selected').append($item);
        $this.find('img').one('load', runCalHeight);

        destroySelectable();
        makeSelectable(':not(:has(.row, .component, .com))');

        calHeight($row);
    });

    $body.on('mousedown', '.close', function(event) {

        event.preventDefault();
        // event.stopPropagation();

        var $this = $(this),
            $row = $this.closest('.row');

        $this.closest('.component').remove();
        calHeight($row);
    });

    $body.on('mousedown', '.component, .com', function() {

        var $this = $(this);

        $body.find('.ui-selected').removeClass('ui-selected');
        $this.addClass('ui-selected');

        selected();
    });

    window.itemSelector = itemSelector;
    window.calHeight = calHeight;
    window.calUp = calUp;
    window.calDown = calDown;
    window.calResize = calResize;

})();

(function() {

    var $body = $('body');

    $body.on('mousedown', '[class*="col-"]:not(:has(.row))', function(event) {

        if (event.which !== 1)
            return;

        var $this = $(this),
            time = new Date().getTime(),
            clickTime = $this.data('click-time');

        if (!clickTime) {

            $this.data('click-time', time);
            setTimeout(function() { $this.data('click-time', null); }, 1000);
        }

        else {

            $this.data('click-time', null);

            // console.log(time - clickTime);

            if (time - clickTime < 300)
                $this.trigger('dbmousedown');
        }
    });

    // $body.on('dbmousedown', '[class*="col-"]:not(:has(.row))', function(event) {

    //     var $this = $(this);

    //     if ($this.hasClass('init-col'))
    //         return;

    //     var componentId = 'component' + (parent.dpub.ui.count + 1),
    //         com = new ChosunText(componentId),
    //         $row = $this.closest('.row');

    //     com.makeNode($this);

    //     $this.removeClass('ui-selected');
    //     destroySelectable();
    //     makeSelectable(':not(:has(.row, .component, .com))');

    //     calHeight($row);

    //     parent.dpub.ui.count++;
    // });

})();
