(function (window) {
    var lastPos = [0, 0];
    var inited = false;
    var lastMode = null;

    function initCanvas(name) {
        var newCanvas = $("<canvas>");
        newCanvas.className(`layer-canvas ${name}-canvas`);
        Project.Canvas.resizeCanvases([newCanvas]);
        Project.Draw[name].canvas = newCanvas;
        Project.Draw[name].ctx = newCanvas[0].getContext("2d");
        $(".top-canvases").append(newCanvas);
    }

    function emulateOpts() {
        return handleMove(null);
    }

    function handleMove(e) {
        if (!inited) {
            return;
        }
        
        const mode = Project.Config.mode;
        var pos;
        if(e === null) {
            pos = [null,null];
        } else {
            e.preventDefault();
            pos = Project.Fn.getMousePosition($(".top-canvas"), e);
        }
        var [a, b] = pos;
        var [c, d] = lastPos;

        // Options
        var options = {
            pos: pos,
            canvas: Project.Layers.selectedCanvas,
            ctx: Project.Layers.selectedContext,
            topCtx: Project.Draw[mode].ctx,
            topCanvas: Project.Draw[mode].canvas,
            lastPos: lastPos,
            eventType: e === null ? null : e.type,
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

        if (e === null) {
            return options;
        }
        Project.Draw[mode].Top(options);
        if (!Project.Layers.getLayerByID(Project.Layers.selected).showing) {
            // show warning
            return;
        }
        else {
            // show warning

        }
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

        Project.Draw.emulateDraw = emulateOpts;

        inited = true;
    }
})(window);