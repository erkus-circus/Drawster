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
            if (val !== undefined) {
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
                    this.on(a, callback);
                }
            }
            return this.forEach(function (elem) {
                elem.addEventListener(evt, function (e) {
                    callback(e, Erklib(elem));
                }, false);
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
                elem.removeEventListener(evt, function (e) {
                    callback(e, Erklib(elem));
                }, false);
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

        List.prototype.hasClass = function (className) {
            return this.map(function (elem) {
                return elem.className.split(" ").indexOf(className) >= 0;
            });
        }

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

        List.prototype.remove = function () {
            return this.forEach(function (elem) {
                elem.parentNode.removeChild(elem);
            });
        };

        List.prototype.ctx = function (name, ...args) {
            if (args.length < 1) {
                return this.map(function (elem) {
                    return elem.getContext("2d")[name];
                });
            } else {
                return this.map(function (elem) {
                    var ctx = elem.getContext("2d");
                    if (typeof ctx[name] === "function") {
                        return ctx[name](...args);
                    } else {
                        return ctx[name] = args[0];
                    }
                });
            }
        };

        List.prototype.parent = function () {
            return new Erklib(this.map(function (elem) {
                return elem.parentNode;
            }));
        }

        //METHODS:
        _meth('scroll');
        _meth("getContext", "ctx");
        //ATTRS:
        _attr('innerHTML', 'html'); // change innerHTML
        _attr('innerText', 'text'); // change Text
        _attr('value');
        _attr('download');
        _attr("name");
        _attr('id');
        _attr("children");
        _attr("href");
        _attr('checked')
        _attr('className');
        _attr('checked');
        _attr('title');
        _attr('src');
        _attr('width');
        _attr('height');
        _attr("type");
        _attr("min");
        _attr("max");
        _attr("offsetLeft");
        _attr("offsetTop");
        _attr("offsetRight");
        _attr("offsetBottom");

        // CSS:
        _css('width', 'csswidth');
        _css('height', 'cssheight');
        _css('cursor');
        _css('backroundColor');
        _css('cursor');
        _css("top");
        _css("left");
        _css("right");
        _css("bottom");
        _css('fontSize');
        _css('display');
        _css('background', 'bg');
        _css('zIndex');
        _css('scrollOverflow');
        _css('color');
        _css('transparency', 'transp');
        _css('visibility', 'visi');
        //Margins:
        _css('margin');
        _css('marginTop');
        _css('marginBotton');
        _css('marginLeft');
        _css('marginRight');
        //Paddings:
        _css('padding');
        _css('paddingTop', 'padTop');
        _css('paddingBotton', 'padBotton');
        _css('paddingLeft', 'padLeft');
        _css('paddingRight', 'padRight');

        // events:
        _evt('click');
        _evt("dblclick");
        _evt('focus');
        _evt('change');
        _evt('unfocus');
        _evt('mouseenter', 'mouseover');
        _evt('mouseleave', 'mouseout');
        _evt("mouseup");
        _evt("mousedown");
        _evt('mousemove');


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
                merge: function (...args) {
                    var res = [];
                    for (var i = 0; i < args.length; i++) {
                        var arr = args[i];
                        for (var j = 0; j < arr.length; j++) {
                            res.push(arr[j]);
                        }
                    }
                    return Erklib(res);
                },
                extend: function (toBeExt) {
                    var i = 2,
                        args = arguments;
                    for (; i < args.length; i++) {
                        for (var o in args[i]) {
                            toBeExt[o] = args[i][o];
                        }
                    }
                    return toBeExt;
                }
            });

            return __;
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
})(window, window.document);/* /canvas.js */
(function (window) {
    window.Project.prototype.Canvas = {
        width: 1000,
        height: 900,
        resizeCanvases: function (canvases) {
            for (i in canvases) {
                var canvas = canvases[i];

                canvas.width(this.width).csswidth(this.width).marginLeft(-this.width / 2);
                canvas.height(this.height).cssheight(this.height);
            }
        }
    };
})(window);(function (window) {
    window.Project.prototype.Config = {
        modes: {
            Pen: "Pen",
            Pencil: "Pencil",
            FromSource: "Source",
            Square: "Square",
        },
        selected: {
            from: [0, 0],
            // Value 
            to: [0, 0]
        },
        brushSize: 16,
        connectPoints: true
    };


})(window);/* /editor.js */
(function (window) {
    window.Project.prototype.Editor = {
        zoomOut: function () {
            alert('zoomed in')
        },
        zoomIn: function () {
            alert('zoomed in')
        }
    };
})(window);(function (window, $) {

})(window, window.$);/* /functions.js */
(function (window) {
    window.Project.prototype.Fn = {
        clear: function () {
            localStorage.clear();
            sessionStorage.clear();
            window.Project = new window.ProjectConstructor;
        },
        save: function () {
            alert("saving")
        },
        saveAs: function () {},
        open: function () {
            alert("Opened new project")
        },
        idIndex: 0,
        genID: function () {
            return `ID${++this.idIndex}-`;
        },

        getPath: function (path) {
            return path.split('.').reduce((o, i) => o[i], window);
        },

        swapArrayElem: function (array, i, j) {
            [array[i], array[j]] = [array[j], array[i]];
            return array;
        }
    };
})(window);/* /layers.js */
(function (window) {
    function updateLayers() {
        $(".canvases").html("");
        $(".layer-editor").html("");
        for (let i = 0; i < Project.Layers.layers.length; i++) {
            const layer = Project.Layers.layers[i];

            $(".canvases").append(layer.canvas);

            // selected layer

            //layer editor
            // ID of layer + S + (D|R|C|B(ox)) as selector, so when deleting layer, delete buttons
            var btnDel = $("<span>").className("layer-button delete-layer").id(layer.ID + "D");
            btnDel.text("D").title("Delete layer");
            btnDel.click(function (e, elem) {
                delLayer(elem.id()[0]);
            });

            var btnRen = $("<span>").className("layer-button rename-layer").id(layer.ID + "R").title("Rename layer");
            btnRen.text("R");
            btnRen.click(function (e, elem) {
                renameLayer(elem.id()[0]);
            });

            // move layer up
            var btnUp = $("<span>").className("layer-button up-layer").id(layer.ID + "UA").html("&uarr;").click(handleUpArrow).title("Move layer up");
            var btnDown = $("<span>").className("layer-button up-layer").id(layer.ID + "DA").html("&darr;").click(handleDownArrow).title("Move layer down");

            var btnShow = $("<pre>").className("layer-button toggle-layer").id(layer.ID + "SH").html("✓").click(handleToggleShow).title("Toggle if layer is showing");
            var buttonBox = $("<span>").className("layer-buttons").append($.merge(btnShow));

            var buttonBox2 = $("<span>").className("layer-buttons right").append($.merge(btnDel, btnRen, btnUp, btnDown));
            var nameBox = $("<span>").className("layer-name").id(layer.ID + "N").text(layer.name).title("Select layer to edit");

            var selector = $("<div>").className("layer-box left").id(layer.ID + "B").append(
                $([buttonBox[0], nameBox[0], buttonBox2[0]])
            );


            $('.layer-editor').prepend(selector);

        }
        $("#" + Project.Layers.selected + "B").addClass("layer-selected")

        // select layer
        $(".layer-name").click(setLayer);
    }

    function getLayerByIndex(index) {
        return Project.Layers.layers[index];
    }

    function setLayer(e, elem) {
        $(".layer-box").removeClass("layer-selected");
        elem.parent().addClass("layer-selected");

        Project.Layers.selected = getLayerByIndex(getLayerIndexByID(elem.id()[0])).ID;
    }

    function rawID(ID) {
        var ID2 = "";
        for (let i = 0; i < ID.length; i++) {
            ID2 += ID[i];
            if (ID[i] === "-") {
                break;
            }
        }
        return ID2;
    }

    function getLayerIndexByID(ID) {
        // SLICE ID TO ARG
        ID = rawID(ID);

        for (let i = 0; i < Project.Layers.layers.length; i++) {
            const layer = Project.Layers.layers[i];
            if (layer.ID == ID) {
                return i;
            }
        }
    }

    function delLayer(ID) {
        if (Project.Layers.layers.length < 2) {
            Project.MessageBox.setMessage("OneLayerError");
            Project.MessageBox.show();
            return;
        }
        $("#" + rawID(ID)).remove();
        $("#" + rawID(ID) + "B").remove();
        Project.Layers.layers.splice(getLayerIndexByID(ID), 1);
    }

    function renameLayer(ID) {
        Project.MessageBox.setMessage("RenameLayer");
        Project.MessageBox.set("ID", ID.slice(0, -1));
        Project.MessageBox.show();
    }


    function handleToggleShow(e, elem) {
        var ID = elem.id()[0];

        if (elem.text()[0] === "_") {
            elem.html("✓")
        } else {
            elem.html("_")
        }

        $("#" + Project.Layers.layers[getLayerIndexByID(ID)].ID).toggle();
    }

    function handleUpArrow(e, elem) {
        var ID = elem.id()[0];

        var index = getLayerIndexByID(ID);

        if (index === Project.Layers.layers.length - 1) {
            return;
        }
        Project.Fn.swapArrayElem(Project.Layers.layers, index, index + 1);
        updateLayers();
    }

    function handleDownArrow(e, elem) {
        var ID = elem.id()[0];

        var index = getLayerIndexByID(ID);

        if (index === 0) {
            return;
        }
        Project.Fn.swapArrayElem(Project.Layers.layers, index, index - 1);
        updateLayers();
    }

    // Rename

    window.Project.prototype.Layers = {
        selected: 'ID1-',
        Layer: class {
            ID = window.Project.Fn.genID();
            constructor(name) {
                this.name = name;
                // Add canvas:
                this.canvas = $("<canvas>").className("layer-canvas").id(this.ID);

                //this.write = new window.Project.Write(this.canvas.ctx("2d"));
            }
        },
        renameLayerConfirmed: function renameLayerConfirmed(input) {
            $("#" + Project.MessageBox.get("ID") + "N").text(input.name);
            Project.Layers.layers[getLayerIndexByID(Project.MessageBox.get("ID"))].name = input.name;
            Project.MessageBox.hide();
        },
        addLayer: function (input) {
            var name = input.name;

            // actual layer
            var newLayer = new Project.Layers.Layer(name);
            window.Project.Canvas.resizeCanvases([newLayer.canvas]);
            Project.Layers.layers.push(newLayer);
            updateLayers();
            setLayer(null, $("#" + newLayer.ID + "N"));
            Project.MessageBox.hide();
        },
        addLayerGUI: function () {
            Project.MessageBox.setMessage("NewLayer");
            Project.MessageBox.show();
        },
        layers: []
    };

    //LOADER: add background
    $(window).load(function () {
        Project.Layers.addLayer({
            name: "Background"
        });

    });
})(window);(function (window) {

    function createButton(btn, inputs) {
        var action = btn.action;
        var btnElem = $("<span>").className("msg-btn").text(btn.title).click(function () {
            // get inputs into object, name: value
            var inputObject = btn.args;
            $(".msg-input-value").map(function (l) {
                inputObject[l.name] = l.value;
            });
            window.Project.Fn.getPath(action)(inputObject);
        });
        $(".msg-btns").append(btnElem);
    }

    window.Project.prototype.MessageBox = {
        messageData: null,
        setMessage: function setMessage(name) {
            var message = messageData[name];
            $(".msg-title").text(message.title);
            $(".msg-content").text(message.content);

            $(".msg-btns").html("");
            $(".msg-inputs").html("");

            for (let i = 0; i < message.inputs.length; i++) {
                const input = message.inputs[i];
                var inputElem = $("<span>").className(".msg-input").text(input.content)
                    .append(
                        $("<input>").value(input.value).name(input.name).className("msg-input-value")
                    );
                $(".msg-inputs").append(inputElem);
            }

            for (let i = 0; i < message.buttons.length; i++) {
                createButton(message.buttons[i]);
            }
        },
        attrs: {},
        set: function (a, b) {
            this.attrs[a] = b;
        },
        get: function (a) {
            return this.attrs[a];
        },
        hide: function hide() {
            $(".outer-msg-box").hide();
            console.log("?");

        },
        show: function show() {
            $(".outer-msg-box").show();
        },
    };

    //LOADER:
    var messageData;
    $(window).load(async function () {
        const response = await fetch('/data/messages.json');
        const json = await response.json();
        window.Project.MessageBox.messageData = messageData = json;

    });
})(window);(function (window) {

    function createMenu(json) {
        json = json.B;
        $(".selector-box-title").text(json.title);

        for (let i = 0; i < json.inputs.length; i++) {
            const input = json.inputs[i];
            var inputElem = $("<span>").className("selector-input").text(input.title);

            if (input.type === "number") {
                inputElem.append($("<input>").type("number").value(input.value)
                    .className("selector-box-input").display("inline")
                    .min(input.range[0]).max(input.range[1]));
            }

            if (input.type === "checkbox") {
                var box = $("<label>").className("selector-box-switch").append($.merge(
                    $("<input>").type("checkbox").checked(input.value),
                    $("<span>").className("selector-box-slider")
                ))

                inputElem.append(box);
            }

            $(".selector-box-content").append(inputElem);
        }
    }

    function setMovement() {
        var sel = $(".selector-box-main");
        console.log(sel);

        sel.left(window.innerWidth / 5 + "px");
        sel.top(window.innerHeight / 5 + "px");


        sel.mousedown(function (e) {
            if (e.target === sel[0]) {
                Project.Selector.mouseDown = true;
            }
        });


        $(window).mouseup(function (e) {
            Project.Selector.mouseDown = false;
        });

        $(window).mousemove(function (e) {
            var sel = $(".selector-box-main");
            if (Project.Selector.mouseDown) {
                if (e.clientX - 16 < 0 || e.clientX + 16 > window.innerWidth ||
                    e.clientY - 16 < 0 || e.clientY + 16 > window.innerHeight) {
                    return;
                }
                sel.style("top", e.clientY - 32).style("left", e.clientX - 16);
            }
        });
    }

    $(window).load(async function () {
        var response = await fetch("/data/editConfigPages.json");
        var json = await response.json();

        window.Project.Selector = {
            mouseDown: false
        };

        setMovement();
        createMenu(json);
    });
})(window);(function (window) {
    window.Project.Theme = {

    }
})(window);/* /toolbar.js */
(function (window) {
    function createToolbar(data) {
        var parent = $("<div>").className("nav-menu");
        for (let i = 0; i < data.length; i++) {
            const {
                type,
                name,
            } = data[i];
            if (type === "button") {
                var elem = $("<span>").html(name).className("nav-button").click(function (e) {
                    data[i]["action"].split('.').reduce((o, i) => o[i], window)();
                });
                parent.append(elem);
            } else if (type === "dropdown") {
                var elem = $("<div>").html(name).className("nav-dropdown");
                elem.append(createToolbar(data[i].content));
                parent.append(elem);
            }
        }
        return parent;
    }

    $(window).load(async function () {
        const response = await fetch("/data/toolbar.json");
        const json = await response.json();
        $(".nav-bar").append(createToolbar(json));
    });
})(window);(function (window) {
    Project.prototype.Writer = class {

    }
})(window);