/*
 * Drawster Source Code
 * Eric Diskin
 * 2018
 */
/*
 * Eric Diskin
 * 3/21/20
 * Store project settings in one object
   no name yet, like erkspace
 */
(function (window, document) { // Erklib

    "use strict";

    function isArray(arr) {
        return typeof arr === "object" && typeof arr.length === "number";
    }

    function undefVar(v, d) {
        if (typeof v === "undefined") {
            return d;
        }
        return v;
    }

    function findElem(sel, scope, makeArr) {
        makeArr = undefVar(makeArr, true); // return array or not
        scope = undefVar(scope, document);

        var seltype = sel.charAt(0);
        var name = sel.substring(1, sel.length);


        if (seltype == ".") {
            return scope.getElementsByClassName(name);
        } else if (seltype == "#") {
            var elem = scope.getElementById(name);
            return makeArr ? [elem] : elem;
        } else {
            return scope.getElementsByTagName(sel);
        }
    }


    function init() {
        function List(elems, sel, scope) {
            for (var i = 0; i < elems.length; i++) {
                this[i] = elems[i];
                if (this[i] !== null && this[i].hasOwnProperty('style')) {
                    this[i].disp = this[i].style.display;
                } else {
                    if (this[i] !== null) {
                        this[i].disp = '';
                    }
                }
            }
            this.length = elems.length || 0;
            this.selector = sel;
            this.erk = true;
            this.scope = scope;
        }

        List.prototype.map = function (callback) {
            var res = [],
                num;
            if (typeof callback === "undefined") {
                callback = function (elem) {
                    return elem;
                };
            } else if (typeof callback === "number") {
                num = callback;
                callback = function (elem) {
                    return elem;
                };
                for (var i = 0; i < this.length; i++) {
                    res.push(callback.call(this, this[i], i));
                }
                return res[num];
            }
            for (var i = 0; i < this.length; i++) {
                res.push(callback.call(this, this[i], i));
            }
            return res;
        };

        List.prototype.each = function (callack) {
            return this.forEach(function (el, i) {
                callack(Erklib(el), i);
            });
        }

        List.prototype.forEach = function (callback) {
            this.map(callback)
            return this;
        }

        List.prototype.style = function (attr, val) {
            if (!val === undefined) {
                return this.forEach(function (elem) {
                    elem.style[attr] = val;
                });
            } else {
                return this.map(function (elem) {
                    return elem.style[attr];
                });
            }
        }

        function _attr(attr, title) {
            if (title === undefined) {
                title = attr;
            }

            List.prototype[title] = function (val) {
                if (val === undefined) {
                    return this.map(function (elem) {
                        return elem[attr]
                    });
                }
                return this.forEach((elem) => elem[attr] = val);
            };
        }

        function _css(attr, title) {
            if (title === undefined) {
                title = attr
            }
            List.prototype[title] = function (val) {
                if (val === undefined) {
                    return this.map((elem) => elem.style[attr]);
                }
                return this.forEach((elem) => elem.style[attr] = val);
            };
        }

        function _meth(name, dname) {
            if (dname === undefined) {
                dname = name;
            }
            List.prototype[dname] = function (...args) {
                return this.map((elem) => elem[name](...args));
            };
        }

        function _evt(attr, title) {
            if (title === undefined) {
                title = attr
            }
            List.prototype[title] = function (callback) {
                if (callback === undefined) {
                    return this.forEach(el => {
                        el[attr];
                    });
                }
                return this.on(attr, callback);
            };
        }

        List.prototype.append = function (elems) {
            return this.forEach(function (elemP, i) {
                elems.forEach(function (childElem) {
                    if (i > 0) {
                        childElem = childElem.cloneNode(true);
                    }
                    elemP.appendChild(childElem);
                });
            });
        };

        List.prototype.copy = function (tf) {
            tf = typeof tf === "boolean" ? tf : false;
            return new List(this.map(function (elem) {
                return elem.cloneNode(tf);
            }), this.selector);
        };

        List.prototype.prepend = function (elems) {
            return this.forEach(function (elemP, i) {
                for (var e = elems.length - 1; e >= 0; e--) {
                    var elem = (e > 0) ? elems[i].cloneNode(true) : elems[e];
                    elemP.insertBefore(elem, elemP.childNodes[0]);
                }
            });
        };

        List.prototype.attr = function (attr, val) {
            if (typeof val !== "undefined") {
                return this.forEach(function (elem) {
                    elem.setAttribute(attr, val);
                });
            } else {
                return this.map(function (elem) {
                    return elem.getAttribute(attr);
                });
            }
        };

        List.prototype.delattr = function (attr) {
            return this.forEach(function (elem) {
                elem.removeAttribute(attr)
            });
        }

        List.prototype.on = function (evt, callback) {
            if (evt.indexOf(' ') > 0) {
                for (let i = 0; i < evt.split(' ').length; i++) {
                    const a = evt.split(' ')[i];
                    this.on(a, callback)
                }
            }
            return this.forEach(function (elem) {
                elem.addEventListener(evt, callback, false, Erklib(elem));
            });
        }

        List.prototype.off = function (evt, callback) {
            if (evt.index(' ') >= 0) {
                for (let i = 0; i < evt.split(' ').length; i++) {
                    const a = evt.split(' ')[i];
                    this.off(a, callback)
                }
            }
            return this.forEach(function (elem) {
                elem.removeEventListener(evt, callback, false);
            });
        };

        List.prototype.show = function (callback = () => {}) {
            return this.forEach(function (elem, ti, i) {
                elem.style.display = 'block';
                callback(this, ti, i);
            });
        }

        List.prototype.load = function (callback) {
            return this.on('load', callback);
        }

        List.prototype.hide = function (callback = () => {}) {
            return this.forEach(function (elem, ti, i) {
                elem.style.display = 'none';
                callback(this, ti, i);
            });
        }

        List.prototype.toggle = function (callback = function () {}) {
            return this.forEach(function (elem, ti, i) {
                if (elem.style.display == 'none') {
                    Erklib(elem).show();
                } else {
                    elem.style.display = 'none';
                }
                callback(this, ti, i);
            });
        };

        List.prototype.parent = function () {
            return Erklib(this.map(function (el) {
                return el.parentElement;
            }));
        }

        List.prototype.removeClass = function (c) {
            this.forEach(function (elem) {
                var cn = elem.className.split(" "),
                    i;
                while ((i = cn.indexOf(c)) > -1) {
                    cn = cn.slice(0, i).concat((cn.slice(++i)));
                }
                elem.className = cn.join(" ");
            });
            return this;
        };

        List.prototype.addClass = function (c) {
            var cn = "";
            if (typeof c === "string") {
                cn += " " + c;
            } else {
                for (var cla = 0; cla < c.length; cla++) {
                    cn += " " + c[cla];
                }
            }
            this.forEach(function (elem) {
                elem.className += cn;
            });
            return this;
        };

        //METHODS:
        _meth('scroll');

        //ATTRS:
        _attr('innerHTML', 'html'); // change innerHTML
        _attr('innerText', 'text'); // change Text
        _attr('value', 'val');
        _attr('download');
        _attr('id');
        _attr("href");
        _attr('checked')
        _attr('className');
        _attr('checked');
        _attr('title');
        _attr('src');

        _attr('className', 'classes')
        _attr('width')
        _attr('height')
        // CSS:
        _css('width', 'csswidth')
        _css('height', 'cssheight')
        _css('cursor')
        _css('backroundColor', 'bgcolor')
        _css('cursor');
        _css('fontSize')
        _css('display');
        _css('background', 'bg')
        _css('zIndex')
        _css('scrollOverflow')
        _css('color')
        _css('transparency', 'transp')
        _css('visibility', 'visi')
        //Margins:
        _css('margin')
        _css('marginTop', 'margTop')
        _css('marginBotton', 'margBotton')
        _css('marginLeft', 'margLeft')
        _css('marginRight', 'margRight')
        //Paddings:
        _css('padding')
        _css('paddingTop', 'padTop')
        _css('paddingBotton', 'padBotton')
        _css('paddingLeft', 'padLeft')
        _css('paddingRight', 'padRight')

        // events:
        _evt('click');
        _evt('focus');
        _evt('change')
        _evt('unfocus');
        _evt('mouseenter', 'mouseover');
        _evt('mouseleave', 'mouseout');


        function strHasChar(str, char) {
            var arr = str.split("");
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === char) {
                    return true;
                }
            }
            return false;
        }

        function meths(__) {
            "use strict";
            __.assign = function (meth) {
                if (typeof meth === "object" && !isArray(meth)) {
                    for (var key in meth) {
                        __[key] = meth[key];
                    }

                } else if (typeof meth === "string") {
                    __[meth] == arguments[1];

                } else if (isArray(meth)) {
                    for (var i = 0; i < meth.length; i++) {
                        __.assign(meth[i]);
                    }
                }
            }

            __.assign({
                all: function () {
                    return __("*");
                },
                sel: function (sel, scope) {
                    return findElem(sel, scope, false)
                },
                fn: List.prototype,
                GET: function (attr) { // js equivelent to PHP `$_GET[]`
                    var wind = window.location.href,
                        h2 = wind.split("?")[1];
                    if (!strHasChar(wind, "?")) {
                        return {};
                    }
                    var res = {};
                    if (typeof attr === "undefined") { // returns all url params in key:value pairs. 
                        if (strHasChar(h2, "&")) {
                            var hs3 = h2.split("&");
                            for (var i = 0; i < hs3.length; i++) {
                                var a = hs3[i].split("=");
                                for (var e = 0; e < a.length; e += 2) {
                                    res[a[e]] = a[e + 1];
                                }
                            }
                        } else {
                            var arr = h2.split("=");
                            res[arr[0]] = arr[1];
                        }
                        return res;
                    } else {
                        var res = "";
                        if (strHasChar(wind, "&")) { // if url has multiple params.
                            var hs3 = h2.split("&");
                            for (var i = 0; i < hs3.length; i++) {
                                if (hs3[i].split("=")[0] == attr) {
                                    res = hs3[i].split("=")[1];
                                }
                            }
                        } else {
                            var arr = h2.split("=");
                            res = arr[1];
                        }
                        return res;
                    }
                },

                find: function (sel, scope, makeArr) {
                    return this.sel(sel, scope);
                },
                merge: function (arr1, arr2) {
                    var res = [],
                        args = arguments,
                        i = 0;
                    for (; i < arr2.length; i++) {
                        if (!isArray(arr2)) {
                            arr2 = [arr2];
                        }
                        arr1.push(arr2[i]);
                    }
                    if (args.length > 2) {
                        for (var a = 2; a < args.length; a++) {
                            if (!isArray(args[a])) {
                                args[a] = [args[a]];
                            }
                            for (var e = 0; e < args[a].length; e++) {
                                arr1.push(args[a][e]);
                            }
                        }
                    }
                    return arr1;
                },
                extend: function (overwrite, toBeExt) {
                    var i = 2,
                        args = arguments;
                    for (; i < args.length; i++) {
                        for (var o in args[i]) {
                            if (overwrite) {
                                toBeExt[o] = args[i][o];
                            } else if (o in toBeExt) {
                                continue;
                            } else {
                                toBeExt[o] = args[i][o];
                            }
                        }
                    }
                    return toBeExt;
                }
            });

            return __
        }
        var _ = function (sel, scope) {
            var elems;
            scope = undefVar(scope, document)
            if (typeof sel !== "undefined") {
                if (typeof sel === "string") {
                    if (sel.charAt(0) == "<" && sel.charAt(sel.length - 1) == ">") {
                        elems = [scope.createElement(sel.substring(1, sel.length - 1))]
                    } else {
                        elems = findElem(sel, scope);
                    }
                } else if (sel.length) {
                    elems = sel;
                } else {
                    elems = [sel];
                }
                List.prototype = Erklib.fn;

                return new List(elems, sel, scope)
            } else {
                return this;
            }
        };
        meths(_); // Add methods to _
        return _
    }

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = init()
    }
    window.$ = window._ = window.Erklib = init();
})(window, window.document);
var projectVersion = 0;
var altPressed = false;

