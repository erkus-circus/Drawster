/* /canvas.js */
(function (window) {
    window.Project.prototype.Canvas = {
        width: 900,
        height: 900,
        resizeCanvases: function (canvases) {
            for (i in canvases) {
                var canvas = canvases[i];
                for (let j = 0; j < canvas.length; j++) {
                    const ctx = canvas[j].getContext("2d");
                    var imageData = ctx.getImageData(0, 0, canvas[j].width, canvas[j].height);
                    $(canvas[j]).width(this.width).csswidth(this.width * Project.Editor.zoomLevel).marginLeft((-this.width - Project.Editor.zoomLevel) / 2);
                    $(canvas[j]).height(this.height).cssheight(this.height * Project.Editor.zoomLevel);
                    ctx.putImageData(imageData, 0, 0);
                }
            }
        },

        // resize canvases
        resize: function () {
            Project.MessageBox.setMessage("ResizeCanvases");
            Project.MessageBox.show();
        },

        resizeConfirmed: function (opts) {

            console.log("HER");
            

            Project.Canvas.width = parseInt(opts.width);
            Project.Canvas.height = parseInt(opts.height);

            Project.Canvas.resizeCanvases([$("canvas")]);

            Project.MessageBox.hide();
        }
    };
})(window);/* /editor.js */
(function (window) {
    $(window).load(function () {
        $(".content").on("wheel", function (e) {
            if (Project.Keys.isPressed("Alt") || Project.Keys.isPressed("Shift")) {
                e.preventDefault();
            }
            if (Project.Keys.isPressed("Alt")) {
                Project.Editor.zoom(e.deltaY);
            }
            if (Project.Keys.isPressed("Shift")) {
                window.scrollBy(e.deltaY, 0);
                
            }
        }, true);
    });
    window.Project.prototype.Editor = {
        zoomOut: function (delta) {
            Project.Editor.zoom(1)
        },
        zoomIn: function (delta) {
            Project.Editor.zoom(-1);
        },
        resetZoom: function () {
            Project.Editor.zoomLevel = 1;
            Project.Canvas.resizeCanvases([$("canvas")]);
        },
        zoomLevel: 1,
        zoom: function (delta) {
            if (delta < 0) {
                delta = 30
            } else {
                delta = -30
            }
            Project.Editor.zoomLevel += delta / 1000;
            Project.Canvas.resizeCanvases([$("canvas")]);
        }
    };
})(window);/* /functions.js */
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
        },
        getMousePosition: function (canvas, e) { // find mouse position on "canvas"
            var rt = canvas[0].getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width()[0] / rt.width, // relationship bitmap vs. element for X
                scaleY = canvas.height()[0] / rt.height; // relationship bitmap vs. element for Y

            return [
                (e.clientX - rt.left) * scaleX,
                (e.clientY - rt.top) * scaleY
            ];
        },
        distance: function (pos1, pos2) {
            return Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2));
        }
    };
})(window);(function (window) {


    function topCanvasEvents(canv, c) {
        canv.mousemove(function (e) {
            var pos = Project.Fn.getMousePosition(canv, e);
            c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
            c.beginPath();
            c.arc(pos[0], pos[1], Project.Config.brushSize / 2, 0, 2 * Math.PI);
            c.stroke();
        });

        canv.mouseout(function (e) {
            c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        })
    }


    $(window).load(function () {

        //Top Cnavas
        var topCanv = $("<canvas>").width(Project.Canvas.width).height(Project.Canvas.height);
        topCanv.className("top-canvas layer-canvas");
        topCanv.zIndex(60);
        $(".top-canvases").append(topCanv);
        Project.Canvas.resizeCanvases([topCanv]);
        Project.Draw.TopCtx = topCanv[0].getContext("2d");


        // Drawing Canvas
        var drawCanv = $("<canvas>").width(Project.Canvas.width).height(Project.Canvas.height);
        drawCanv.className("draw-canvas layer-canvas");
        drawCanv.zIndex(59);
        Project.Draw.drawCanv = drawCanv;
        Project.Draw.drawCtx = drawCanv[0].getContext("2d");

        $(".draw-canvases").append(drawCanv);
        window.Project.Canvas.resizeCanvases([drawCanv]);
        // init drawing
        Project.Draw.Init();
    });
})(window);/* /editor.js */
(function (window) {

    var controlKeys = [
        "Control",
        "Alt"
    ]

    window.Project.prototype.Keys = {
        pressed: [],
        isPressed: function (key) {
            return Project.Keys.pressed.indexOf(key) >= 0;
        }
    }
    $(window).load(function () {
        $(window).on("unfocus", function () {
            Project.Keys.pressed = [];
        })
        $(window).keydown(function (e) {

            if (controlKeys.includes(e.key)) {
                e.preventDefault();
            }

            if (Project.Keys.isPressed(e.key)) return;
            Project.Keys.pressed.push(e.key);
        });
        $(window).keyup(function (e) {

            if (controlKeys.includes(e.key)) {
                e.preventDefault();
            }

            while (Project.Keys.pressed.indexOf(e.key) >= 0) {
                Project.Keys.pressed.splice(Project.Keys.pressed.indexOf(e.key), 1);
            }
        });
    });
})(window);/* /layers.js */
(function (window) {
    function updateLayers() {
        $(".canvases").html("");
        $(".layer-editor").html("");
        for (let i = 0; i < Project.Layers.layers.length; i++) {
            const layer = Project.Layers.layers[i];

            // Set Z-Index for canvases, untested
            $(".canvases").append(layer.canvas.zIndex(i));

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

            var btnShow = $("<pre>").className("layer-button toggle-layer").id(layer.ID + "SH").html(layer.showing ? "✓" : "_").click(handleToggleShow).title("Toggle if layer is showing");
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

        var layer = getLayerByIndex(getLayerIndexByID(elem.id()[0]));
        Project.Layers.selected = layer.ID;
        Project.Layers.selectedCanvas = layer.canvas;
        Project.Layers.selectedContext = layer.ctx;


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
        Project.Layers.layers[getLayerIndexByID(ID)].showing = !Project.Layers.layers[getLayerIndexByID(ID)].showing;
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
        selectedCanvas: null,
        selectedContext: null,
        Layer: class {
            ID = window.Project.Fn.genID();
            showing = true;
            constructor(name) {
                this.name = name;
                // Add canvas:
                this.canvas = $("<canvas>").className("layer-canvas").id(this.ID);

                this.ctx = this.canvas[0].getContext("2d");
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
        var bottomCanvas = $("<canvas>").className("layer-canvas bottom-canvas").zIndex(-1);
        Project.Canvas.resizeCanvases([bottomCanvas]);
        $(".bottom-canvases").append(bottomCanvas);

        var c = bottomCanvas[0].getContext("2d");
        c.fillStyle = "#fff";
        c.fillRect(0, 0, Project.Canvas.width, Project.Canvas.height);
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
                        $("<input>").value(input.value).name(input.name).className("msg-input-value").type(input.type)
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
    var lastPos = [0, 0];
    var inited = false;
    var lastMode = null;

    function initCanvas(name) {
        var newCanvas = $("<canvas>").className(`layer-canvas ${name}-canvas`);
        Project.Canvas.resizeCanvases([newCanvas]);
        Project.Draw[name].canvas = newCanvas;
        Project.Draw[name].ctx = newCanvas[0].getContext("2d");
        $(".top-canvases").append(newCanvas);
    }

    function handleMove(e) {
        if (!inited) {
            return;
        }
        e.preventDefault();
        const mode = Project.Config.mode;
        var pos = Project.Fn.getMousePosition($(".top-canvas"), e);
        var [a, b] = pos;
        var [c, d] = lastPos;
        
        
        // Options
        var options = {
            pos: pos,
            canvas: Project.Layers.selectedCanvas,
            ctx: Project.Layers.selectedContext,
            topCtx: Project.Draw[mode].ctx,
            topCanvas: Project.Draw.topCanvas,
            lastPos: lastPos,
            eventType: e.type,
            deltaX: a - c,
            outOfBounds: true,
            deltaY: b - d,
            config: Project.Config
        };

        
        // Modes
        if (lastMode === null) {
            lastMode = mode;
        }
        if (mode != lastMode) {
            options.topCtx = Project.Draw[lastMode].ctx;
            Project.Draw[lastMode].Deselect(options);

            lastMode = mode;
            options.topCtx = Project.Draw[mode].ctx;
            Project.Draw[mode].Init(options);
        }


        Project.Draw[mode].Top(options);
        if (Project.Canvas.mousedown) {
            if (e.type === "mousedown") {
                Project.Draw[mode].Down(options);

            } else if (e.type === "mouseup") {
                Project.Draw[mode].Up(options);

            } else if (e.type === "mousemove") {
                Project.Draw[mode].Move(options);
            }
        }

        lastPos = pos;
    }

    Project.prototype.Draw.Init = async function () {

        $(".top-canvas").mousedown(function (e) {
            Project.Canvas.mousedown = true;
            handleMove(e);
        });

        $(".content").on("contextMenu",function (e) {
            e.preventDefault();
        })

        $(window).mousemove(handleMove);

        $(window).mouseup(function (e) {
            handleMove(e);
            Project.Canvas.mousedown = false;
        });

        
        const response = await fetch("/data/modes.json");
        const json = await response.json();

        for (let i = 0; i < json.length; i++) {
            const name = json[i];
            initCanvas(name);
        }

        inited = true;
    }
})(window);(function (window) {

    var pageBtns = {};

    function switchSelectorViews(e, elem, opts, defaultPage, name) {

        $(".selector-box").removeClass("btn-selected");
        elem.addClass("btn-selected");

        $('.page').hide();
        $(`.page-${defaultPage}`).show();

        Project.Config.pageOpen = defaultPage;

        $(".selector-box-menu-sections").html("");
        
        for (let i = 0; i < opts.length; i++) {
            $(".selector-box-menu-sections").append(pageBtns[opts[i]].clone(true));
        }
        $(".selector-box-menu-section-box").removeClass("btn-menu-selected");
        $(`.box-${defaultPage}`).addClass("btn-menu-selected");

        // change project mode
        Project.Config.mode = Project.Config.Mode[name];
    }

    function createMenu(json) {

        for (const key in json.pages) {
            var menu = json.pages[key];

            var page = $("<div>").className(`page-${key} page selector-box-content-menu`).hide();

            var s = $("<span>");
            s.className("selector-box-title");
            s.text(menu.name);

            page.append(s);
            
            var btnElem = $("<div>");
            btnElem.className(`selector-box selector-box-menu-section-box box-${key}`);
            btnElem.text(menu.name[0]);
            
            var name = $("<span>");
            name.className(`selector-box-section-hidden`);
            name.text(menu.name.slice(1));
            
            btnElem.append(name);
            
            btnElem.click(function (e, elem) {
                $(".selector-box-menu-section-box").removeClass("btn-menu-selected");
                elem.addClass("btn-menu-selected");
                Project.Config.pageOpen = key;
                $(`.page`).hide();
                $(`.page-${key}`).show();
            });
            
            pageBtns[key] = btnElem;
            
            for (let i = 0; i < json.pages[key].inputs.length; i++) {
                const input = menu.inputs[i];
                var inputElem = $("<span>").className("selector-input").text(input.title);
                inputElem.change(function (e, elem) {
                    var [value] = $(".selector-box-input", elem[0]).value();
                    console.log(value);

                    Project.Config[input.option] = value;
                });

                if (input.type === "number") {
                    inputElem.append($("<input>").type("number").value(input.value)
                        .className("selector-box-input").display("inline")
                        .min(input.range[0]).max(input.range[1]));
                } else if (input.type === "checkbox") {
                    var box = $("<label>").className("selector-box-switch").append($.merge(
                        $("<input>").type("checkbox").checked(input.value).className("selector-box-input"),
                        $("<span>").className("selector-box-slider")
                    ));

                    inputElem.append(box);
                } else if (input.type === "select") {
                    var select = $("<select>").className("selector-box-input");
                    for (let j in input.options) {
                        select.append($("<option>").text(j).value(input.options[j]));
                    }
                    inputElem.append(select);
                } else {
                    inputElem.append($("<input>").type(input.type).className("selector-box-input selector-box-" + input.type));
                }
                

                page.append(inputElem)
            }
            $(".selector-box-menu").append(page);
        }

        // left buttons toggle right buttons
        for (let i = 0; i < json.sidebuttons.length; i++) {
            const btn = json.sidebuttons[i];

            var btnElem = $("<div>").className(`selector-box-section selector-box selector-box-${btn.name}`).text(btn.name[0]);
            btnElem.append($("<span>").className(`selector-box-section-hidden`).text(btn.name.slice(1)));

            btnElem.click(function (e, elem) {
                switchSelectorViews(e, elem, btn.options, btn.defaultPage, btn.name);
                
            });

            $(".selector-box-sections").append(btnElem);
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

    window.Project.prototype.Selector = {
        mouseDown: false
    };
    
    $(window).load(async function () {
        var response = await fetch("/data/editConfigPages.json");
        var json = await response.json();


        setMovement();
        createMenu(json);

        // Show the Brush menu as the start
        switchSelectorViews(null, $('.selector-box-Pen'), json.sidebuttons[0].options, "color", "Pen");
    });
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
})(window);