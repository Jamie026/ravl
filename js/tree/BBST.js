Ext.define('MJ.BBST', {
    extend: 'MJ.BST',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this.callParent(arguments);
    },
    afterRotate_: function (grand, parent, child) {
        if (grand.isLeftChild()) {
            grand.parent.left = parent;
        } else if (grand.isRightChild()) {
            grand.parent.right = parent;
        } else {
            this.root = parent;
        }
        if (child) {
            child.parent = grand;
        }
        parent.parent = grand.parent;
        grand.parent = parent;
    },
    rotateLeft_: function (grand) {
        var parent = grand.right;
        var child = parent.left;
        grand.right = child;
        parent.left = grand;
        this.afterRotate_(grand, parent, child);
    },
    rotateRight_: function (grand) {
        var parent = grand.left;
        var child = parent.right;
        grand.left = child;
        parent.right = grand;
        this.afterRotate_(grand, parent, child);
    }
});

/*-----------------------------------------------------------------*/