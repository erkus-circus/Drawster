
/**
 * Create a layer with a canvas and context.
 * @param {string} name The name of the layer
 * @param {int} index The index of the layer.
 */
function Layer(name, index) {
    this.name = name;
    this.index = index;
    this.canvas = $('<canvas>').width(canvs.width()[0]).height(canvs.height()[0]).style('zIndex', index).className('canv');
    $('.canvs').append(this.canvas);
    canvs = $('canvas');
    this.c = this.canvas[0].getContext('2d');
    initNewCanvas(this.canvas)
    resizeCanvas('w', topCanv.width);
    resizeCanvas('h', topCanv.height);


    var option = $('<option>').val(name).html(name);

    $('.layer-selector').append(option);

    this.remove = function () {
        this.canvas.parentNode.removeChild(this.canvas);
    }
}