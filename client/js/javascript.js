/*\
|||\ Eric Diskin
|||| 2018
|||/ Version: 1.3.0
\*/
//(function(window,document) {
var projectVersion = 0;
var altPressed = false;
var brush = {

    // show grid ontop of canvas.
    grid: false,

    // size of boxes
    gridSize: 8,

    // brush is big object of everything that  the cursor can do. includes some canvas objects
    mode: 'pen',
    oldMode: 'pixel',
    gramode: 0,
    size: 16,
    color: (sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : 'black',
    transparency: 1,
    img: null, // the image to draw in image mode
    width: 100,
    height: 100,
    calig: {
        size: 0
    }
    ,
    rotate: 0,
    shadow: { // shadows
        on: true,
        blur: 0,
        offX: 0,
        offY: 0,
        color: 'black'
    }
    ,
    lastPos: {
        x: null,
        y: null
    }
    ,
    line: {
        from: [0, 0],
        lineWidth: 10
    }
    ,
    pos: [0, 0], // last pos of mouse
    title: 'Untitled'
};

brush.spaceBar = false; // is the spaceBar toggled?

var webApp = false;

var canvasObj = {
    oldImages: [],
    newImages: []
}; // redo and undo
// TODO: redo

var version = '0.8.0', vercsionFull = {
    major: 0,
    minor: 8,
    build: 0,
    patch: 0
};

var menuOpen = null; // the open menu

var imageURL = '', drawable = true, makingSomething = 0;

let canvas;
let topCanv, tc;
let c; // context

var mousedown = false;

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

$(window).load(function () { // window onload
    //vars:
    
    canvas = $('#canvas')[0];
    c = canvas.getContext('2d');
    topCanv = $('#top-canvas')[0];
    tc = topCanv.getContext('2d');
    canvs = $('canvas');
    brush.img = _.find('#brush-img');
    //event listeners:
    canvs.on('touchmove', draw, true);
    canvs.on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mousedown = true;
        brush.lastPos = mPos(e);
        draw(e);
        c.save();
        canvasObj.oldImages.push(c.getImageData(0, 0, canvas.width, canvas.height));
    }, true);
    canvs.on('touchend',function(e){
        e.preventDefault();
        e.stopPropagation();
        mousedown = false;
        draw(e);
    });
    canvs.on('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mousedown = true;
        c.save();
        canvasObj.oldImages.push(c.getImageData(0, 0, canvas.width, canvas.height));
        draw(e);
    }, true);
    canvs.on('click', draw, true);
    window.addEventListener('mouseup', function () {
        mousedown = false;
    });

    $('.modal').modal();
    $('#load-modal').show();
    $('.panel').hide();
    drawCanvGrid();
    $('#loading-modal').show();
    $('.nav-menu-item').click(function (e, elem) {
        var panel = $('.panel', e.target)
        
        if (e.target !== this) {
            return;
        }
        
        if (menuOpen != panel) {
            try {
                menuOpen.hide();
            } catch (e) {
                
            }
        }


        panel.toggle();
        menuOpen = panel;
    });

    $('.close-panel-btn').click((e) => {
        var el = $(e.target).parent();
        el.hide();
    });

    $(window).on('keydown', function (e) {
        var cd = e.keyCode || e.wich;
        if (cd == 90 && e.ctrlKey) {
            undo();
        }
        else if (e.ctrlKey && cd == 89) {
            redo();
        }
        else if (e.ctrlKey && e.altKey && !e.shiftKey && cd == 67) {
            $('.color').click();
        }
        else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 67) {
            c.clearRect(0, 0, canvas.width, canvas.height);
        }
        else if (cd == 32) {
            brush.spaceBar = brush.spaceBar !== true;
        }
        else if (cd == 221 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            brush.size += (++brush.size * .04);
            $('.brush-size').html(Math.floor(brush.size))
        }
        else if (cd == 219 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (brush.size > 2) {
                brush.size -= (++brush.size * .04);
            }
            $('.brush-size').html(Math.floor(brush.size))
        }
        else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 70) {
            resizeCanvas('f');
        }
        else if (e.ctrlKey && cd == 83 && e.altKey) {
            //	_('#info-sheet').unfade();
            //	_('@wait',function() {
            //		_('#info-sheet').fade();
            //	}
            //,1100);
        }
        updateTop();
    }, true);
    
    // for some reason it doesent auto set.
    
    $(".quick-select").change(function(e) {
        console.log($("#" + e.target.value + "-tip").html()[0]);
        
        $("#quick-tip").html($("#" + e.target.value + "-tip").html()[0]);
    });
    
    $("#quick-tip").html($("#" + "Brush" + "-tip").html()[0]);
    
    // keep all inputs uniform
    $("input").change(uniformChange);
    $("select").change(uniformChange);
    
    $("#quick-tip").html($(".Brush-tip").html()[0]);
    
    $(window).on('mousemove', draw, true);
    $(canvas).on('contextmenu', (e) => e.preventDefault());
    //fun calls:
    initAdvancedBrushSets();
    
    // other:
    $('.color').val((sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : '#000000');
    

    // set css width and height so no errors occur
    canvs.csswidth(canvs.width()[0] + 'px');
    canvs.cssheight(canvs.height()[0] + 'px');


    // zoom in and out
    $('canvas').on('wheel', function (e) {
        if (e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            var oldWidth = canvs.csswidth()[0];
            var oldHeight = canvs.cssheight()[0];
            console.log(oldWidth.substring(0, oldWidth.length - 2));
            
            
            canvs.csswidth((parseInt(oldWidth.substring(0,oldWidth.length - 2)) - e.deltaY) + "px");
            canvs.cssheight((parseInt(oldHeight.substring(0, oldHeight.length - 2)) - e.deltaY) + "px");
        }
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            window.scrollBy(e.deltaY, 0);
        }
    })
    
    // other onload
    // PARAMS
    resizeCanvas('a');
    $('#loading-modal').hide();

});