var brush = {

    // show grid ontop of canvas.
    grid: false,

    // size of boxes
    gridSize: 8,
    layers: {},

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
    },
    rotate: 0,
    shadow: { // shadows
        on: true,
        blur: 0,
        offX: 0,
        offY: 0,
        color: 'black'
    },
    lastPos: {
        x: null,
        y: null
    },
    line: {
        from: [0, 0],
        lineWidth: 10
    },
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

var version = '0.8.0',
    vercsionFull = {
        major: 0,
        minor: 8,
        build: 0,
        patch: 0
    };

var menuOpen = null; // the open menu

var imageURL = '',
    drawable = true,
    makingSomething = 0;

let canvas;
let topCanv, tc;
let c; // context

var mousedown = false;

function setGridSize(value) {
    brush.gridSize = parseInt(value);
    drawCanvGrid();
}

function drawCanvGrid() {
    $("#loading-modal").show();
    var gc = $("#grid-canvas")[0].getContext('2d');
    setTimeout(() => {
        if (brush.grid) {
            gc.clearRect(0, 0, canvas.width, canvas.height);
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
// OLD LOADER
$(window).load(function () { // window onload
    //vars:
    topCanv = $('#top-canvas')[0];
    tc = topCanv.getContext('2d');
    canvs = $('canvas');

    brush.layers["Base"] = new Layer('Layer 0', 0);
    c = brush.layers["Base"].c;
    canvas = brush.layers["Base"].canvas[0];

    $('.layer-selector').change(function (e) {
        c = brush.layers[this.value].c;
        canvas = brush.layers[this.value].canvas[0];
    });

    brush.img = _.find('#brush-img');
    //event listeners:
    initNewCanvas(canvs);
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
                // no panel open
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
        } else if (e.ctrlKey && cd == 89) {
            redo();
        } else if (e.ctrlKey && e.altKey && !e.shiftKey && cd == 67) {
            $('.color').click();
        } else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 67) {
            c.clearRect(0, 0, canvas.width, canvas.height);
        } else if (cd == 32) {
            brush.spaceBar = !brush.spaceBar;
        } else if (cd == 221 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            brush.size += (++brush.size * .04);
            $('.brush-size').html(Math.floor(brush.size))
        } else if (cd == 219 && e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (brush.size > 2) {
                brush.size -= (++brush.size * .04);
            }
            $('.brush-size').html(Math.floor(brush.size))
        } else if (e.ctrlKey && e.altKey && e.shiftKey && cd == 70) {
            resizeCanvas('f');
        } else if (e.ctrlKey && cd == 83 && e.altKey) {
            //	_('#info-sheet').unfade();
            //	_('@wait',function() {
            //		_('#info-sheet').fade();
            //	}
            //,1100);
        }
        updateTop();
    }, true);

    // for some reason it doesent auto set.

    $(".quick-select").change(function (e) {
        console.log($("#" + e.target.value + "-tip").html()[0]);

        $("#quick-tip").html($("#" + e.target.value + "-tip").html()[0]);
    });

    $("#quick-tip").html($("#" + "Brush" + "-tip").html()[0]);

    // keep all inputs uniform
    $("input").change(uniformChange);
    $("select").change(uniformChange);

    $("#quick-tip").html($(".Brush-tip").html()[0]);

    $(window).on('mousemove', draw, true);
    //fun calls:
    initAdvancedBrushSets();

    // other:
    $('.color').val((sessionStorage.getItem('color')) ? sessionStorage.getItem('color') : '#000000');


    // set css width and height so no errors occur
    canvs.csswidth(canvs.width()[0] + 'px');
    canvs.cssheight(canvs.height()[0] + 'px');


    $("*").style('fontFamily', "'Indie Flower', cursive");
    // layer maker:


    // other onload
    // PARAMS
    resizeCanvas('l');
    $('#loading-modal').hide();

});

