// _MAIN
function initNewCanvas(canv) {
    canv.on('touchmove', draw, true);
    canv.on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mousedown = true;
        brush.lastPos = mPos(e);
        draw(e);
        c.save();
        canvasObj.oldImages.push(c.getImageData(0, 0, canvas.width, canvas.height));
    }, true);
    canv.on('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mousedown = false;
        draw(e);
    });
    canv.on('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mousedown = true;
        c.save();
        canvasObj.oldImages.push(c.getImageData(0, 0, canvas.width, canvas.height));
        draw(e);
    }, true);
    canv.on('click', draw, true);
    canv.on('wheel', function (e) {
        if (e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            var oldWidth = canvs.csswidth()[0];
            var oldHeight = canvs.cssheight()[0];
            console.log(oldWidth.substring(0, oldWidth.length - 2));


            canvs.csswidth((parseInt(oldWidth.substring(0, oldWidth.length - 2)) - e.deltaY) + "px");
            canvs.cssheight((parseInt(oldHeight.substring(0, oldHeight.length - 2)) - e.deltaY) + "px");
        }
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            window.scrollBy(e.deltaY, 0);
        }
    });
}


/**
 * Create a layer with a canvas and context.
 * @param {string} name The name of the layer.
 */
function Layer(name) {
    this.name = name;
    this.canvas = $('<canvas>').width(canvs.width()[0]).height(canvs.height()[0]).style('zIndex', index).className('canv');
    $('.canvs').append(this.canvas);
    canvs = $('canvas');
    this.c = this.canvas[0].getContext('2d');
    initNewCanvas(this.canvas)
    resizeCanvas('w', topCanv.width);
    resizeCanvas('h', topCanv.height);




    // TODO: custom elem for layer selector, not just normal list.
    var layerElem = $('<span>');

    $('.layer-selector').append(option);

    this.remove = function () {
        this.canvas.parentNode.removeChild(this.canvas);
    }
}

// _EVENT

$(window).load(function () {
    $('.layer-selector').change(function (e) {
        c = brush.layers[this.value].c;
        canvas = brush.layers[this.value].canvas[0];
    });
});