function mPos(e) { // find mouse position on "canvas"
    var rt = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rt.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rt.height;  // relationship bitmap vs. element for Y

    if (e.touches) {
        // if touch evt
        return {
            x: (e.touches[0].clientX - rt.left) * scaleX,
            y: (e.touches[0].clientY - rt.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rt.left) * scaleX,
        y: (e.clientY - rt.top) * scaleY
    };
}

function decur(str) { return decodeURIComponent(str); }

function draw(e) { // draws on the canvas, main function

    var pos = brush.pos = mPos(e);

    if (mousedown && brush.spaceBar) {
        brush.calig.size++;
    }
    else if (mousedown && !brush.spaceBar && brush.calig.size > 0) {
        brush.calig.size--;
    }
    else {
        brush.calig.size = 0;
    }
    
    c.shadowColor = brush.shadow.color;
    c.shadowBlur = brush.shadow.blur;
    c.shadowOffsetX = brush.shadow.offX;
    c.shadowOffsetY = brush.shadow.offY;
    c.globalAlpha = brush.transparency;
    
    if (!pos.x < 0 || !pos.x > canvas.width || !pos.y < 0 || !pos.y > canvas.height) {
        e.preventDefault();
        e.stopPropagation();
    }
    c.beginPath();
    if (mousedown && drawable && brush.mode == 'erase') {
        c.shadowColor = 0;
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillStyle = brush.color;
        c.globalAlpha = 1;

        if (brush.oldMode == 'grid') {
            var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
                y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
                dx = brush.gridSize,
                dy = brush.gridSize;
            c.clearRect(x, y, dx, dy);
        }
        else {
            c.clearRect(pos.x - ((brush.size + brush.calig.size) / 2), pos.y - ((brush.size + brush.calig.size) / 2), brush.size + brush.calig.size, brush.size + brush.calig.size);
        }

    }
    else if (mousedown && drawable && brush.mode == 'pixel') {
        c.fillStyle = brush.color;
        c.fillRect(pos.x - ((brush.size + brush.calig.size) / 4), pos.y - ((brush.size + brush.calig.size) / 4), (brush.size + brush.calig.size) / 2, (brush.size + brush.calig.size) / 2);
    }
    else if (mousedown && drawable && brush.mode == 'image') {
        c.strokeStyle = brush.color;
        c.lineWidth = brush.line.lineWidth;
        c.drawImage(brush.img, pos.x - (brush.width / 2), pos.y - (brush.height / 2), brush.width, brush.height);
    }
    else if (mousedown && brush.mode == 'pen' && drawable) {
        c.lineJoin = 'round';
        c.lineCap = 'round';
        c.lineWidth = brush.size / 2 + brush.calig.size;
        c.strokeStyle = brush.color;
        c.moveTo(brush.lastPos.x, brush.lastPos.y);
        c.lineTo(pos.x, pos.y);
        c.stroke();
    }
    else if (mousedown && brush.mode == 'grid' && drawable) {
            c.beginPath()
            c.fillStyle = brush.color;
            var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
                y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
                dx = brush.gridSize,
                dy = brush.gridSize;
            c.rect(x, y, dx, dy);
            c.fill();
            c.closePath();
    }
    
    c.closePath()
    
    updateTop();
    brush.lastPos.x = pos.x;
    brush.lastPos.y = pos.y;
    if (brush.grid) {
        $('.mouse-pos').html(Math.round(pos.x / brush.gridSize) + ", " + Math.round(pos.y / brush.gridSize));
    }
    else {
        $('.mouse-pos').html(Math.round(pos.x) + ", " + Math.round(pos.y));
    }
}

function updateTop() {
    var pos = brush.pos;
    tc.beginPath();
    tc.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // check if grid
    if (brush.mode == 'grid' || (brush.oldMode == 'grid' && brush.mode == 'eraser')) {
        tc.beginPath()
        tc.lineWidth = 1;
        tc.globalAlpha = .5
        tc.fillStyle = brush.color;
        var x = Math.floor(pos.x / brush.gridSize) * brush.gridSize,
            y = Math.floor(pos.y / brush.gridSize) * brush.gridSize,
            dx = brush.gridSize,
            dy = brush.gridSize;
        tc.rect(x, y, dx, dy);
        tc.fill();
        tc.closePath();
    }

    if (brush.mode === 'pen') {
        tc.strokeStyle = brush.color;
        tc.shadowColor = 'white';
        tc.shadowBlur = 10;
        tc.arc(pos.x, pos.y, brush.size / 4 + brush.calig.size / 2, 0, Math.PI * 2);
        tc.stroke()
        tc.arc(pos.x + c.shadowOffsetX, pos.y + c.shadowOffsetY, (brush.size / 4 + brush.calig.size + c.shadowBlur / 1.5 / 2), 0, Math.PI * 2);
        tc.stroke();
    }
    else if (brush.mode === 'pixel') {
        tc.beginPath()
        tc.fillStyle = brush.color;
        tc.rect(pos.x - ((brush.size + brush.calig.size)) / 4,
        pos.y - ((brush.size + brush.calig.size)) / 4, (brush.size + brush.calig.size) / 2,
        (brush.size + brush.calig.size) / 2);
        tc.stroke()
        tc.closePath()
    }
    tc.closePath()
}

function drawCanvGrid() {
    $("#loading-modal").show();
    var gc = $("#grid-canvas")[0].getContext('2d');
    gc.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
        if (brush.grid) {
            for (let y = 0; y < canvas.height; y += brush.gridSize) {
                
                // draw grid
                gc.beginPath();
                gc.moveTo(0, y);
                gc.lineTo(canvas.width, y);
                gc.stroke();
            }
            for (let x = 0; x < canvas.width; x += brush.gridSize) {
                gc.moveTo(x, 0);
                gc.lineTo(x, canvas.height);
                gc.stroke();
            }
        }
        $("#loading-modal").hide();
    }, 10);

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

