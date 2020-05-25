(function (window) {
    Project.prototype.Draw = {};
    Project.prototype.Draw.restore = function () {
        Project.Layers.selectedContext.restore();
        Project.Draw.drawCtx.restore();
        Project.Draw.selected = {
            X1: 0,
            Y1: 0,
            X2: Project.Canvas.width,
            Y2: Project.Canvas.height
        };
        Project.Draw["Selector"].ctx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height)
    };
    Project.prototype.Draw.clear = function (ctx) {
        ctx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
    };
})(window);(function (window) {
    window.Project.prototype.Config = {
        Mode: {
            Pen: "Pen",
            Pencil: "Pencil",
            FromSource: "Source",
            Select: "Select",
        },
        mode: "Pen",
        selected: {
            from: [0, 0],
            // Value 
            to: [0, 0]
        },
        size: 8,
        miterLimit: 10,
        lineCap: "round",
        lineJoin: "round",
        color: "#000",
        globalAlpha: 100,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000",
        SelectMode: "Rectangle",
        connectPoints: true,
        set: function (opt, val) {
            this[opt] = val;
        }
    };


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
            Project.Draw[lastMode].Deselect(options);
            lastMode = mode;
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
})(window);/*TODO: STARTOVER*/
(function (window) {
    var imageData = null;
    var translated = [0, 0]
    Project.prototype.Draw.Move = {};
    Project.prototype.Draw.Move.Top = function (opts) {};
    Project.prototype.Draw.Move.Up = function (opts) {

        opts.ctx.clearRect(
            Project.Draw.selected.X1,
            Project.Draw.selected.Y1,
            Project.Draw.selected.X2 - Project.Draw.selected.X1,
            Project.Draw.selected.Y2 - Project.Draw.selected.Y1
        );
        opts.ctx.setTransform(opts.topCtx.getTransform());
        opts.ctx.putImageData(opts.topCtx.getImageData(0, 0, Project.Canvas.width, Project.Canvas.height), ...translated);
        opts.ctx.setTransform(1, 0, 0, 1, 0, 0);
        opts.topCtx.setTransform(1, 0, 0, 1, 0, 0);
        Project.Draw.clear(opts.topCtx);
        translated = [0, 0];

    };
    Project.prototype.Draw.Move.Down = function (opts) {
        imageData = opts.ctx.getImageData(
            Project.Draw.selected.X1,
            Project.Draw.selected.Y1,
            Project.Draw.selected.X2 - Project.Draw.selected.X1,
            Project.Draw.selected.Y2 - Project.Draw.selected.Y1
        );
        opts.topCtx.beginPath();
    };
    Project.prototype.Draw.Move.Move = function (opts) {
        var c = opts.topCtx;
        Project.Draw.clear(c);
        translated[0] += opts.deltaX;
        translated[1] += opts.deltaY;

        c.translate(...translated);
        c.putImageData(imageData, ...translated);
    };
    Project.prototype.Draw.Move.Deselect = function (opts) {
        $(".layer-canvas").cursor("none");
    };
    Project.prototype.Draw.Move.Init = function (opts) {
        $(".layer-canvas").cursor("all-scroll");
    };
})(window);(function (window) {
    // alternate color of selector
    var alternating = true;

    Project.prototype.Draw.Pen = {};
    Project.prototype.Draw.Pen.Deselect = function (opts) {
        opts.ctx.restore();
        opts.topCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
    };
    Project.prototype.Draw.Pen.Top = function (opts) {
        alternating = !alternating;
        
        var c = opts.topCtx;
        c.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        c.beginPath();
        c.shadowBlur = 1;
        c.shadowColor = alternating ? "#fff": "#000";
        c.strokeStyle = !alternating ? "#fff" : "#000";


        c.arc(opts.pos[0], opts.pos[1], opts.config.size / 2, 0, 2 * Math.PI);
        c.stroke();
        c.beginPath();
        c.shadowBlur = 1;
        c.shadowColor = alternating ? "#fff" : "#000";
        c.strokeStyle = !alternating ? "#fff" : "#000";


        c.arc(opts.pos[0], opts.pos[1], 1, 0, 2 * Math.PI);
        c.fill();

    }
    Project.prototype.Draw.Pen.Move = function (opts) {
        var c = opts.ctx;
        var dc = Project.Draw.drawCtx;
        var config = opts.config;



        // LAYER:DRAW
        // Config
        c.lineWidth = config.size;
        c.shadowColor = config.shadowColor;
        c.shadowBlur = config.shadowBlur;
        c.globalAlpha = config.globalAlpha / 100;
        c.shadowOffsetX = config.shadowOffsetX;
        c.shadowOffsetY = config.shadowOffsetY;
        c.lineCap = "round";
        c.lineJoin = "round";

        c.strokeStyle = config.color;
        // Draw
        c.moveTo(...opts.lastPos);

        c.lineTo(...opts.pos);



        // LAYER:DRAW
        // Config
        dc.beginPath();
        dc.lineWidth = config.size;
        dc.shadowColor = config.shadowColor;
        dc.shadowBlur = config.shadowBlur;
        dc.globalAlpha = config.globalAlpha / 100;
        dc.shadowOffsetX = config.shadowOffsetX;
        dc.shadowOffsetY = config.shadowOffsetY;
        dc.lineCap = "round";
        dc.lineJoin = "round";

        dc.strokeStyle = config.color;
        // Draw
        dc.moveTo(...opts.pos);

        if (config.connectPoints) {
            dc.moveTo(...opts.lastPos);
        }
        dc.lineTo(...opts.pos);
        dc.stroke();
    };

    Project.prototype.Draw.Pen.Up = function (opts) {
        opts.topCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);
        Project.Draw.drawCtx.clearRect(0, 0, Project.Canvas.width, Project.Canvas.height);

        var c = opts.ctx;
        c.stroke();
        c.closePath();
        c.restore();
        Project.Draw.drawCtx.restore();
    };
    Project.prototype.Draw.Pen.Down = function (opts) {
        var c = opts.ctx;

        Project.Draw.clip(c);
        Project.Draw.clip(Project.Draw.drawCtx);
        c.beginPath();

        this.Move(opts);
    };
    Project.prototype.Draw.Pen.Init = function (opts) {}
})(window);(function (window) {

    /*
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
            };*/
    
    Project.prototype.Draw.Select = {
        topPos: [0,0],
        bottomPos: [0, 0],
        // if selected
        selected: false
    };

    Project.prototype.Draw.Select.Top = function (opts) {
        var cc = opts.topCtx;
        //Project.Draw.clear(cc);
        //cc.fillRect(...opts.pos, 1, 1);
    };

    Project.prototype.Draw.Select.Down = function (opts) {
        Project.Draw.Select.topPos = [...opts.pos];
        Project.Draw.Select.bottomPos = [...opts.pos];
    }

    Project.prototype.Draw.Select.Move = function (opts) {
        Project.Draw.Select.bottomPos = opts.pos;
        var tc = opts.topCtx;

        tc.beginPath();
        Project.Draw.clear(tc);
        console.log(Project.Draw.Select.topPos);

        tc.strokeRect(...Project.Draw.Select.topPos, Project.Draw.Select.bottomPos[0] - Project.Draw.Select.topPos[0], Project.Draw.Select.bottomPos[1] - Project.Draw.Select.topPos[1]);
    };

    Project.prototype.Draw.Select.Init = function (opts) { }
    
    Project.prototype.Draw.Select.Deselect = function (opts) { }
    
    Project.prototype.Draw.Select.Up = function (opts) {}

    // clip
    Project.prototype.Draw.clip = function (ctx) {
        if (Project.Draw.Select.selected) {
            ctx.save();

            // WRONG!!!!!!!!!!!
            ctx.clip(
                Project.Draw.Select.topPos.x,
                Project.Draw.Select.topPos.y,
                Project.Draw.Select.bottomPos.x,
                Project.Draw.Select.bottomPos.y
            );
        }
    };


    $(window).load(function () {
    });
})(window);