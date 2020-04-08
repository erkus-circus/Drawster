function changeBrushColor(val) { // change color of brush,
    // sets it in session storage
    brush.color = val;
    sessionStorage.setItem('color', val);
}
/**
 * set the brush tranparency
 * @param {int} val the value to set the brush transparency to. 0 - 10
 */
function setTransparency(val) { // sets tranparency
    var t = val / 10; // / 10 because val is 1 through 10
    brush.transparency = t;
}

function resizeCanvas(dir, val, elem) { // resizes canvas
    console.log(dir, val);

    var canvasDatas = canvs.map(function (canv) {
        var ctx = canv.getContext('2d');
        console.log(canv.width, canv.height)

        return {
            ctx: ctx,
            data: ctx.getImageData(0, 0, canv.width, canv.height)
        };
    });

    if (dir == 'w') { // width
        canvs.width(val);
    }

    if (dir == 'h') { // height
        canvs.height(val);
    }


    if (dir == 'l') {
        canvs.width(1024).height(1024);
    }

    if (dir == 'a') { // auto
        canvs.width(window.innerWidth / 1.48);
        canvs.height(window.innerHeight / 1.2);
    }
    else if (dir == 'f') {
        canvs.width(window.innerWidth);
        canvs.height(window.innerHeight);
    }

    $('.size-x').val(canvs[0].width);
    $('.size-y').val(canvs[0].height);

    canvs.style('width', canvs[0].width+ 'px');
    canvs.style('height', canvs[0].height + 'px');

    canvasDatas.forEach(function (data) {
        data.ctx.putImageData(data.data, 0, 0, 0, 0, canvs.width()[0], canvs.height()[0]);
    })

    $('canvas').each((el, i) => {
        el.style('zIndex', i);
    });


    console.log("NEW");
    canvs.map(function (canv) {
        console.log(canv.width, canv.height);
    })
}

function changeType(obj) { // change types on <input>
    if (obj.type == 'range') {
        obj.type = 'number';
    }
    else {
        obj.type = 'range';
    }
}

function initAdvancedBrushSets() {
    //initalize advanced brush settings
    var sets = [
        "source-over", "source-in", "source-out", "source-atop", "destination-over",
        "destination-in", "destination-out", "destination-atop", "lighter", "copy",
        "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge",
        "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue",
        "saturation", "color", "luminosity"
    ]

    sets.forEach(type => {
        $('.glbl-compos-select').append($('<option>').val(type).html(type.replace('-', ' '))).change(function () {
            c.globalCompositeOperation = this.value;
        });
    });

}

function openSettings() {
    $("#settings-modal").show();
}

function uniformChange(e) {
    $("." + e.target.className).val(e.target.value);
}

function changeBrushMode(value) {
    brush.mode = value;
}

function newTitle(elem) {
    brush.title = elem.value;
    document.title = 'Drawster - ' + brush.title;
    _("#title").value(brush.title);
    _.find('#save-space').download = brush.title + '.erkspace';
}

function setControls() {
    // change the title of the document.
    document.title = 'Drawster - ' + brush.title;
    $('.title').value(brush.title);
}

function toggleSwitch(type, elem) { // for toggle switches

    // make all toggle switches have same value.
    var erkElem = $("." + elem.className).checked(elem.checked);
    var checked = erkElem.checked()[0];

    if (type == 'eraser' && checked) {
        $('.draw-mode').html('on');
        brush.oldMode = brush.mode;
        brush.mode = 'erase';
    }

    else if (type == 'eraser') {
        $('.draw-mode').html("off");
        brush.mode = brush.oldMode;
    }

    if (type == 'grid') {
        if (checked) {
            brush.grid = true;
            drawCanvGrid();
            $('.grid-option').show();
            $('.canvas-grid-text').html("on")
        }
        else {
            brush.grid = false;
            drawCanvGrid();
            $('.grid-option').hide();
            $('.canvas-grid-text').html("off");
        }
    }


    if (type == 'draw' && checked) {
        drawable = true;
        $('.mode-draw').html('Draw mode');
    } else if (type === "draw") {
        drawable = false;
        $('.mode-draw').html('View mode');
    }

    if (type == 'img') {
        if (checked) {
            $('.img-stretch-show').html('on');
        }
        else {
            $('.img-stretch-show').html('off');
        }
    }
}

function changeOFF(kind, obj) { // change offset for shadows
    // change offset of shadow on brush
    var val = obj.value;
    if (kind == 'x') {
        brush.shadow.offX = val;
    }
    else if (kind == 'y') {
        brush.shadow.offY = val;
    }

}

function changeScolor(obj) { // change shadow color
    //change shadow color
    brush.shadow.color = obj.value;
}

function changeSize(val) { // change brush size
    // change size of brush
    brush.size = val;
    $('.brush-size').html(val);
}

function changeBlur(obj) {// change shadow blur

    var val = obj.value;
    brush.shadow.blur = val;
}



function changeTipSize(val) {
    var n = Math.floor(val);
    if (n != 0) {
        $(".canvas").className("canvas outer-canv-layer " + "col-" + (12 - n) + " col-s-" + (12 - n));
    } else {
        var on = n;
        n = 0;
        $(".canvas").className("canvas outer-canv-layer " + "col-" + (12 - n) + " col-s-" + (12 - n));
        n = on;
    }
    $(".side-bar").className("side-bar " + "col-" + (n) + " col-s-" + (n));
}

