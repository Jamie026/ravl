Ext.define('MJ.Demo', {
    statics: {
        randomMaxCount: 20,
        randomMaxValue: 100,
        avlTree: new MJ.AVLTree(),
        ravlTree: new MJ.RAVLTree(),

        POSTORDER: '3',
        INORDER: '2',
        PREORDER: '1',
        LEVEL_ORDER: '0',

        SHOW_AVL: '2',
        SHOW_RAVL: '1',

        $avlCtl: $('#avl'),
        $ravlCtl: $('#ravl'),

        LINK_TYPE_ELBOW: MJ.BinaryTree.GraphLayout.LINK_TYPE_ELBOW,
        LINK_TYPE_LINE: MJ.BinaryTree.GraphLayout.LINK_TYPE_LINE,
        linkType : MJ.BinaryTree.GraphLayout.LINK_TYPE_ELBOW,
    }
});

$(function () {
    initCommon();
    initBst(MJ.Demo.$avlCtl, MJ.Demo.avlTree);
    initBst(MJ.Demo.$ravlCtl, MJ.Demo.ravlTree);
    $('#modules').remove();
});

function display() {
    var $ctl = showingTreeCtl();
    var $paper = $ctl.find('.paper, .joint-paper');
    $paper.show();

    var layout = new MJ.BinaryTree.GraphLayout({
        tree: showingTree(),
        linkType: MJ.Demo.linkType,
        $paper: $paper
    }).display();

    $ctl.find('.node-count').text(layout.tree.size);
    $ctl.find('.orders select').change();
}

function linkType() {
    var linkType = MJ.Demo.LINK_TYPE_ELBOW;
    if (showingTreeCtl().find('.link-type .line').is(':checked'))
        linkType = MJ.Demo.LINK_TYPE_LINE;
    return linkType;
}

function initCommon() {
    $('#common').find('.type select').change(function () {
        MJ.Demo.$avlCtl.hide();
        MJ.Demo.$ravlCtl.hide();
        showingTreeCtl().show();
        MJ.Demo.linkType = linkType();
    });
}

function initBst($bstCtl, bstTree) {
    $bstCtl.append(clonePaper());

    var $content = $bstCtl.find('.content');
    $content.append(cloneLinkType($bstCtl.attr('id'))).append('<hr>');
    $content.append(cloneBstInput(bstTree));
    $content.append('<hr>').append(cloneOrders());
}

function showingTreeCtl() {
    var val = $('#common').find('.type select').val();
    if (val === MJ.Demo.SHOW_AVL)
        return MJ.Demo.$avlCtl;
    if (val === MJ.Demo.SHOW_RAVL)
        return MJ.Demo.$ravlCtl;
}

function showingTree() {
    var val = $('#common').find('.type select').val();
    if (val === MJ.Demo.SHOW_RAVL)
        return MJ.Demo.ravlTree;
    else if (val === MJ.Demo.SHOW_AVL)
        return MJ.Demo.avlTree;
}

function cloneOrders() {
    var $orders = clone('.orders');
    $orders.find('select').change(function () {
        var $this = $(this);
        var orderTexts = null;
        var order = $this.val();
        var tree = showingTree();
        if (order === MJ.Demo.LEVEL_ORDER)
            orderTexts = tree.levelOrderElements();
        else if (order === MJ.Demo.PREORDER)
            orderTexts = tree.preorderElements();
        else if (order === MJ.Demo.INORDER)
            orderTexts = tree.inorderElements();
        else if (order === MJ.Demo.POSTORDER)
            orderTexts = tree.postorderElements();
        $this.parents('.orders').find('.show-order').text(orderTexts? orderTexts.join(', ') : '');
    });

    return $orders;
}

function clonePaper() {
    return clone('.paper').css('left', '390px').css('top', '15px');
}

function cloneLinkType(id) {
    var $linkType = clone('.link-type');
    var name = id + '-link-type';

    var linkFn = function () {
        var oldLinkType = MJ.Demo.linkType;
        MJ.Demo.linkType = linkType();
        if (MJ.Demo.linkType === oldLinkType) return;
        if (!showingTree().getRoot()) return;

        display();
    };

    var $elbow = $linkType.find('.elbow');
    var elbowId = id + '-elbow';
    $elbow.parents('label').attr('for', elbowId);
    $elbow.attr('id', elbowId);
    $elbow.attr('name', name);
    $elbow.click(linkFn);

    var $line = $linkType.find('.line');
    var lineId = id + '-line';
    $line.parents('label').attr('for', lineId);
    $line.attr('id', lineId);
    $line.attr('name', name);
    $line.click(linkFn);
    return $linkType;
}

function cloneBstInput(bstTree) {
    var $bstInput = clone('.bst-input');
    var $textarea = $bstInput.find('.data');

    $bstInput.find('.random').click(function () {
        var count = $bstInput.find('.max-count').val();
        if (Ext.isNumeric(count))
            count = parseInt(count);
        else
            count = MJ.Demo.randomMaxCount;
        var value = $bstInput.find('.max-value').val();
        if (Ext.isNumeric(value))
            value = parseInt(value);
        else
            value = MJ.Demo.randomMaxValue;

        count = 1 + Math.floor(Math.random()*count);
        var nums = [];
        for (var i = 0; i < count; i++) {
            var num = null;
            while (num === null || $.inArray(num, nums) !== -1)
                num = 1 + Math.floor(Math.random()*value)
            nums.push(num);
        }
        $textarea.val(nums.join(', '));
    });

    $bstInput.find('.add').click(function () {
        var eles = $textarea.val().split(/\D+/i);
        for (var i in eles)
            bstTree.add(parseInt(eles[i].trim()));
        display();
    });

    $bstInput.find('.remove').click(function () {
        if (!bstTree.getRoot()) return;

        if (bstTree === MJ.Demo.binaryHeap)
            bstTree.remove();
        else {
            var eles = $textarea.val().split(/\D+/i);
            for (var i in eles)
                bstTree.remove(parseInt(eles[i].trim()));
        }
        display();
    });

    $bstInput.find('.clear').click(function () {
        if (!bstTree.getRoot()) return;

        bstTree.clear();
        display();
    });

    return $bstInput;
}

function clone(sel) {
    return $('#modules').find(sel).clone(true);
}