// NEW LOADER
$(window).load(function () {

});
(function ($) {
    $.fn.modal = function () {

        // click gray part
        this.click(function (e) {
            console.log(e);

            if (e.target === this && $('.close-btn', e.target)[0]) {
                $(this).hide();
            }
        });

        return this.forEach(el => {

            $('.close-btn', el).click(function () {
                $(el).hide();
            });
        });

    }
})(Erklib);

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
    } else if (dir == 'f') {
        canvs.width(window.innerWidth);
        canvs.height(window.innerHeight);
    }

    $('.size-x').val(canvs[0].width);
    $('.size-y').val(canvs[0].height);

    canvs.style('width', canvs[0].width + 'px');
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
    } else {
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
    } else if (type == 'eraser') {
        $('.draw-mode').html("off");
        brush.mode = brush.oldMode;
    }

    if (type == 'grid') {
        if (checked) {
            brush.grid = true;
            drawCanvGrid();
            $('.grid-option').show();
            $('.canvas-grid-text').html("on")
        } else {
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
        } else {
            $('.img-stretch-show').html('off');
        }
    }
}

function changeOFF(kind, obj) { // change offset for shadows
    // change offset of shadow on brush
    var val = obj.value;
    if (kind == 'x') {
        brush.shadow.offX = val;
    } else if (kind == 'y') {
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

function changeBlur(obj) { // change shadow blur

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

function draw(e) { // draws on the canvas, main function

    var pos = brush.pos = mPos(e);

    if (mousedown && brush.spaceBar) {
        brush.calig.size++;
    } else if (mousedown && !brush.spaceBar && brush.calig.size > 0) {
        brush.calig.size--;
    } else {
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
        } else {
            c.clearRect(pos.x - ((brush.size + brush.calig.size) / 2), pos.y - ((brush.size + brush.calig.size) / 2), brush.size + brush.calig.size, brush.size + brush.calig.size);
        }

    } else if (mousedown && drawable && brush.mode == 'pixel') {
        c.fillStyle = brush.color;
        c.fillRect(pos.x - ((brush.size + brush.calig.size) / 4), pos.y - ((brush.size + brush.calig.size) / 4), (brush.size + brush.calig.size) / 2, (brush.size + brush.calig.size) / 2);
    } else if (mousedown && drawable && brush.mode == 'image') {
        c.strokeStyle = brush.color;
        c.lineWidth = brush.line.lineWidth;
        c.drawImage(brush.img, pos.x - (brush.width / 2), pos.y - (brush.height / 2), brush.width, brush.height);
    } else if (mousedown && brush.mode == 'pen' && drawable) {
        c.lineJoin = 'round';
        c.lineCap = 'round';
        c.lineWidth = brush.size / 2 + brush.calig.size;
        c.strokeStyle = brush.color;
        c.moveTo(brush.lastPos.x, brush.lastPos.y);
        c.lineTo(pos.x, pos.y);
        c.stroke();
    } else if (mousedown && brush.mode == 'grid' && drawable) {
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
    } else {
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
    } else if (brush.mode === 'pixel') {
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




function mPos(e) { // find mouse position on "canvas"
    var rt = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rt.width, // relationship bitmap vs. element for X
        scaleY = canvas.height / rt.height; // relationship bitmap vs. element for Y

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

function decur(str) {
    return decodeURIComponent(str);
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