/*\
|||\ Eric Diskin
|||| 2018
|||/ Version: 0.1.8.0
\*/
//(function(window,document) {

var brush = {
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

function changeBrushImg(obj) {
    // TODO: identify
    var reader = new FileReader();
    reader.onload = function (eve) {
        var img = _.find('#img-hidden');
        _.find('#img-hidden').style.display = 'block';
        img.src = eve.target.result;
        brush.width = img.width;
        brush.height = img.height;
        brush.img = img;
        if (_.find('#img-stretch').checked) {
            //	var cImg = c.getImageData(0,0,canvas.width,canvas.height);
            //		c.putImageData(cImg,0,0);
            brush.img.onload = function () {
                c.drawImage(brush.img, 0, 0, canvas.width, canvas.height);
                _.find('#img-hidden').style.display = 'none';
            }
                ;
        }
        else {
            img.onload = function () {
                resizeCanvas('w', brush.width);
                resizeCanvas('h', brush.height);
                c.drawImage(brush.img, 0, 0, brush.width, brush.height);
                _.find('#img-hidden').style.display = 'none';
            }

        }

        img = _.find('#img');
        img.style.width = 25 + '%';
        img.src = eve.target.result;
        img.style.height = 25 + '%';
    }

    reader.readAsDataURL(obj.files[0]);
}

function saveErkspace() {
    // make the erkspace links downloadable
    var obj = {
        "brush": brush,
        "version": version,
        "versionFull": versionFull,
        "canvas": {
            "width": canvas.width,
            "height": canvas.height,
            "img": canvas.toDataURL('image/png')
        }

    };

    var data = 'data:text/erkspace;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj));
    $('#save-space').attr('href', data);
    $('#download').attr('href', canvas.toDataURL('image/png'));
    $('#download').download(brush.title + '.png');
}

function drawErkspace(obj) {
    // draw the erkspace obj on screen
    canvas.width = obj.canvas.width;
    canvas.height = obj.canvas.height;
    brush = obj.brush;
    var img = _.find('#save-img');
    img.style.display = 'block';
    img.src = obj.canvas.img;
    $(document).title('Drawster - ' + brush.title);
    img.onload = function () {
        c.drawImage(img, 0, 0);
        img.style.display = 'none';
    }

    setControls();
}

function uploadErkspace(input) {
    // upload an erkspace for editiing
    var fr = new FileReader();
    fr.onload = function (e) {
        var file = e.target.result;
        var obj = JSON.parse(decodeURIComponent(file));
        //if (typeof obj.versionFull === 'undefined' ){//|| versionFull.minor == obj.versionFull.minor) {
        drawErkspace(obj);
        //}
        //else {
        //    throw new Error('This version of Erkspace is not compatible.  please go to file:///E:/drawing/old/' + obj.version + '/draw.html to edit');
        //}

    }

    fr.readAsText(input.files[0]);
}

function setControls() {
    // change the title of the document.
    document.title = 'Drawster - ' + brush.title;
    _.find('#title').value = brush.title;
}

function toggleSwitch(type) { // for toggle switches
    // switch a .switch  for `type`.
    if (type == 'eraser' && _.find('#eraser').checked) {
        _.find('#draw-mode').innerHTML = 'on';
        brush.oldMode = brush.mode;
        brush.mode = 'erase';
    }
    else if (type == 'eraser') {
        _.find('#draw-mode').innerHTML = "off";
        brush.mode = brush.oldMode;
    }
    else if (type == 'shadow') {
        brush.shadow = {
            on: false,
            blur: 0,
            offX: 0,
            offY: 0,
            color: brush.color
        }

        _.find('#shadow-controls').style.display = 'none';
    }

    if (type == 'draw' && _.find('#draw-mode-switch').checked) {
        drawable = true;
        _.find('#mode-draw').innerHTML = 'Draw mode';
    } else if (type === "draw") {
        drawable = false;
        _.find('#mode-draw').innerHTML = 'View mode';
    }

    if (type == 'img') {
        if (_.find('#img-stretch').checked) {
            _.find('#img-stretch-show').innerHTML = 'on';
        }
        else {
            _.find('#img-stretch-show').innerHTML = 'off';
        }
    }
}

function lineChange(kind, value) { // change point from c.moveTo in line mode
    //TODO: ad better support for line making
    if (kind == 'x') {
        brush.line.from[0] = value;
    }
    else if (kind == 'y') {
        brush.line.from[1] = value;
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
    _.find('#brush-size').innerHTML = val;
}

function changeBlur(obj) {// change shadow blur

    var val = obj.value;
    brush.shadow.blur = val;
}

function changeMode(val) { // change brush modes
    brush.mode = val;
    if (brush.mode == 'line') {
        _.find('#line-controls').style.display = 'block';
    }
    else {
        _.find('#line-controls').style.display = 'none';
    }

}

function changeImgStyles(kind, obj) {
    if (kind == 'w') {
        brush.width = obj.value;
    }
    else if (kind == 'h') {
        brush.height = obj.value;
    }

}

_(window).load(function () { // window onload
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
        mousedown = true;
        brush.lastPos = mPos(e);
        draw(e);
        c.save();
        canvasObj.oldImages.push(c.getImageData(0, 0, canvas.width, canvas.height));
    }, true);
    canvs.on('touchend',function(e){
        mousedown = false;
        draw(e);
    });
    canvs.on('mousedown', function (e) {
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

    $('.nav-menu-item').click(function (e, elem) {
        var panel = $('.panel', e.target)
        //TODO: only one menu should be open at a time.

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

    window.addEventListener('keydown', function (e) {
        var cd = e.keyCode || e.wich;
        if (cd == 90 && e.ctrlKey) {
            undo();
        }
        else if (e.ctrlKey && cd == 89) {
            redo();
        }
        else if (e.ctrlKey && e.altKey && !e.shiftKey && cd == 67) {
            _.find('#color').click();
        }
        else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 67) {
            c.clearRect(0, 0, canvas.width, canvas.height);
        }
        else if (cd == 32) {
            brush.spaceBar = brush.spaceBar !== true;
        }
        else if (cd == 221 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            brush.size += (++brush.size * .04);
            $('#brush-size').html(Math.floor(brush.size))
        }
        else if (cd == 219 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (brush.size > 2) {
                brush.size -= (++brush.size * .04);
            }
            $('#brush-size').html(Math.floor(brush.size))
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
    $(window).on('mousemove', draw, true);
    $(canvas).on('contextmenu', (e) => e.preventDefault());
    //fun calls:
    resizeCanvas('a');
    initAdvancedBrushSets()
    
    // other:
    _.find('#color').value = (sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : '#000000';

    // other onload
    // PARAMS
    var params = _.GET();
    if (params != {}) {
        newTitle({ value: decur(_.GET("title").replace("+", ' \x0a')) });

        brush.color = decur(_.GET("main_color"));
        _("#color").value(brush.color)
        brush.transparency = decur(params.trans) / 10;
        canvas.width = decur(_.GET("width"));
        canvas.height = decur(_.GET("height"));
        brush.gramode = decur(_.GET("gramode"));
    }

});

function mPos(e) { // find mouse position on "canvas"
    var rt = canvas.getBoundingClientRect();
    if (e.touches) {
        // if touch evt
        return {
            x: e.touches[0].clientX - rt.left,
            y: e.touches[0].clientY - rt.top
        };
    }
    return {
        x: e.clientX - rt.left,
        y: e.clientY - rt.top
    };
}

function decur(str) { return decodeURIComponent(str); }

function draw(e) { // draws on the canvas, main function

    e.preventDefault();
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
    c.beginPath();

    c.shadowColor = brush.shadow.color;
    c.shadowBlur = brush.shadow.blur;
    c.shadowOffsetX = brush.shadow.offX;
    c.shadowOffsetY = brush.shadow.offY;
    c.globalAlpha = brush.transparency;

    if (mousedown && drawable && brush.mode == 'erase') {
        c.shadowColor = 0;
        c.shadowBlur = 0;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillStyle = brush.color;
        c.globalAlpha = 1;
        c.clearRect(pos.x - ((brush.size + brush.calig.size) / 2), pos.y - ((brush.size + brush.calig.size) / 2), brush.size + brush.calig.size, brush.size + brush.calig.size);
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
    updateTop()

    c.closePath()

    brush.lastPos.x = pos.x;
    brush.lastPos.y = pos.y;
    _.find('#mouse-pos').innerHTML = Math.round(pos.x) + ", " + Math.round(pos.y);

    if (brush.gramode > 0) {
        _.find('#download').href = canvas.toDataURL('image/png'); // download image on canvas
        if (brush.gramode > 1) {

            saveErkspace();
            if (brush.gramode > 2) {
                setControls();
            }
        }
    }
}

function updateTop() {
    var pos = brush.pos;
    console.log(pos);

    tc.beginPath()
    tc.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (brush.mode === 'pen') {
        tc.strokeStyle = brush.color;
        tc.shadowColor = 'white';
        tc.shadowBlur = 10;
        tc.arc(pos.x, pos.y, brush.size / 4 + brush.calig.size / 2, 0, Math.PI * 2);
        tc.stroke()
        tc.arc(pos.x + c.shadowOffsetX, pos.y + c.shadowOffsetY, (brush.size / 4 + brush.calig.size + c.shadowBlur / 1.5 / 2 ), 0, Math.PI * 2);
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

function makeBox() {
    
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

function uploadPack(input) {
    var fr = new FileReader();
    _(fr).ripe(function (e) {
        var obj = JSON.parse(decodeURIComponent(e.target.result));
        brush.pack = obj;
    }
    );
    fr.readAsText(input.files[0]);
}

function bgcup(val) { // change color of brush,
    // sets it in session storage
    brush.color = val;
    sessionStorage.setItem('color', val);
}

function trans(val) { // sets tranparency
    var t = val / 10; // / 10 because val is 1 through 10
    brush.transparency = t;
}

function resizeCanvas(dir, val) { // resizes canvas
    var canvasImg = c.getImageData(0, 0, canvas.width, canvas.height);
    if (dir == 'w') { // width
        canvas.width = val;
    }

    if (dir == 'h') { // height
        canvas.height = val;
    }

    if (dir == 'a') { // auto
        canvas.width = window.innerWidth / 1.4;
        canvas.height = window.innerHeight / 1.15;
    }
    else if (dir == 'f') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    _.find('#size-x').value = canvas.width;
    _.find('#size-y').value = canvas.height;

    $('.canvs').csswidth(canvas.width + 'px')
    $('.canvs').cssheight(canvas.height + 'px')


    $('canvas').each((el, i) => {
        el.style('zIndex', i);
    });

    topCanv.width = canvas.width
    topCanv.height = canvas.height;

    c.putImageData(canvasImg, 0, 0, 0, 0, canvas.width, canvas.height);
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
        $('#glbl-compos-select').append($('<option>').val(type).html(type.replace('-', ' ')))
        .change(function () {
            c.globalCompositeOperation = this.value;
        });
    });

}

function degTrad(deg) {
    return deg * Math.PI / 180;
}