function undo() { // undo canvas
    let dataImg = canvasObj.oldImages.pop();
    canvasObj.newImages.push(dataImg);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.putImageData(dataImg, 0, 0);
    c.restore();
}

function redo() { // redo canvas
    let dataImg = canvasObj.newImages.pop();
    canvasObj.oldImages.push(dataImg);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.putImageData(dataImg, 0, 0);
    c.restore();
}

function changeBrushColor(val) { // change color of brush,
    // sets it in session storage
    brush.color = val;
    sessionStorage.setItem('color', val);
}


function setGridSize(value){
    brush.gridSize = parseInt(value);
    drawCanvGrid();
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
    console.log(dir,val);
    
    var canvasDatas = canvs.map(function (canv) {
        var ctx = canv.getContext('2d');
        console.log(canv.width, canv.height)
        
        return {
            ctx: ctx,
            data: ctx.getImageData(0,0,canv.width,canv.height)
        };
    });

    if (dir == 'w') { // width
        canvs.width(val);
    }
    
    if (dir == 'h') { // height
        canvs.height(val);
    }

    if (dir == 'a') { // auto
        canvs.width(window.innerWidth / 1.48);
        canvs.height(window.innerHeight / 1.2);
    }
    else if (dir == 'f') {
        canvs.width(window.innerWidth);
        canvs.height(window.innerHeight);
    }

    $('.size-x').val(canvas.width);
    $('.size-y').val(canvas.height);

    canvs.style('width', canvas.width + 'px');
    canvs.style('height', canvas.height + 'px');

    canvasDatas.forEach(function (data) {
        data.ctx.putImageData(data.data, 0,0,0,0,canvs.width()[0],canvs.height()[0]);
    })

    $('canvas').each((el, i) => {
        el.style('zIndex', i);
    });

    
    console.log("NEW");
    canvs.map(function (canv) {
        console.log(canv.width,canv.height);
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